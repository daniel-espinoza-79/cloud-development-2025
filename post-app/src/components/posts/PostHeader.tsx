import { formatRelativeDate } from "@/utils/date.utils";
import Avatar from "./Avatar";
import { Button } from "../ui/Button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { Post } from "@/types/posts.types";

interface PostHeaderProps {
  post: Post;
  onDelete: (post: Post) => void;
}

const PostHeader = ({ post, onDelete }: PostHeaderProps) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post);
    }
  };

  return (
    <div className="p-4 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar titleName={post.username} />

          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-sm">{post.username}</h3>
            <p className="text-gray-500 text-xs">
              {formatRelativeDate(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            onClick={handleDelete}
            variant="destructive_light"
            size="sm"
            title="Eliminar post"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
