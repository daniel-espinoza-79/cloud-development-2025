import { Button } from "./ui/Button";
import { Dialog } from "./ui/Dialog";

interface EnableNotificationsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  enable: () => void;
}

const EnableNotificationsDialog = ({
  isOpen,
  setIsOpen,
  enable,
}: EnableNotificationsDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      children={
        <div className="p-4">
          <h1>ALLOW NOTIFICATIONS</h1>
          <Button type="button" onClick={enable}>
            ENABLE
          </Button>
        </div>
      }
    />
  );
};

export default EnableNotificationsDialog;
