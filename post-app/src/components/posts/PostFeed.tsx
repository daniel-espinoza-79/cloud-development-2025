import { useAuth } from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import type { PostFormData } from "@/schemas/posts.schemas";
import { useState } from "react";
import ScreenLoader from "../ui/ScreenLoader";
import WrongLoadView from "./WrongLoadView";
import HeaderFeedBox from "./HeaderFeedBox";
import PostsList from "./PostList";
import { Dialog } from "../ui/Dialog";
import PostForm from "./PostForm";
import type { Post } from "@/types/posts.types";

const PostFeed = () => {
  const {
    authState: { user },
  } = useAuth();

  const { posts, loading, error, createPost, deletePost } = usePosts(
    user?.id || ""
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePost = async (data: PostFormData) => {
    await createPost(data);
    setIsDialogOpen(false);
  };

  const handleDeletePost = async (post: Post) => {
    try {
      await deletePost(post);
    } catch (error) {
      console.error("Error when deleting post:", error);
      alert("Error when deleting post.");
    }
  };

  const openCreateDialog = () => setIsDialogOpen(true);

  if (loading) {
    return <ScreenLoader message="Loading your feed..." />;
  }

  if (error) {
    return <WrongLoadView error={error} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <HeaderFeedBox user={user} onCreateClick={openCreateDialog} />

      <PostsList
        posts={posts}
        onDeletePost={handleDeletePost}
        onCreateClick={openCreateDialog}
      />

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <PostForm
          onSubmit={handleCreatePost}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default PostFeed;
