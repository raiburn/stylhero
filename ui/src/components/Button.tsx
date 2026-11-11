"use client";

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cn } from "../cn";
import { useLinkComponent } from "../link";

type ButtonLook = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> &
      ButtonLook & {
        /** Shows a spinner and disables the button while keeping its width. */
        loading?: boolean;
        href?: undefined;
      })
  | (AnchorHTMLAttributes<HTMLAnchorElement> &
      ButtonLook & {
        /**
         * Renders a link styled as a button, through your router's link (see LinkProvider).
         * `http(s)://` links open in a new tab. Links can't be disabled or loading:
         * render a Button without `href` for that.
         */
        href: string;
        loading?: undefined;
        disabled?: undefined;
      });

/** Button, or a link that looks like one when you pass `href`. */
export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, ...props }, ref) => {
    const LinkComponent = useLinkComponent();
    const cls = cn("sh-btn", `sh-btn--${variant}`, size !== "md" && `sh-btn--${size}`, fullWidth && "sh-btn--full", className);

    if (props.href !== undefined) {
      const { href, loading: _loading, disabled: _disabled, ...rest } = props as AnchorHTMLAttributes<HTMLAnchorElement> & {
        loading?: undefined;
        disabled?: undefined;
      };
      if (/^https?:/.test(href ?? "")) {
        return (
          <a ref={ref} href={href} className={cls} target="_blank" rel="noreferrer noopener" {...rest}>
            {children}
          </a>
        );
      }
      return (
        <LinkComponent ref={ref} href={href} className={cls} {...rest}>
          {children}
        </LinkComponent>
      );
    }

    const { loading, disabled, type = "button", ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };
    return (
      <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cls} {...rest}>
        {loading && <span className="sh-spinner" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
