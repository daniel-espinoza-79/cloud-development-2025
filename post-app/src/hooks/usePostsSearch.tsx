import type { Post } from "@/types/posts.types";
import { useEffect, useState } from "react";

const usePostsSearch = (posts: Post[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  return {
    searchTerm,
    setSearchTerm,
    filteredPosts,
  };
};


export default usePostsSearch;