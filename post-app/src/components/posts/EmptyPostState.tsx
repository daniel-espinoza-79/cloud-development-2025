import { Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface EmptyStateProps {
  hasSearchTerm: boolean;
  onCreateClick: () => void;
}

const EmptyPostList = ({ hasSearchTerm, onCreateClick }: EmptyStateProps) => (
  <div className="text-center py-16">
    <h3 className="text-xl font-medium text-gray-900 mb-3">
      {hasSearchTerm ? "No posts found" : "There are no posts"}
    </h3>

    {!hasSearchTerm && (
      <Button onClick={onCreateClick}>
        <Plus className="h-5 w-5" />
        Create Post
      </Button>
    )}
  </div>
);

export default EmptyPostList;
