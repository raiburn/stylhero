"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../cn";
import { toneIcons, XIcon } from "../icons";

type ToastTone = "info" | "success" | "danger";
export type ToastAction = { label: ReactNode; onClick: () => void };
export type ToastOptions = {
  message: ReactNode;
  tone?: ToastTone;
  /** ms; 0 keeps it open */
  duration?: number;
  /** One button, e.g. { label: "Undo", onClick: undo }. Clicking it also dismisses the toast. */
  action?: ToastAction;
};
type ToastItem = ToastOptions & { id: number };

type ShowToast = (t: ToastOptions | string) => void;
export type ToastPosition = "bottom-right" | "bottom-center" | "bottom-left" | "top-center";

const ToastContext = createContext<ShowToast | null>(null);

// The most recently mounted ToastProvider, for toast() calls outside React.
let activeToast: ShowToast | null = null;

/**
 * Shows a toast from anywhere, including code outside components (fetch helpers,
 * plain modules). Needs a mounted <ToastProvider>; without one it warns in
 * development and does nothing. Inside components, prefer useToast().
 */
export function toast(input: ToastOptions | string) {
  if (activeToast) activeToast(input);
  else if (process.env.NODE_ENV !== "production") console.warn("toast() was called with no <ToastProvider> mounted.");
}

function ToastView({ message, tone = "info", action, onDismiss }: ToastOptions & { onDismiss: () => void }) {
  const Icon = toneIcons[tone];
  return (
    <div className={cn("sh-toast", `sh-toast--${tone}`)}>
      <Icon />
      <div className="sh-toast__body">{message}</div>
      {action && (
        <button type="button" className="sh-toast__action" onClick={() => { action.onClick(); onDismiss(); }}>
          {action.label}
        </button>
      )}
      <button type="button" className="sh-toast__close" aria-label="Dismiss" onClick={onDismiss}>
        <XIcon />
      </button>
    </div>
  );
}

/**
 * Wrap your app once (e.g. in app/layout.tsx), then call `useToast()` anywhere below it,
 * or `toast()` from outside components.
 */
export function ToastProvider({ children, position = "bottom-right" }: { children: ReactNode; position?: ToastPosition }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (input: ToastOptions | string) => {
      const opts = typeof input === "string" ? { message: input } : input;
      const id = nextId.current++;
      setToasts((all) => [...all.slice(-3), { tone: "info", duration: 4000, ...opts, id }]);
      const duration = opts.duration ?? (opts.action ? 6000 : 4000);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  useEffect(() => {
    activeToast = toast;
    return () => {
      if (activeToast === toast) activeToast = null;
    };
  }, [toast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className={cn("sh-toaster", position !== "bottom-right" && `sh-toaster--${position}`)}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((t) => <ToastView key={t.id} {...t} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}

/** `const toast = useToast(); toast({ message: "Stamp added", tone: "success" })` */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>.");
  return ctx;
}

export type SnackbarProps = ToastOptions & {
  open: boolean;
  onClose: () => void;
  /** Where it sits on screen. */
  position?: ToastPosition;
};

/** A single controlled toast (MUI's Snackbar), for when you own the open state. Use useToast() for fire-and-forget messages. */
export function Snackbar({ open, onClose, duration = 4000, position = "bottom-center", ...toast }: SnackbarProps) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open || duration <= 0) return;
    const t = setTimeout(() => close.current(), duration);
    return () => clearTimeout(t);
  }, [open, duration]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className={cn("sh-toaster", `sh-toaster--${position}`)} role="status" aria-live="polite">
      <ToastView {...toast} onDismiss={onClose} />
    </div>,
    document.body
  );
}
