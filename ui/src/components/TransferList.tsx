"use client";

import { useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { Checkbox } from "./Checkbox";

export type TransferItem = { value: string; label: ReactNode };

export type TransferListProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  /** Every item; the ones in `value` show on the right. */
  items: TransferItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  titles?: [ReactNode, ReactNode];
};

function Pane({ title, items, checked, toggle, setAll }: {
  title: ReactNode; items: TransferItem[]; checked: string[]; toggle: (v: string) => void; setAll: (on: boolean) => void;
}) {
  const n = items.filter((i) => checked.includes(i.value)).length;
  return (
    <div className="sh-transfer__pane">
      <div className="sh-transfer__head">
        <Checkbox
          label={<><strong>{title}</strong> <span className="sh-transfer__count">{n}/{items.length} selected</span></>}
          checked={items.length > 0 && n === items.length}
          indeterminate={n > 0 && n < items.length}
          disabled={!items.length}
          onChange={(e) => setAll(e.target.checked)}
        />
      </div>
      <ul className="sh-transfer__list">
        {items.map((i) => (
          <li key={i.value}><Checkbox label={i.label} checked={checked.includes(i.value)} onChange={() => toggle(i.value)} /></li>
        ))}
      </ul>
    </div>
  );
}

/** Move items between two lists, e.g. which products earn stamps. */
export function TransferList({ items, value, defaultValue = [], onValueChange, titles = ["Available", "Chosen"], className, ...props }: TransferListProps) {
  const [internal, setInternal] = useState(defaultValue);
  const chosen = value ?? internal;
  const [checked, setChecked] = useState<string[]>([]);
  const left = items.filter((i) => !chosen.includes(i.value));
  const right = items.filter((i) => chosen.includes(i.value));
  const toggle = (v: string) => setChecked((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]));
  const setAll = (list: TransferItem[]) => (on: boolean) =>
    setChecked((c) => (on ? [...new Set([...c, ...list.map((i) => i.value)])] : c.filter((v) => !list.some((i) => i.value === v))));
  const commit = (next: string[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const leftChecked = left.filter((i) => checked.includes(i.value)).map((i) => i.value);
  const rightChecked = right.filter((i) => checked.includes(i.value)).map((i) => i.value);

  return (
    <div className={cn("sh-transfer", className)} {...props}>
      <Pane title={titles[0]} items={left} checked={checked} toggle={toggle} setAll={setAll(left)} />
      <div className="sh-transfer__moves">
        <button type="button" className="sh-icon-btn sh-icon-btn--secondary sh-icon-btn--sm" aria-label="Move selected right" disabled={!leftChecked.length}
          onClick={() => { commit([...chosen, ...leftChecked]); setChecked((c) => c.filter((v) => !leftChecked.includes(v))); }}>
          <ChevronRightIcon />
        </button>
        <button type="button" className="sh-icon-btn sh-icon-btn--secondary sh-icon-btn--sm" aria-label="Move selected left" disabled={!rightChecked.length}
          onClick={() => { commit(chosen.filter((v) => !rightChecked.includes(v))); setChecked((c) => c.filter((v) => !rightChecked.includes(v))); }}>
          <ChevronLeftIcon />
        </button>
      </div>
      <Pane title={titles[1]} items={right} checked={checked} toggle={toggle} setAll={setAll(right)} />
    </div>
  );
}
