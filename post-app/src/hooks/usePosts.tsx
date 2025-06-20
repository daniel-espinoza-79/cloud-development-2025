/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/config/firebase.config";
import type { PostFormData } from "@/schemas/posts.schemas";
import type { Post } from "@/types/posts.types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { fileService } from "@/services/FileService";

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (data: PostFormData) => Promise<void>;
  deletePost: (post: Post) => Promise<void>;
  refreshPosts: () => void;
}

const usePosts = (userId: string): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState: user } = useAuth();

  const resetState = useCallback(() => {
    setPosts([]);
    setLoading(true);
    setError(null);
  }, []);

  const refreshPosts = useCallback(() => {
    resetState();
  }, [resetState]);

  useEffect(() => {
    if (!userId || !userId.trim()) {
      setLoading(false);
      setError("User ID is required");
      return;
    }

    resetState();

    const loadPostsOnce = async () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(postsQuery);
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPosts(postsData);
        setLoading(false);
      } catch (indexError) {
        console.warn(
          "Index query failed, falling back to simpler query:",
          indexError
        );

        try {
          const fallbackQuery = query(
            collection(db, "posts"),
            where("userId", "==", userId)
          );




          const fallbackSnapshot = await getDocs(fallbackQuery);
          const fallbackData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          const sortedPosts = fallbackData.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
          });

          setPosts(sortedPosts);
          setLoading(false);
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          setError(
            "Failed to load posts. Please check your connection and try again."
          );
          setLoading(false);
        }
      }
    };

    let unsubscribe: (() => void) | null = null;

    const setupRealtimeListener = () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(
          postsQuery,
          (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Post[];

            setPosts(postsData);
            setLoading(false);
            setError(null);
          },
          (listenerError) => {
            console.warn(
              "Real-time listener failed, using one-time fetch:",
              listenerError
            );
            loadPostsOnce();
          }
        );
      } catch (setupError) {
        console.warn("Could not setup real-time listener:", setupError);
        loadPostsOnce();
      }
    };

    setupRealtimeListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, resetState]);

  const createPost = async (data: PostFormData): Promise<void> => {
    if (!userId || !userId.trim()) {
      throw new Error("User ID is required to create a post");
    }

    if (!data.title?.trim() || !data.content?.trim()) {
      throw new Error("Title and content are required");
    }

    try {
      const now = Timestamp.now();
      const tempId = `temp_${Date.now()}`;
      const optimisticPost: Post = {
        id: tempId,
        userId,
        username: user.user?.name ?? user.user?.email ?? userId,
        imageUrl: data.imageUrl,
        imageName: data.imageName,
        title: data.title.trim(),
        content: data.content.trim(),
        createdAt: now,
        updatedAt: now,
      };

      setPosts((prevPosts) => [optimisticPost, ...prevPosts]);

      let dataToSave: any = {
        userId,
        title: data.title.trim(),
        username: user.user?.name ?? user.user?.email ?? userId,
        content: data.content.trim(),
        createdAt: now,
        updatedAt: now,
      };

      if (data.imageName) {
        dataToSave = {
          ...dataToSave,
          imageUrl: data.imageUrl,
          imageName: data.imageName,
        };
      }
      const docRef = await addDoc(collection(db, "posts"), dataToSave);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === tempId ? { ...post, id: docRef.id } : post
        )
      );
    } catch (createError) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => !post.id.startsWith("temp_"))
      );

      console.error("Error creating post:", createError);
      throw new Error("Failed to create post. Please try again.");
    }
  };

  const deletePost = async (post: Post): Promise<void> => {
    if (!post) {
      throw new Error("Post ID is required");
    }
    const postId = post.id;

    const originalPosts = [...posts];

    try {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      await deleteDoc(doc(db, "posts", postId));
      if (post.imageUrl) {
        await fileService.deleteImage(post.imageName);
      }
    } catch (deleteError) {
      setPosts(originalPosts);

      console.error("Error deleting post:", deleteError);
      throw new Error("Failed to delete post. Please try again.");
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refreshPosts,
  };
};

export default usePosts;
