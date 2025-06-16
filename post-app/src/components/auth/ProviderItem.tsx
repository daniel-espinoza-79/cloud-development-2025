import {
  CheckCircle2,
  Chrome,
  Facebook,
  Mail,
  Unlink,
} from "lucide-react";
import { Button } from "../ui/Button";
import type { AuthProvider, ProviderType } from "@/types/auth.types";

interface ProviderItemProps {
  provider: AuthProvider;
  onUnlink?: () => void;
  canUnlink: boolean;
  isUnlinking?: boolean;
}

const ProviderItem = ({
  provider,
  onUnlink,
  canUnlink,
  isUnlinking,
}: ProviderItemProps) => {
  const getProviderConfig = (type: ProviderType) => {
    const configs = {
      email: {
        icon: Mail,
        name: "Email/Password",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      },
      google: {
        icon: Chrome,
        name: "Google",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      facebook: {
        icon: Facebook,
        name: "Facebook",
        color: "text-indigo-600",
        bgColor: "bg-indigo-100",
      },
    };
    return configs[type];
  };

  const config = getProviderConfig(provider.type);
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{config.name}</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{provider.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        {canUnlink && onUnlink && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onUnlink}
            isLoading={isUnlinking}
            leftIcon={<Unlink className="h-3 w-3" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Desvincular
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderItem;