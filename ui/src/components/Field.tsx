import { useId, type ReactNode } from "react";
import { cn } from "../cn";

export type FieldProps = {
  label?: ReactNode;
  /** Help text under the field. Replaced by `error` when set. */
  hint?: ReactNode;
  error?: ReactNode;
};

/** Shared label + hint/error wrapper for Input, Textarea and Select. */
export function useField(id: string | undefined, { hint, error }: FieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const message = error ?? hint;
  return {
    fieldId,
    message,
    controlProps: {
      id: fieldId,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": message ? `${fieldId}-hint` : undefined,
    },
  };
}

export function Field({
  fieldId,
  label,
  message,
  error,
  className,
  children,
}: {
  fieldId: string;
  label?: ReactNode;
  message?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("sh-field", error ? "sh-field--error" : undefined, className)}>
      {label && (
        <label className="sh-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      {children}
      {message && (
        <span id={`${fieldId}-hint`} className="sh-field__hint">
          {message}
        </span>
      )}
    </div>
  );
}
