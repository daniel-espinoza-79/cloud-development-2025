import { Pencil, Trash2 } from "lucide-react";

interface EditButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}
const EditButtons = ({ onEdit, onDelete }: EditButtonsProps) => {
  return (
    <div className="flex gap-2 *:px-2 *:cursor-pointer *:py-2 *:hover:bg-gray-50/5 *:rounded-lg">
      <button onClick={onEdit}>
        <Pencil className=" h-4 w-4 text-primary-hover" />
      </button>
      <button onClick={onDelete}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
};

export default EditButtons;
