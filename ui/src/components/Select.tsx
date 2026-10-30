import { forwardRef, type SelectHTMLAttributes } from "react";
import { Field, useField, type FieldProps } from "./Field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldProps;

/** Native <select>, styled. Pass <option> elements as children. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, id, className, children, ...props }, ref) => {
    const { fieldId, message, controlProps } = useField(id, { hint, error });
    return (
      <Field fieldId={fieldId} label={label} message={message} error={error} className={className}>
        <div className="sh-select-wrap">
          <select ref={ref} className="sh-input" {...controlProps} {...props}>
            {children}
          </select>
        </div>
      </Field>
    );
  }
);
Select.displayName = "Select";
