"use client";

import { useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../cn";
import { ChevronRightIcon } from "../icons";

export type TreeItem = { id: string; label: ReactNode; icon?: ReactNode; children?: TreeItem[]; disabled?: boolean };

export type TreeViewProps = Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> & {
  items: TreeItem[];
  /** Controlled expanded ids. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string) => void;
  /** Accessible name. */
  label?: string;
};

type Flat = { item: TreeItem; depth: number; parent: string | null };

/** Nested, collapsible list: folders, categories, branches → stores (MUI X's Tree View). Full arrow-key support. */
export function TreeView({ items, expanded: expProp, defaultExpanded = [], onExpandedChange, selected: selProp, defaultSelected = null, onSelect, label, className, ...props }: TreeViewProps) {
  const [expInternal, setExpInternal] = useState(defaultExpanded);
  const expanded = expProp ?? expInternal;
  const [selInternal, setSelInternal] = useState(defaultSelected);
  const selected = selProp !== undefined ? selProp : selInternal;
  const [focused, setFocused] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  // the rows currently visible, in order
  const visible: Flat[] = [];
  const walk = (list: TreeItem[], depth: number, parent: string | null) => {
    for (const item of list) {
      visible.push({ item, depth, parent });
      if (item.children?.length && expanded.includes(item.id)) walk(item.children, depth + 1, item.id);
    }
  };
  walk(items, 0, null);
  const tabStop = focused ?? selected ?? visible[0]?.item.id;

  const setExpanded = (ids: string[]) => {
    if (expProp === undefined) setExpInternal(ids);
    onExpandedChange?.(ids);
  };
  const toggle = (id: string) => setExpanded(expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id]);
  const select = (item: TreeItem) => {
    if (item.disabled) return;
    if (selProp === undefined) setSelInternal(item.id);
    onSelect?.(item.id);
  };
  const focus = (id: string) => { setFocused(id); refs.current[id]?.focus(); };

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const { item, parent } = visible[i];
    const hasKids = !!item.children?.length;
    const open = expanded.includes(item.id);
    const key = e.key;
    if (key === "ArrowDown" && visible[i + 1]) focus(visible[i + 1].item.id);
    else if (key === "ArrowUp" && visible[i - 1]) focus(visible[i - 1].item.id);
    else if (key === "ArrowRight") { if (hasKids && !open) toggle(item.id); else if (hasKids) focus(item.children![0].id); }
    else if (key === "ArrowLeft") { if (hasKids && open) toggle(item.id); else if (parent) focus(parent); }
    else if (key === "Home") focus(visible[0].item.id);
    else if (key === "End") focus(visible[visible.length - 1].item.id);
    else if (key === "Enter" || key === " ") { select(item); if (hasKids && key === "Enter") toggle(item.id); }
    else if (key === "*") {
      const siblings = (parent ? visible.find((v) => v.item.id === parent)!.item.children! : items).filter((s) => s.children?.length).map((s) => s.id);
      setExpanded([...new Set([...expanded, ...siblings])]);
    } else return;
    e.preventDefault();
  };

  const render = (list: TreeItem[], depth: number): ReactNode =>
    list.map((item) => {
      const i = visible.findIndex((v) => v.item.id === item.id);
      const hasKids = !!item.children?.length;
      const open = expanded.includes(item.id);
      return (
        <li
          key={item.id}
          ref={(el) => { refs.current[item.id] = el; }}
          role="treeitem"
          aria-expanded={hasKids ? open : undefined}
          aria-selected={selected === item.id}
          aria-disabled={item.disabled || undefined}
          tabIndex={tabStop === item.id ? 0 : -1}
          className="sh-tree__item"
          onKeyDown={(e) => { if (e.target === e.currentTarget) onKeyDown(e, i); }}
          onFocus={(e) => { if (e.target === e.currentTarget) setFocused(item.id); }}
        >
          <div
            className={cn("sh-tree__row", selected === item.id && "sh-tree__row--selected")}
            style={{ paddingLeft: 8 + depth * 20 }}
            onClick={() => { select(item); if (hasKids) toggle(item.id); setFocused(item.id); }}
          >
            <span className={cn("sh-tree__chevron", open && "sh-tree__chevron--open")}>{hasKids && <ChevronRightIcon />}</span>
            {item.icon && <span className="sh-tree__icon">{item.icon}</span>}
            <span className="sh-tree__label">{item.label}</span>
          </div>
          {hasKids && open && <ul role="group" className="sh-tree__group">{render(item.children!, depth + 1)}</ul>}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label={label} className={cn("sh-tree", className)} {...props}>
      {render(items, 0)}
    </ul>
  );
}
