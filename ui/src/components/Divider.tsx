import type { ReactNode } from "react";
import { cn } from "../cn";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  /** Text in the middle of a horizontal divider, e.g. "or". */
  label?: ReactNode;
  className?: string;
};

export function Divider({ orientation = "horizontal", label, className }: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("sh-divider", "sh-divider--label", className)} role="separator">
        <span>{label}</span>
      </div>
    );
  }
  return <hr className={cn("sh-divider", orientation === "vertical" && "sh-divider--vertical", className)} aria-orientation={orientation} />;
}
