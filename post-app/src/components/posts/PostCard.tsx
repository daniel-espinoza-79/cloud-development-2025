import type { Post } from "@/types/posts.types";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      onDelete(post.id);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex-1 line-clamp-2">
          {post.title}
        </h2>
        <Button
          onClick={handleDelete}
          variant="destructive"
          title="Eliminar post"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-wrap line-clamp-4">
        {post.content}
      </p>
    </article>
  );
};

export default PostCard;
