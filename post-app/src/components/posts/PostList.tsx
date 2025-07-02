import type { Post } from "@/types/posts.types";
import PostCard from "./PostCard";
import EmptyPostList from "./EmptyPostState";

interface PostsListProps {
  posts: Post[];
  onDeletePost: (post: Post) => void;
  onCreateClick: () => void;
  onToggleLike: (post: Post) => Promise<void>;
}

const PostsList = ({
  posts,
  onDeletePost,
  onCreateClick,
  onToggleLike,
}: PostsListProps) => {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <EmptyPostList onCreateClick={onCreateClick} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: Post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDeletePost}
          toogleLike={onToggleLike}
        />
      ))}
    </div>
  );
};

export default PostsList;
