import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";

export type DividerProps = HTMLAttributes<HTMLElement> & {
  orientation?: "horizontal" | "vertical";
  /** Text in the middle of a horizontal divider, e.g. "or". */
  label?: ReactNode;
};

export function Divider({ orientation = "horizontal", label, className, ...props }: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("sh-divider", "sh-divider--label", className)} role="separator" {...props}>
        <span>{label}</span>
      </div>
    );
  }
  return <hr className={cn("sh-divider", orientation === "vertical" && "sh-divider--vertical", className)} aria-orientation={orientation} {...props} />;
}
