import { forwardRef, useState } from "react";
import { MinusIcon, PlusIcon } from "../icons";
import { Field, useField, type FieldProps } from "./Field";

export type NumberInputProps = FieldProps & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

/** Number field with − and + buttons (MUI Base's NumberInput). Arrow keys step; typing is clamped on blur. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, id, name, disabled, label, hint, error, className }, ref) => {
    const { fieldId, message, controlProps } = useField(id, { hint, error });
    const [internal, setInternal] = useState(defaultValue);
    const current = value ?? internal;
    const [draft, setDraft] = useState<string | null>(null);
    const clamp = (n: number) => Math.min(max, Math.max(min, n));
    const commit = (n: number) => {
      const next = clamp(Number.isFinite(n) ? n : current);
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
      setDraft(null);
    };
    return (
      <Field fieldId={fieldId} label={label} message={message} error={error} className={className}>
        <div className="sh-number">
          <button type="button" className="sh-number__btn" aria-label="Decrease" tabIndex={-1} disabled={disabled || current <= min} onClick={() => commit(current - step)}>
            <MinusIcon />
          </button>
          <input
            ref={ref}
            {...controlProps}
            className="sh-input"
            inputMode="decimal"
            role="spinbutton"
            aria-valuenow={current}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            name={name}
            disabled={disabled}
            value={draft ?? String(current)}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => draft !== null && commit(parseFloat(draft))}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") { e.preventDefault(); commit(current + step); }
              if (e.key === "ArrowDown") { e.preventDefault(); commit(current - step); }
              if (e.key === "Enter" && draft !== null) commit(parseFloat(draft));
            }}
          />
          <button type="button" className="sh-number__btn" aria-label="Increase" tabIndex={-1} disabled={disabled || current >= max} onClick={() => commit(current + step)}>
            <PlusIcon />
          </button>
        </div>
      </Field>
    );
  }
);
NumberInput.displayName = "NumberInput";
