import React from "react";
import { Button } from "@/components/ui/Button";
import { getProviderConfig } from "@/constants/provider.constants";
import type { SocialProvider } from "@/types/auth.types";

interface SocialButtonProps {
  provider: SocialProvider;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SocialButton = ({
  provider,
  onClick,
  disabled,
  children,
}: SocialButtonProps) => {
  const config = getProviderConfig(provider);
  const Icon = config.icon;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      leftIcon={<Icon className="h-4 w-4" />}
    >
      {children || config.name}
    </Button>
  );
};
