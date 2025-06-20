import { DESIGN_TOKENS, INPUT_STYLES } from "@/constants/design.constants";
import { cn } from "@/utils/classNames.utils";
import { AlertCircle } from "lucide-react";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = ({ label, id, error, className, ...props }: TextAreaProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          INPUT_STYLES.base,
          error ? INPUT_STYLES.variants.error : INPUT_STYLES.variants.default,
          DESIGN_TOKENS.radius.md,
          className
        )}
        {...props}
      ></textarea>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
