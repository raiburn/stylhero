import type { ReactNode } from "react";
import { cn } from "../cn";

export type EmptyStateProps = {
  /** A Lucide icon, e.g. <Users /> */
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  /** Usually one primary Button that creates the first item. */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, children, action, className }: EmptyStateProps) {
  return (
    <div className={cn("sh-empty", className)}>
      {icon && <div className="sh-empty__icon">{icon}</div>}
      <h3 className="sh-empty__title">{title}</h3>
      {children && <p className="sh-empty__body">{children}</p>}
      {action}
    </div>
  );
}
