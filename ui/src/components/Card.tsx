import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  /** Smaller line under the title. */
  subtitle?: ReactNode;
  /** Top-right of the header, e.g. an IconButton or Menu. */
  action?: ReactNode;
  /** Full-bleed image or video on top (MUI's CardMedia). */
  media?: ReactNode;
  /** Buttons along the bottom (MUI's CardActions). */
  footer?: ReactNode;
  /**
   * "outlined": border instead of shadow (MUI's variant="outlined").
   * "ghost": no surface until hovered, for lists of entries on a page (portfolios, blogs).
   */
  variant?: "elevated" | "outlined" | "ghost";
};

export function Card({ title, subtitle, action, media, footer, variant = "elevated", className, children, ...props }: CardProps) {
  const header = title || subtitle || action;
  return (
    <div className={cn("sh-card", variant !== "elevated" && `sh-card--${variant}`, className)} {...props}>
      {media && <div className="sh-card__media">{media}</div>}
      {header && (
        <div className="sh-card__header">
          <div className="sh-card__heading">
            {title && <h3 className="sh-card__title">{title}</h3>}
            {subtitle && <p className="sh-card__subtitle">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
      {footer && <div className="sh-card__footer">{footer}</div>}
    </div>
  );
}
