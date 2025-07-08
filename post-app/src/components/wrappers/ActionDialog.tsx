import { Button } from "../ui/Button";
import Dialog from "../ui/Dialog";
import { Plus } from "lucide-react";
interface ActionDialogProps {
  children?: React.ReactNode;
  label?: string;
  isVisible?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ActionDialog = ({
  label = "Add new",
  children,
  isVisible = true,
  isOpen,
  setIsOpen,
}: ActionDialogProps) => {
  const handleClose = () => setIsOpen(false);
  return (
    <div className={isVisible ? "" : "hidden"}>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {label}
      </Button>
      <Dialog isOpen={isOpen} onClose={handleClose}>
        {children}
      </Dialog>
    </div>
  );
};

export default ActionDialog;
