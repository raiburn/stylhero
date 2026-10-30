import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";
import { toneIcons, XIcon } from "../icons";

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  tone?: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
  /** Replace the default icon, or pass `null` for none. */
  icon?: ReactNode;
  /** A button on the right, e.g. <Button size="sm" variant="ghost">Undo</Button>. */
  action?: ReactNode;
  /** Shows a close button. */
  onClose?: () => void;
  /** "filled" is the loud, solid version. */
  variant?: "soft" | "outlined" | "filled";
};

export function Alert({ tone = "info", title, icon, action, onClose, variant = "soft", className, children, ...props }: AlertProps) {
  const Icon = toneIcons[tone];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn("sh-alert", `sh-alert--${tone}`, variant !== "soft" && `sh-alert--${variant}`, className)}
      {...props}
    >
      {icon === undefined ? <Icon /> : icon}
      <div className="sh-alert__body">
        {title && <strong className="sh-alert__title">{title}</strong>}
        {children}
      </div>
      {action && <div className="sh-alert__action">{action}</div>}
      {onClose && (
        <button type="button" className="sh-alert__close" aria-label="Close" onClick={onClose}>
          <XIcon />
        </button>
      )}
    </div>
  );
}
