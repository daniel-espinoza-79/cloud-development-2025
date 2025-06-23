import { Loader2 } from "lucide-react";
import { BUTTON_STYLES, DESIGN_TOKENS } from "@/constants/design.constants";
import { cn } from "@/utils/classNames.utils";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "destructive_light";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly isLoading?: boolean;
  readonly leftIcon?: React.ReactNode;
}


export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  leftIcon,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        BUTTON_STYLES.base,
        BUTTON_STYLES.variants[variant],
        BUTTON_STYLES.sizes[size],
        DESIGN_TOKENS.radius.md,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};
