import { cn } from "../cn";

export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  /** Read by screen readers. */
  label?: string;
  className?: string;
};

export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("sh-spinner", size !== "md" && `sh-spinner--${size}`, className)}
    />
  );
}
