import type { Post } from "@/types/posts.types";
import type { Timestamp } from "firebase/firestore";
import { Calendar, Trash2, User } from "lucide-react";

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0"
          title="Eliminar post"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-wrap line-clamp-4">
        {post.content}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>Tu post</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
