"use client";

import { useEffect, useRef, type DialogHTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";

export type BackdropProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "onClose"> & {
  open: boolean;
  /** Clicking the dimmed area (or Esc) calls this. Leave it out for a blocking "please wait". */
  onClose?: () => void;
  /** Usually a Spinner, or your own panel. */
  children?: ReactNode;
  /** Accessible name, e.g. "Saving". */
  label?: string;
};

/** Dims the whole screen, e.g. while saving. Built on native <dialog>, so it blocks clicks and traps focus. */
export function Backdrop({ open, onClose, children, label, className, onCancel, onClick, ...props }: BackdropProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={cn("sh-backdrop", className)}
      aria-label={label}
      aria-busy={!onClose || undefined}
      {...props}
      onCancel={(e) => { onCancel?.(e); e.preventDefault(); onClose?.(); }}
      onClick={(e) => { onClick?.(e); if (e.target === e.currentTarget) onClose?.(); }}
    >
      {children}
    </dialog>
  );
}

export type ModalProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "onClose"> & {
  open: boolean;
  onClose: () => void;
  /** Your own content: Modal adds no header, padding or close button (use Dialog for that). */
  children: ReactNode;
  label?: string;
};

/** Bare modal layer for custom panels (MUI's Modal). Esc and backdrop click call onClose. */
export function Modal({ open, onClose, children, label, className, onCancel, onClick, ...props }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={cn("sh-modal", className)}
      aria-label={label}
      {...props}
      onCancel={(e) => { onCancel?.(e); e.preventDefault(); onClose(); }}
      onClick={(e) => { onClick?.(e); if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </dialog>
  );
}
