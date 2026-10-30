import { useState, type ReactElement, type ReactNode } from "react";
import {
  autoUpdate, flip, offset, shift, useClick, useDismiss, useFloating, useInteractions, useMergeRefs, useRole,
  FloatingFocusManager, FloatingPortal, type Placement,
} from "@floating-ui/react";
import { cn } from "../cn";
import { elementRef, withProps } from "../floating";

export type PopoverProps = {
  /** The element that opens it on click, e.g. <Button>. */
  trigger: ReactElement;
  title?: ReactNode;
  children: ReactNode;
  placement?: Placement;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/** Small floating panel anchored to a trigger: quick forms, details, filters. Esc or an outside click closes it. */
export function Popover({ trigger, title, children, placement = "bottom-start", open: openProp, onOpenChange, className }: PopoverProps) {
  const [internal, setInternal] = useState(false);
  const open = openProp ?? internal;
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInternal(v);
    onOpenChange?.(v);
  };
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context), useRole(context)]);
  const ref = useMergeRefs([refs.setReference, elementRef(trigger)]);

  return (
    <>
      {withProps(trigger, getReferenceProps({ ref, ...(trigger.props as object) }))}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={floatingStyles} className={cn("sh-popover", className)} {...getFloatingProps()}>
              {title && <h3 className="sh-popover__title">{title}</h3>}
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
