import { forwardRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import { Field, useField, type FieldProps } from "./Field";

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "min" | "max"> &
  FieldProps & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    /** Show the current value next to the label. Pass a function to format it. */
    showValue?: boolean | ((value: number) => ReactNode);
  };

/** Native range input, styled. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ id, label, hint, error, value, defaultValue, onValueChange, showValue, min = 0, max = 100, className, ...props }, ref) => {
    const { fieldId, message, controlProps } = useField(id, { hint, error });
    const [internal, setInternal] = useState(defaultValue ?? min);
    const current = value ?? internal;
    const pct = ((current - min) / (max - min)) * 100;
    const shown = typeof showValue === "function" ? showValue(current) : showValue ? current : null;
    return (
      <Field
        fieldId={fieldId}
        label={label && shown !== null ? <span className="sh-slider__label">{label}<output htmlFor={fieldId}>{shown}</output></span> : label}
        message={message}
        error={error}
        className={className}
      >
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={current}
          className="sh-slider"
          style={{ "--sh-fill": `${pct}%` } as CSSProperties}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (value === undefined) setInternal(v);
            onValueChange?.(v);
          }}
          {...controlProps}
          {...props}
        />
      </Field>
    );
  }
);
Slider.displayName = "Slider";
