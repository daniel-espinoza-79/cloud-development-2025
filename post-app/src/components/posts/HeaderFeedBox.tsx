import { Button } from "../ui/Button";
import { Edit3 } from "lucide-react";
import Avatar from "./Avatar";
import type { User } from "@/types/auth.types";

interface HeaderFeedBoxProps {
  user: User | null;
  onCreateClick: () => void;
}

const HeaderFeedBox = ({ user, onCreateClick }: HeaderFeedBoxProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <Avatar titleName={user?.name} />

        <button
          onClick={onCreateClick}
          className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-3 text-left text-gray-500 transition-colors"
        >
          What is on your mind?
        </button>

        <Button onClick={onCreateClick}>
          <Edit3 className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
};

export default HeaderFeedBox;
