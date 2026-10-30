import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { cn } from "../cn";

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  /** Smaller text under the label. */
  hint?: ReactNode;
};

function Choice({ type, label, hint, className, ...props }: ChoiceProps & { type: "checkbox" | "radio" }, ref: React.Ref<HTMLInputElement>) {
  return (
    <label className={cn("sh-check", className)}>
      <input ref={ref} type={type} {...props} />
      <span>
        {label}
        {hint && <span className="sh-check__hint">{hint}</span>}
      </span>
    </label>
  );
}

export type CheckboxProps = ChoiceProps & {
  /** Shows a dash: some, but not all, children are checked (e.g. "select all"). */
  indeterminate?: boolean;
};
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ indeterminate, ...props }, ref) => {
  const own = useRef<HTMLInputElement>(null);
  const merged = useMergeRefs([own, ref]);
  useEffect(() => {
    if (own.current) own.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return Choice({ ...props, type: "checkbox" }, merged);
});
Checkbox.displayName = "Checkbox";

export type RadioProps = ChoiceProps;
/** Give radios in a group the same `name`, or use RadioGroup. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => Choice({ ...props, type: "radio" }, ref));
Radio.displayName = "Radio";
