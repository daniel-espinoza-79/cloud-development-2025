import { Button } from "./Button";
import Dialog from "./Dialog";

interface AlertDialogProps {
  isOpen: boolean;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertDialog = ({
  isOpen,
  itemName,
  onClose,
  onConfirm,
}: AlertDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="bg-tertiary">
        <h2 className="text-lg text-primary font-semibold mb-4">
          Are you sure?
        </h2>
        <p className="text-gray-200">
          {` Are you sure you want to delete "${itemName}"?`}
        </p>
      </div>
      <div className="flex justify-end p-1">
        <Button size="sm" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={onConfirm}>Delete</Button>
      </div>
    </Dialog>
  );
};

export default AlertDialog;
