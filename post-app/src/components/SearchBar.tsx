import { Plus, Search } from "lucide-react";
import { Button } from "./ui/Button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onAddClick,
}: SearchBarProps) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-8">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search ..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
      />
    </div>
    <Button
      onClick={onAddClick}
    >
      <Plus className="h-5 w-5" />
      Add Post
    </Button>
  </div>
);

export default SearchBar;
