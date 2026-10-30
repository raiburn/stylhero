import { useId, useRef, useState, type ReactNode } from "react";
import {
  autoUpdate, flip, offset, size, useDismiss, useFloating, useInteractions, useListNavigation, useMergeRefs, useRole, FloatingPortal,
} from "@floating-ui/react";
import { cn } from "../cn";
import { CheckIcon, XIcon } from "../icons";
import { Field, useField, type FieldProps } from "./Field";

export type ComboboxOption = { value: string; label: string; hint?: string };

type ComboboxCommon = FieldProps & {
  options: Array<ComboboxOption | string>;
  placeholder?: string;
  /** Shown when nothing matches. */
  emptyText?: ReactNode;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};
type ComboboxSingle = ComboboxCommon & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};
type ComboboxMultiple = ComboboxCommon & {
  /** Pick several; they show as chips in the field (MUI's Autocomplete multiple / Select multiple). */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};
export type ComboboxProps = ComboboxSingle | ComboboxMultiple;

const normalize = (o: ComboboxOption | string): ComboboxOption => (typeof o === "string" ? { value: o, label: o } : o);
const toList = (v: string | string[] | null | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]);

/** Text input with a filtered list of options (MUI calls it Autocomplete). */
export function Combobox(props: ComboboxProps) {
  const { options: raw, placeholder, emptyText = "No matches", id, name, disabled, label, hint, error, className, multiple } = props;
  const options = raw.map(normalize);
  const { fieldId, message, controlProps } = useField(id, { hint, error });
  const listId = useId();
  const [internal, setInternal] = useState<string[]>(toList(props.defaultValue));
  const controlled = props.value !== undefined;
  const values = controlled ? toList(props.value) : internal;
  const selected = options.find((o) => o.value === values[0]);
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const q = query?.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (o) => {
      setOpen(o);
      if (!o) setQuery(null);
    },
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight, 288)}px`,
          });
        },
      }),
    ],
  });
  const wrapRefs = useMergeRefs([wrapRef, refs.setPositionReference]);
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: "listbox" }),
    useDismiss(context),
    useListNavigation(context, { listRef, activeIndex, onNavigate: setActiveIndex, virtual: true, loop: true }),
  ]);

  const commit = (next: string[]) => {
    if (!controlled) setInternal(next);
    if (props.multiple) props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? null);
  };

  const choose = (o: ComboboxOption) => {
    if (multiple) {
      commit(values.includes(o.value) ? values.filter((v) => v !== o.value) : [...values, o.value]);
      setQuery(null);
      return;
    }
    commit([o.value]);
    setQuery(null);
    setActiveIndex(null);
    setOpen(false);
  };

  const input = (
    <input
      {...controlProps}
      {...getReferenceProps({
        ref: refs.setReference,
        className: multiple ? "sh-combobox__input" : "sh-input",
        name: multiple ? undefined : name,
        disabled,
        placeholder: multiple && values.length ? undefined : placeholder,
        autoComplete: "off",
        "aria-autocomplete": "list",
        "aria-controls": open ? listId : undefined,
        value: query ?? (multiple ? "" : selected?.label ?? ""),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
          if (!multiple && e.target.value === "" && values.length) commit([]);
        },
        onClick: () => setOpen(true),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" && open && activeIndex !== null && filtered[activeIndex]) {
            e.preventDefault();
            choose(filtered[activeIndex]);
          }
          if (multiple && e.key === "Backspace" && !query && values.length) commit(values.slice(0, -1));
        },
        onBlur: () => setQuery(null),
      })}
    />
  );

  return (
    <Field fieldId={fieldId} label={label} message={message} error={error} className={className}>
      {multiple ? (
        <div
          ref={wrapRefs}
          className={cn("sh-input sh-combobox sh-combobox--multi", disabled && "sh-combobox--disabled")}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) { e.preventDefault(); wrapRef.current?.querySelector("input")?.focus(); setOpen(true); }
          }}
        >
          {values.map((v) => {
            const o = options.find((x) => x.value === v);
            return (
              <span key={v} className="sh-combobox__tag">
                {o?.label ?? v}
                <button type="button" aria-label={`Remove ${o?.label ?? v}`} tabIndex={-1} disabled={disabled} onClick={() => commit(values.filter((x) => x !== v))}>
                  <XIcon />
                </button>
                {name && <input type="hidden" name={name} value={v} />}
              </span>
            );
          })}
          {input}
        </div>
      ) : (
        <div className="sh-select-wrap sh-combobox">{input}</div>
      )}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            id={listId}
            style={floatingStyles}
            className="sh-listbox"
            aria-multiselectable={multiple || undefined}
            {...getFloatingProps()}
          >
            {filtered.length === 0 && <div className="sh-listbox__empty">{emptyText}</div>}
            {filtered.map((o, i) => (
              <div
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={values.includes(o.value)}
                className={cn("sh-listbox__option", activeIndex === i && "sh-listbox__option--active")}
                {...getItemProps({
                  ref: (el: HTMLElement | null) => { listRef.current[i] = el; },
                  onClick: () => choose(o),
                  // keep focus in the input
                  onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
                })}
              >
                <span className="sh-listbox__text">
                  {o.label}
                  {o.hint && <span className="sh-listbox__hint">{o.hint}</span>}
                </span>
                {values.includes(o.value) && <CheckIcon />}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </Field>
  );
}
