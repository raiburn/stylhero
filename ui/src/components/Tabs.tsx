"use client";

import { useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../cn";

export type TabItem = { id: string; label: ReactNode; content: ReactNode; disabled?: boolean };

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  items: TabItem[];
  /** Controlled selected tab id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Accessible name for the tab list. */
  label?: string;
  /** "vertical" puts the tabs in a column on the left. */
  orientation?: "horizontal" | "vertical";
  /** "pills" uses a segmented look instead of an underline. */
  variant?: "line" | "pills";
};

export function Tabs({ items, value, defaultValue, onValueChange, label, orientation = "horizontal", variant = "line", className, ...props }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items.find((t) => !t.disabled)?.id);
  const selected = value ?? internal;
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const vertical = orientation === "vertical";

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = items.filter((t) => !t.disabled);
    const i = enabled.findIndex((t) => t.id === selected);
    const [prev, next] = vertical ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    const to =
      e.key === next ? (i + 1) % enabled.length :
      e.key === prev ? (i - 1 + enabled.length) % enabled.length :
      e.key === "Home" ? 0 :
      e.key === "End" ? enabled.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    select(enabled[to].id);
    tabRefs.current[enabled[to].id]?.focus();
  };

  return (
    <div className={cn("sh-tabs", vertical && "sh-tabs--vertical", variant === "pills" && "sh-tabs--pills", className)} {...props}>
      <div className="sh-tabs__list" role="tablist" aria-label={label} aria-orientation={orientation} onKeyDown={onKeyDown}>
        {items.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[t.id] = el; }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${t.id}`}
            aria-selected={t.id === selected}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={t.id === selected ? 0 : -1}
            disabled={t.disabled}
            className="sh-tabs__tab"
            onClick={() => select(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={t.id !== selected}
          tabIndex={0}
          className="sh-tabs__panel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
