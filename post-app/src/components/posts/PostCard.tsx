import type { Post } from "@/types/posts.types";
import PostHeader from "./PostHeader";
import { Button } from "@/components/ui/Button";

interface PostCardProps {
  post: Post;
  onDelete: (post: Post) => void;
  toogleLike: (post: Post) => Promise<void>;
}

const PostCard = ({ post, onDelete, toogleLike }: PostCardProps) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 mb-4">
      <PostHeader post={post} onDelete={onDelete} />

      <div className="px-4 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
          {post.content}
        </p>
      </div>
      {post.imageUrl && (
        <div className="relative bg-gray-100">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-[500px] object-contain"
          />
        </div>
      )}
      <div className="p-4">
        <Button
          variant={post.liked === true ? "primary" : "ghost"}
          size="sm"
          onClick={() => toogleLike(post)}
        >
          {post.liked === true ? "Liked" : "Like"}
        </Button>
      </div>
    </article>
  );
};

export default PostCard;
