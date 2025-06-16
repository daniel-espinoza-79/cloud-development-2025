import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ALERT_STYLES } from "@/constants/design.constants";
import { cn } from "@/utils/classNames.utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly variant?: AlertVariant;
}

export type AlertVariant = "success" | "error" | "warning" | "info";

export const Alert = ({
  children,
  variant = "info",
  className,
  ...props
}: AlertProps) => {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <AlertCircle className="h-5 w-5" />,
  };

  return (
    <div
      className={cn(
        ALERT_STYLES.base,
        ALERT_STYLES.variants[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1">{children}</div>
    </div>
  );
};
