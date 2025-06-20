import type { Post } from "@/types/posts.types";
import PostHeader from "./PostHeader";

interface PostCardProps {
  post: Post;
  onDelete: (post: Post) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
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
      {post.imageUrl &&
        <div className="relative bg-gray-100">
          <img
            src={
              post.imageUrl
            }
            alt="Post content"
            className="w-full h-[500px] object-contain"
          />
        </div>
      }
    </article>
  );
};

export default PostCard;
