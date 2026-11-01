import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "primary" | "info" | "accent" | "success" | "danger";
};

/** Small label, e.g. "Reward ready". */
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span className={cn("sh-badge", `sh-badge--${tone}`, className)} {...props} />;
}

export type CountBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** The thing the count sits on, e.g. an IconButton or Avatar. */
  children: ReactNode;
  /** 0 hides the badge unless `showZero`. */
  count?: number;
  /** Shows "99+" above this. */
  max?: number;
  /** A plain dot instead of a number (e.g. "online", "unread"). */
  dot?: boolean;
  showZero?: boolean;
  tone?: "danger" | "primary" | "accent" | "success";
  /** Screen-reader text, e.g. "3 unread messages". Defaults to the number. */
  label?: string;
};

/** Number or dot on the corner of another element (MUI's Badge). */
export function CountBadge({ children, count = 0, max = 99, dot, showZero, tone = "danger", label, className, ...props }: CountBadgeProps) {
  const visible = dot || count > 0 || showZero;
  return (
    <span className={cn("sh-count-badge", className)} {...props}>
      {children}
      {visible && (
        <span className={cn("sh-count-badge__badge", `sh-count-badge__badge--${tone}`, dot && "sh-count-badge__badge--dot")} aria-label={label} role={label ? "status" : undefined}>
          {dot ? null : count > max ? `${max}+` : count}
        </span>
      )}
    </span>
  );
}
