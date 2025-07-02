/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, functions } from "@/config/firebase.config";
import { httpsCallable } from "firebase/functions";
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
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { fileService } from "@/services/FileService";
import useFirebaseNotifications from "./useFirebaseNotifications";
import { usePostsTrigger } from "@/contexts/RefeshPostContext";

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (data: PostFormData) => Promise<void>;
  deletePost: (post: Post) => Promise<void>;
  refreshPosts: () => void;
  toggleLike: (post: Post) => Promise<void>;
}

const usePosts = (userId: string): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState: user } = useAuth();
  const { triggerValue } = usePostsTrigger();

  const { sendBulkNotifications } = useFirebaseNotifications();
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
        const getPostsFn = httpsCallable(functions, "getPosts");
        const result = await getPostsFn();
        const data = result.data as { posts: Post[] };

        setPosts(data.posts);
        setLoading(false);
      } catch (indexError) {
        console.error("Fallback query also failed:", indexError);
        setError(
          "Failed to load posts. Please check your connection and try again."
        );
        setLoading(false);
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
  }, [userId, resetState, triggerValue]);

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
        likesCount: 0,
        liked: false,
        createdAt: now,
        updatedAt: now,
      };

      setPosts((prevPosts) => [optimisticPost, ...prevPosts]);

      let dataToSave: any = {
        userId,
        title: data.title.trim(),
        username: user.user?.name ?? user.user?.email ?? userId,
        content: data.content.trim(),
        likesCount: 0,
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
      console.log("Post created with ID:", docRef.id);

      await sendBulkNotifications(
        `New post from ${dataToSave.username}`,
        dataToSave.title.length > 50
          ? `${dataToSave.title.substring(0, 50)}...`
          : dataToSave.title,
        {
          postId: docRef.id,
          authorId: dataToSave.userId,
          authorName: dataToSave.username,
          type: "NEW_POST",
        }
      );

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

  const toggleLike = async (post: Post): Promise<void> => {
    if (!post?.id) {
      throw new Error("Post ID is required");
    }

    const postId = post.id;
    const originalPosts = [...posts];

    try {
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, liked: !p.liked } : p))
      );

      const callable = httpsCallable(functions, "toggleLike");
      const result = await callable({ postId });

      const { liked, likesCount } = result.data as {
        liked: boolean;
        likesCount: number;
      };

      // Optionally update likesCount after backend response
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, liked, likesCount } : p
        )
      );
    } catch (error) {
      setPosts(originalPosts);
      console.error("Error toggling like:", error);
      throw new Error("Failed to toggle like. Please try again.");
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refreshPosts,
    toggleLike,
  };
};

export default usePosts;
