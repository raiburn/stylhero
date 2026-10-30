import { useState, type ReactNode } from "react";
import { cn } from "../cn";

export type ToggleOption = { value: string; label: ReactNode; disabled?: boolean };

type Common = { options: ToggleOption[]; label?: string; size?: "sm" | "md"; className?: string };
export type ToggleGroupProps =
  | (Common & { multiple?: false; value?: string; defaultValue?: string; onValueChange?: (value: string) => void })
  | (Common & { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void });

/** Segmented control. Single choice by default (a view switcher); `multiple` for independent toggles. */
export function ToggleGroup(props: ToggleGroupProps) {
  const { options, label, size = "md", className } = props;
  const [internal, setInternal] = useState<string | string[] | undefined>(
    props.defaultValue ?? (props.multiple ? [] : options[0]?.value)
  );
  const current = props.value ?? internal;
  const isOn = (v: string) => (Array.isArray(current) ? current.includes(v) : current === v);

  const toggle = (v: string) => {
    if (props.multiple) {
      const list = (current as string[] | undefined) ?? [];
      const next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
      if (props.value === undefined) setInternal(next);
      props.onValueChange?.(next);
    } else {
      if (props.value === undefined) setInternal(v);
      props.onValueChange?.(v);
    }
  };

  return (
    <div role="group" aria-label={label} className={cn("sh-toggle-group", size === "sm" && "sh-toggle-group--sm", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="sh-toggle-group__item"
          aria-pressed={isOn(o.value)}
          disabled={o.disabled}
          onClick={() => toggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
