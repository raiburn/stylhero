import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";
import { Field, useField, type FieldProps } from "./Field";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldProps & {
  /** Icon or text inside the field, before the value (e.g. a search icon or "$"). */
  start?: ReactNode;
  /** Icon, text or IconButton inside the field, after the value (e.g. "kg"). */
  end?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, start, end, ...props }, ref) => {
    const { fieldId, message, controlProps } = useField(id, { hint, error });
    const input = <input ref={ref} className="sh-input" {...controlProps} {...props} />;
    return (
      <Field fieldId={fieldId} label={label} message={message} error={error} className={className}>
        {start || end ? (
          <div className={cn("sh-input-group", props.disabled && "sh-input-group--disabled")}>
            {start && <span className="sh-input-group__addon">{start}</span>}
            {input}
            {end && <span className="sh-input-group__addon">{end}</span>}
          </div>
        ) : input}
      </Field>
    );
  }
);
Input.displayName = "Input";
