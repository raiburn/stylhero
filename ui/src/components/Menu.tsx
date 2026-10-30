import { useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  autoUpdate, flip, offset, shift, useClick, useDismiss, useFloating, useInteractions, useListNavigation, useMergeRefs,
  useRole, useTypeahead, FloatingFocusManager, FloatingPortal, type Placement,
} from "@floating-ui/react";
import { cn } from "../cn";
import { elementRef, withProps } from "../floating";
import { useLinkComponent } from "../link";

export type MenuAction = {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  /** Renders a link instead of a button. */
  href?: string;
  /** Red, for destructive actions. Put them last. */
  danger?: boolean;
  disabled?: boolean;
  /** Keyboard hint on the right, e.g. "Ctrl+D". */
  shortcut?: string;
};
export type MenuItem = MenuAction | "separator";

export type MenuProps = {
  /** The element that opens the menu, e.g. <IconButton label="More"><MoreHorizontal /></IconButton>. */
  trigger: ReactElement;
  items: MenuItem[];
  placement?: Placement;
  className?: string;
};

/** Dropdown list of actions. Arrow keys, Home/End, typing a letter and Esc all work. */
export function Menu({ trigger, items, placement = "bottom-start", className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const actions = items.filter((i): i is MenuAction => i !== "separator");
  const labelsRef = useRef<Array<string | null>>([]);
  labelsRef.current = actions.map((a) => a.label);
  const LinkComp = useLinkComponent();

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: "menu" }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      loop: true,
      disabledIndices: actions.flatMap((a, i) => (a.disabled ? [i] : [])),
    }),
    useTypeahead(context, { listRef: labelsRef, activeIndex, onMatch: open ? setActiveIndex : undefined }),
  ]);
  const ref = useMergeRefs([refs.setReference, elementRef(trigger)]);

  let index = -1;
  return (
    <>
      {withProps(trigger, getReferenceProps({ ref, ...(trigger.props as object) }))}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={0}>
            <div ref={refs.setFloating} style={floatingStyles} className={cn("sh-menu", className)} {...getFloatingProps()}>
              {items.map((item, k) => {
                if (item === "separator") return <div key={`sep-${k}`} role="separator" className="sh-menu__separator" />;
                const i = ++index;
                const props = getItemProps({
                  ref: (el: HTMLElement | null) => { listRef.current[i] = el; },
                  role: "menuitem",
                  tabIndex: activeIndex === i ? 0 : -1,
                  className: cn("sh-menu__item", item.danger && "sh-menu__item--danger"),
                  onClick: () => {
                    item.onSelect?.();
                    setOpen(false);
                  },
                });
                const inner = (
                  <>
                    {item.icon}
                    <span className="sh-menu__label">{item.label}</span>
                    {item.shortcut && <kbd className="sh-menu__shortcut">{item.shortcut}</kbd>}
                  </>
                );
                return item.href && !item.disabled ? (
                  <LinkComp key={k} href={item.href} {...props}>{inner}</LinkComp>
                ) : (
                  <button key={k} type="button" disabled={item.disabled} {...props}>{inner}</button>
                );
              })}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
