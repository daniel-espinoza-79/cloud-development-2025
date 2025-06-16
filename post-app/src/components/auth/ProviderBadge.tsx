import { Unlink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProviderConfig } from "@/constants/provider.constants";
import { formatDate } from "@/utils/date.utils";
import { cn } from "@/utils/classNames.utils";
import type { AuthProvider } from "@/types/auth.types";

interface ProviderBadgeProps {
  provider: AuthProvider;
  onUnlink?: (providerId: string) => void;
  canUnlink?: boolean;
}

export const ProviderBadge = ({
  provider,
  onUnlink,
  canUnlink = true,
}: ProviderBadgeProps) => {
  const config = getProviderConfig(provider.type);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border",
        config.color
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        <div>
          <p className="font-medium text-sm">{provider.name}</p>
          <p className="text-xs opacity-75">{provider.email}</p>
          <p className="text-xs opacity-60">
            Add on {formatDate(provider.linkedAt)}
          </p>
        </div>
      </div>
      {canUnlink && onUnlink && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onUnlink(provider.id)}
          leftIcon={<Unlink className="h-3 w-3" />}
        >
          Remove {config.name}
        </Button>
      )}
    </div>
  );
};
