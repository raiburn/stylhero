import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** Shows a spinner and disables the button while keeping its width. */
  loading?: boolean;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, disabled, className, type = "button", children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn("sh-btn", `sh-btn--${variant}`, size !== "md" && `sh-btn--${size}`, fullWidth && "sh-btn--full", className)}
      {...props}
    >
      {loading && <span className="sh-spinner" aria-hidden="true" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";
