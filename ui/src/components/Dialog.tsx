import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../cn";
import { XIcon } from "../icons";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  /** Buttons, right-aligned. Put the main action last. */
  footer?: ReactNode;
  className?: string;
};

/** Modal built on the native <dialog>: focus trapping, Esc to close and the backdrop come from the browser. */
export function Dialog({ open, onClose, title, children, footer, className }: DialogProps) {
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
      className={cn("sh-dialog", className)}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // a click on the backdrop lands on the <dialog> element itself
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sh-dialog__header">
        <h2 id={titleId} className="sh-dialog__title">{title}</h2>
        <button type="button" className="sh-dialog__close" aria-label="Close" onClick={onClose}>
          <XIcon />
        </button>
      </div>
      {children && <div className="sh-dialog__body">{children}</div>}
      {footer && <div className="sh-dialog__footer">{footer}</div>}
    </dialog>
  );
}
