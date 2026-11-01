import type { HTMLAttributes } from "react";
import { cn } from "../cn";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "sm" | "md" | "lg";
  /** Read by screen readers. */
  label?: string;
};

export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("sh-spinner", size !== "md" && `sh-spinner--${size}`, className)}
      {...props}
    />
  );
}
