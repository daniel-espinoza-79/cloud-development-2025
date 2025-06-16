import { useAuth } from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import type { PostFormData } from "@/schemas/posts.schemas";
import type { Post } from "@/types/posts.types";
import { useState } from "react";
import ScreenLoader from "../ui/ScreenLoader";
import SearchBar from "../SearchBar";
import EmptyPostList from "./EmptyPostState";
import PostCard from "./PostCard";
import { Dialog } from "../ui/Dialog";
import PostForm from "./PostForm";
import usePostsSearch from "@/hooks/usePostsSearch";

const PostManagement: React.FC = () => {
  const {
    authState: { user },
  } = useAuth();
  const { posts, loading, error, createPost, deletePost } = usePosts(
    user?.id || ""
  );
  const { searchTerm, setSearchTerm, filteredPosts } = usePostsSearch(posts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePost = async (data: PostFormData) => {
    await createPost(data);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      alert("Error al eliminar el post. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return <ScreenLoader message="Loading posts ..." />;
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsDialogOpen(true)}
      />

      {filteredPosts.length === 0 ? (
        <EmptyPostList
          hasSearchTerm={!!searchTerm}
          onCreateClick={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <PostForm
          onSubmit={handleCreatePost}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default PostManagement;
