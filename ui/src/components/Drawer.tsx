"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../cn";
import { XIcon } from "../icons";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Which edge it slides from. Bottom becomes a sheet on phones. */
  side?: "right" | "left" | "bottom";
  className?: string;
};

/** Side panel built on the native <dialog>, like Dialog: for filters, details and mobile navigation. */
export function Drawer({ open, onClose, title, children, footer, side = "right", className }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn("sh-drawer", `sh-drawer--${side}`, className)}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sh-drawer__panel">
        <div className="sh-dialog__header">
          <h2 id={titleId} className="sh-dialog__title">{title}</h2>
          <button type="button" className="sh-dialog__close" aria-label="Close" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="sh-drawer__body">{children}</div>
        {footer && <div className="sh-dialog__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
