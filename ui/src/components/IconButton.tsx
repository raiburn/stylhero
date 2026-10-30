import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cn } from "../cn";

type Common = {
  /** Required: what the button does, read by screen readers ("Delete customer"). */
  label: string;
  variant?: "ghost" | "secondary" | "primary";
  /** "lg" is 44px, the minimum comfortable tap target on phones. */
  size?: "sm" | "md" | "lg";
};

export type IconButtonProps =
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & Common & { href?: undefined })
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "aria-label"> & Common & { href: string });

/** Square button holding one Lucide icon. Pass `href` to render a link (e.g. social profiles). */
export const IconButton = forwardRef<HTMLButtonElement & HTMLAnchorElement, IconButtonProps>(
  ({ label, variant = "ghost", size = "md", className, ...props }, ref) => {
    const cls = cn("sh-icon-btn", `sh-icon-btn--${variant}`, size !== "md" && `sh-icon-btn--${size}`, className);
    if (props.href !== undefined) {
      const { href, ...rest } = props as AnchorHTMLAttributes<HTMLAnchorElement>;
      const external = /^https?:/.test(href ?? "");
      return (
        <a
          ref={ref}
          href={href}
          aria-label={label}
          title={label}
          className={cls}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          {...rest}
        />
      );
    }
    const { type = "button", ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return <button ref={ref} type={type} aria-label={label} className={cls} {...rest} />;
  }
);
IconButton.displayName = "IconButton";
