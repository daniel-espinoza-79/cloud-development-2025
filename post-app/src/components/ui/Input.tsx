import { AlertCircle } from "lucide-react";
import { INPUT_STYLES, DESIGN_TOKENS } from "@/constants/design.constants";
import { cn } from "@/utils/classNames.utils";
import Label from "./Label";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  readonly label?: string;
  readonly error?: string;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly required?: boolean;
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  id,
  required = false,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            INPUT_STYLES.base,
            error ? INPUT_STYLES.variants.error : INPUT_STYLES.variants.default,
            leftIcon ? "pl-10" : undefined,
            rightIcon ? "pr-10" : undefined,
            DESIGN_TOKENS.radius.md,
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};
