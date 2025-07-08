import type { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = (props: LabelProps) => {
  return (
    <label {...props} className={`form-label ${props.className}`}>
      {props.children}{" "}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
