import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";

export type ChoiceCardProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** "radio" (default) picks one of a group with the same `name`; "checkbox" toggles. */
  type?: "radio" | "checkbox";
  label: ReactNode;
  /** Smaller text under the label, e.g. a price or what the option means. */
  description?: ReactNode;
  /** Shown before the text, e.g. a Lucide icon. Decorative: hidden from screen readers. */
  icon?: ReactNode;
};

/**
 * A large, card-shaped radio or checkbox, for choices that deserve more room than a
 * plain Radio ("1440p", "Quiet build"). It is a real <input> inside a <label>, so
 * arrow keys, Space, forms and screen readers work like any radio or checkbox. Group
 * radios with the same `name`, inside a FieldSet with a legend.
 */
export const ChoiceCard = forwardRef<HTMLInputElement, ChoiceCardProps>(
  ({ type = "radio", label, description, icon, className, ...props }, ref) => (
    <label className={cn("sh-choice-card", className)}>
      <input ref={ref} type={type} className="sh-choice-card__input" {...props} />
      {icon && (
        <span className="sh-choice-card__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="sh-choice-card__text">
        <span className="sh-choice-card__label">{label}</span>
        {description && <span className="sh-choice-card__description">{description}</span>}
      </span>
    </label>
  )
);
ChoiceCard.displayName = "ChoiceCard";
