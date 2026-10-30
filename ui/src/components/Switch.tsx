import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};

/** An on/off setting that applies immediately. Use Checkbox for choices saved with a form. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ label, className, ...props }, ref) => (
  <label className={cn("sh-switch", className)}>
    <input ref={ref} type="checkbox" role="switch" {...props} />
    <span>{label}</span>
  </label>
));
Switch.displayName = "Switch";
