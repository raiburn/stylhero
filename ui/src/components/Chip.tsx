import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";
import { CheckIcon, XIcon } from "../icons";

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, "onClick"> & {
  children: ReactNode;
  /** With onClick: a filter chip that shows a check when selected. */
  selected?: boolean;
  onClick?: () => void;
  /** Shows a remove (x) button. */
  onRemove?: () => void;
  icon?: ReactNode;
};

/** Compact pill for filters, tags and selected values. */
export function Chip({ children, selected, onClick, onRemove, icon, className, ...props }: ChipProps) {
  const content = (
    <>
      {selected ? <CheckIcon /> : icon}
      <span>{children}</span>
    </>
  );
  return (
    <span className={cn("sh-chip", selected && "sh-chip--selected", className)} {...props}>
      {onClick ? (
        <button type="button" className="sh-chip__main" aria-pressed={selected} onClick={onClick}>{content}</button>
      ) : (
        <span className="sh-chip__main">{content}</span>
      )}
      {onRemove && (
        <button type="button" className="sh-chip__remove" aria-label={`Remove ${typeof children === "string" ? children : ""}`.trim()} onClick={onRemove}>
          <XIcon />
        </button>
      )}
    </span>
  );
}
