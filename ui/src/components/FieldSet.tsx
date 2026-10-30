"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "../cn";
import { Checkbox, Radio } from "./Checkbox";

export type FieldSetProps = {
  /** The group's question, e.g. "Notify me by". */
  legend: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Lay the options out side by side. */
  row?: boolean;
  children: ReactNode;
  className?: string;
};

/** Groups related controls under one label (MUI's FormControl + FormLabel + FormGroup). */
export function FieldSet({ legend, hint, error, row, children, className }: FieldSetProps) {
  const id = useId();
  const message = error ?? hint;
  return (
    <fieldset className={cn("sh-fieldset", error ? "sh-field--error" : undefined, className)} aria-describedby={message ? id : undefined}>
      <legend className="sh-field__label">{legend}</legend>
      <div className={cn("sh-fieldset__options", row && "sh-fieldset__options--row")}>{children}</div>
      {message && <span id={id} className="sh-field__hint">{message}</span>}
    </fieldset>
  );
}

export type ChoiceOption = { value: string; label: ReactNode; hint?: ReactNode; disabled?: boolean };
const norm = (o: ChoiceOption | string): ChoiceOption => (typeof o === "string" ? { value: o, label: o } : o);

export type RadioGroupProps = Omit<FieldSetProps, "children"> & {
  options: Array<ChoiceOption | string>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

/** A set of radios: pick exactly one. Arrow keys move between them (native). */
export function RadioGroup({ options, value, defaultValue, onValueChange, name, ...set }: RadioGroupProps) {
  const auto = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return (
    <FieldSet {...set}>
      {options.map(norm).map((o) => (
        <Radio
          key={o.value}
          name={name ?? auto}
          value={o.value}
          label={o.label}
          hint={o.hint}
          disabled={o.disabled}
          checked={current === o.value}
          onChange={() => { if (value === undefined) setInternal(o.value); onValueChange?.(o.value); }}
        />
      ))}
    </FieldSet>
  );
}

export type CheckboxGroupProps = Omit<FieldSetProps, "children"> & {
  options: Array<ChoiceOption | string>;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Adds a "Select all" checkbox on top (with the mixed state). */
  selectAll?: ReactNode;
};

/** A set of checkboxes: pick any number. */
export function CheckboxGroup({ options, value, defaultValue = [], onValueChange, selectAll, ...set }: CheckboxGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const opts = options.map(norm);
  const set_ = (next: string[]) => { if (value === undefined) setInternal(next); onValueChange?.(next); };
  const enabled = opts.filter((o) => !o.disabled).map((o) => o.value);
  const all = enabled.length > 0 && enabled.every((v) => current.includes(v));
  return (
    <FieldSet {...set}>
      {selectAll && (
        <Checkbox
          label={selectAll}
          checked={all}
          indeterminate={!all && current.length > 0}
          onChange={() => set_(all ? current.filter((v) => !enabled.includes(v)) : [...new Set([...current, ...enabled])])}
        />
      )}
      {opts.map((o) => (
        <Checkbox
          key={o.value}
          label={o.label}
          hint={o.hint}
          disabled={o.disabled}
          checked={current.includes(o.value)}
          onChange={(e) => set_(e.target.checked ? [...current, o.value] : current.filter((v) => v !== o.value))}
          className={selectAll ? "sh-check--nested" : undefined}
        />
      ))}
    </FieldSet>
  );
}
