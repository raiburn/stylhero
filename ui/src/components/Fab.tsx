"use client";

import { forwardRef, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useDismiss, useFloating, useInteractions, useMergeRefs } from "@floating-ui/react";
import { cn } from "../cn";
import { PlusIcon, XIcon } from "../icons";

export type FabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required for the round icon-only version; becomes the aria-label. */
  label: string;
  /** Shows the label next to the icon (MUI's variant="extended"). */
  extended?: boolean;
  tone?: "primary" | "accent" | "surface";
  size?: "sm" | "md";
  /** Pins it to the bottom-right corner of the screen. */
  fixed?: boolean;
};

/** Floating action button: the one main action on a screen, e.g. "Add customer". */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  ({ label, extended, tone = "primary", size = "md", fixed, className, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={extended ? undefined : label}
      className={cn("sh-fab", `sh-fab--${tone}`, size === "sm" && "sh-fab--sm", extended && "sh-fab--extended", fixed && "sh-fab--fixed", className)}
      {...props}
    >
      {children}
      {extended && <span>{label}</span>}
    </button>
  )
);
Fab.displayName = "Fab";

export type SpeedDialAction = { label: string; icon: ReactNode; onClick: () => void };

export type SpeedDialProps = {
  /** Accessible name of the main button, e.g. "Quick actions". */
  label: string;
  actions: SpeedDialAction[];
  /** Main button icon; defaults to a plus that turns into an X. */
  icon?: ReactNode;
  /** Which way the actions fan out. */
  direction?: "up" | "left";
  fixed?: boolean;
  className?: string;
};

/** A Fab that opens a few related actions, each with a visible label. */
export function SpeedDial({ label, actions, icon, direction = "up", fixed, className }: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const mainRef = useRef<HTMLButtonElement | null>(null);
  const { refs, context } = useFloating({ open, onOpenChange: setOpen });
  const { getReferenceProps, getFloatingProps } = useInteractions([useDismiss(context)]);
  const mainRefs = useMergeRefs([mainRef, refs.setReference]);
  const close = () => { setOpen(false); mainRef.current?.focus(); };

  return (
    <div
      ref={refs.setFloating}
      className={cn("sh-speed-dial", `sh-speed-dial--${direction}`, open && "sh-speed-dial--open", fixed && "sh-fab--fixed", className)}
      {...getFloatingProps({
        onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Escape") close(); },
      })}
    >
      <ul id={listId} className="sh-speed-dial__actions" hidden={!open}>
        {actions.map((a, i) => (
          <li key={a.label} style={{ transitionDelay: `${(actions.length - i) * 25}ms` }}>
            <span className="sh-speed-dial__label" aria-hidden="true">{a.label}</span>
            <button type="button" className="sh-fab sh-fab--surface sh-fab--sm" aria-label={a.label} onClick={() => { a.onClick(); close(); }}>
              {a.icon}
            </button>
          </li>
        ))}
      </ul>
      <button
        ref={mainRefs}
        type="button"
        className="sh-fab sh-fab--primary sh-speed-dial__main"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        {...getReferenceProps({ onClick: () => setOpen(!open) })}
      >
        {icon ?? (open ? <XIcon /> : <PlusIcon />)}
      </button>
    </div>
  );
}
