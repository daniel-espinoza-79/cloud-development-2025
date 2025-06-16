import type { SocialProvider } from "@/types/auth.types";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface AddProviderItemProps {
  provider: SocialProvider;
  onLink: () => void;
  isLinking: boolean;
}
const AddProviderItem = ({
  provider,
  onLink,
  isLinking,
}: AddProviderItemProps) => {
  const config = {
    google:"Google",
    facebook: "Facebook",
  
  };

  const providerConfig = config[provider];

  return (
    <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
      <h3 className="font-medium text-gray-900">{providerConfig}</h3>
      <Button
        onClick={onLink}
        isLoading={isLinking}
        leftIcon={<Plus className="h-4 w-4" />}
        disabled={isLinking}
      >
        Add {providerConfig}
      </Button>
    </div>
  );
};

export default AddProviderItem;
