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
  getDocs
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (data: PostFormData) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  refreshPosts: () => void;
}

const usePosts = (userId: string): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cleanup function to reset state
  const resetState = useCallback(() => {
    setPosts([]);
    setLoading(true);
    setError(null);
  }, []);

  // Refresh posts manually
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

    // SOLUTION 1: Use getDocs for initial load (no index required)
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

        // SOLUTION 2: Fallback to query without orderBy (no index needed)
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

          // Sort manually on client-side
          const sortedPosts = fallbackData.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA; // Descending order (newest first)
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

    // SOLUTION 3: Real-time listener with error handling
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

    // Try real-time listener first, fallback to one-time fetch
    setupRealtimeListener();

    // Cleanup function
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

      // Optimistic update - add to local state immediately
      const tempId = `temp_${Date.now()}`;
      const optimisticPost: Post = {
        id: tempId,
        userId,
        title: data.title.trim(),
        content: data.content.trim(),
        createdAt: now,
        updatedAt: now,
      };

      setPosts((prevPosts) => [optimisticPost, ...prevPosts]);

      // Create in Firestore
      const docRef = await addDoc(collection(db, "posts"), {
        userId,
        title: data.title.trim(),
        content: data.content.trim(),
        createdAt: now,
        updatedAt: now,
      });

      // Update the temporary post with the real ID
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === tempId ? { ...post, id: docRef.id } : post
        )
      );
    } catch (createError) {
      // Remove optimistic update on error
      setPosts((prevPosts) =>
        prevPosts.filter((post) => !post.id.startsWith("temp_"))
      );

      console.error("Error creating post:", createError);
      throw new Error("Failed to create post. Please try again.");
    }
  };

  const deletePost = async (postId: string): Promise<void> => {
    if (!postId || !postId.trim()) {
      throw new Error("Post ID is required");
    }

    // Store original posts for rollback
    const originalPosts = [...posts];

    try {
      // Optimistic update - remove from local state immediately
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      // Delete from Firestore
      await deleteDoc(doc(db, "posts", postId));
    } catch (deleteError) {
      // Rollback on error
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
