"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import {
  autoUpdate, flip, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useMergeRefs, useRole,
  FloatingPortal, type Placement,
} from "@floating-ui/react";
import { cn } from "../cn";
import { elementRef, withProps } from "../floating";

export type TooltipProps = {
  content: ReactNode;
  /** One focusable element, e.g. an IconButton. */
  children: ReactElement;
  placement?: Placement;
  /** ms before showing on hover. */
  delay?: number;
  className?: string;
};

/** Short hint on hover and keyboard focus. Not for anything the user must read: it is hidden on touch. */
export function Tooltip({ content, children, placement = "top", delay = 300, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false, delay: { open: delay, close: 0 } }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: "tooltip" }),
  ]);
  const ref = useMergeRefs([refs.setReference, elementRef(children)]);

  return (
    <>
      {withProps(children, getReferenceProps({ ref, ...(children.props as object) }))}
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={floatingStyles} className={cn("sh-tooltip", className)} {...getFloatingProps()}>
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
