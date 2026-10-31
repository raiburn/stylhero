"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  autoUpdate, flip, offset, shift, useClick, useDismiss, useFloating, useInteractions, useRole, FloatingFocusManager, FloatingPortal,
} from "@floating-ui/react";
import { cn } from "../cn";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "../icons";
import { Combobox } from "./Combobox";
import { Field, useField, type FieldProps } from "./Field";

// ---------- date helpers (local time, no library) ----------
const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const before = (a: Date, b: Date) => day(a).getTime() < day(b).getTime();
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export type DateRange = [Date | null, Date | null];

type CalendarBase = {
  min?: Date;
  max?: Date;
  /** Return true to block a day (e.g. closed on Sundays). */
  isDateDisabled?: (d: Date) => boolean;
  /** BCP 47 locale for month and weekday names, e.g. "es-MX". Defaults to the browser's. */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1;
  className?: string;
};
export type CalendarProps = CalendarBase & {
  /** Focus the selected (or today's) day on mount, e.g. inside a popover. */
  autoFocus?: boolean;
} & (
  | { mode?: "single"; value?: Date | null; onValueChange?: (d: Date) => void }
  | { mode: "range"; value?: DateRange; onValueChange?: (r: DateRange) => void }
);

/** Month grid (MUI X's DateCalendar). Arrows move by day/week, PageUp/PageDown by month, Enter picks. */
export function Calendar(props: CalendarProps) {
  const { min, max, isDateDisabled, locale, weekStartsOn = 0, autoFocus, className } = props;
  const range = props.mode === "range";
  const single = !range ? (props.value as Date | null | undefined) ?? null : null;
  const [start, end] = range ? (props.value as DateRange | undefined) ?? [null, null] : [null, null];
  const today = day(new Date());
  const disabled = (d: Date) => (min && before(d, min)) || (max && before(max, d)) || !!isDateDisabled?.(d);
  // disabled buttons can't take focus, so keyboard moves walk past them (as MUI X does)
  const enabledFrom = (d: Date, dir: 1 | -1) => {
    for (let i = 0; i < 366 && disabled(d); i++) d = addDays(d, dir);
    return disabled(d) ? null : d;
  };
  const [focus, setFocus] = useState<Date>(() => {
    const d = day(single ?? start ?? today);
    return enabledFrom(d, 1) ?? enabledFrom(d, -1) ?? d;
  });
  const [hover, setHover] = useState<Date | null>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const shouldFocus = useRef(!!autoFocus);
  const titleId = useId();

  useEffect(() => {
    if (!shouldFocus.current) return;
    // runs on mount (autoFocus) and after keyboard moves. Not [tabindex="0"]: when a month change unmounts
    // the focused day, floating-ui's focus manager sets every tabindex inside the popover to -1.
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>("[data-focus]")?.focus();
  }, [focus]);

  const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -lead);
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, i) => addDays(gridStart, w * 7 + i)));
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const fmtFull = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(first);

  const pick = (d: Date) => {
    if (disabled(d)) return;
    if (!range) return (props.onValueChange as ((d: Date) => void) | undefined)?.(d);
    const on = props.onValueChange as ((r: DateRange) => void) | undefined;
    if (!start || end) on?.([d, null]);
    else on?.(before(d, start) ? [d, start] : [start, d]);
  };

  const move = (d: Date) => { shouldFocus.current = true; setFocus(d); };
  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key;
    const dow = (focus.getDay() - weekStartsOn + 7) % 7;
    const to =
      k === "ArrowLeft" ? addDays(focus, -1) : k === "ArrowRight" ? addDays(focus, 1) :
      k === "ArrowUp" ? addDays(focus, -7) : k === "ArrowDown" ? addDays(focus, 7) :
      k === "Home" ? addDays(focus, -dow) : k === "End" ? addDays(focus, 6 - dow) :
      k === "PageUp" ? addMonths(focus, e.shiftKey ? -12 : -1) : k === "PageDown" ? addMonths(focus, e.shiftKey ? 12 : 1) : null;
    if (to) {
      e.preventDefault();
      const next = enabledFrom(to, before(to, focus) ? -1 : 1);
      if (next) move(next);
      return;
    }
    if (k === "Enter" || k === " ") { e.preventDefault(); pick(focus); }
  };

  const rangeEnd = end ?? (start && hover && !before(hover, start) ? hover : null);

  return (
    <div className={cn("sh-calendar", className)}>
      <div className="sh-calendar__head">
        <button type="button" className="sh-icon-btn sh-icon-btn--sm" aria-label="Previous month" onClick={() => setFocus(addMonths(focus, -1))}><ChevronLeftIcon /></button>
        <span id={titleId} className="sh-calendar__title" aria-live="polite">{title}</span>
        <button type="button" className="sh-icon-btn sh-icon-btn--sm" aria-label="Next month" onClick={() => setFocus(addMonths(focus, 1))}><ChevronRightIcon /></button>
      </div>
      <table ref={gridRef} role="grid" aria-labelledby={titleId} className="sh-calendar__grid" onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
        <thead>
          <tr>
            {weeks[0].map((d) => (
              <th key={d.getDay()} scope="col" abbr={new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d)}>
                {fmtDay.format(d).slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {week.map((d) => {
                const outside = d.getMonth() !== focus.getMonth();
                const isSel = range ? same(d, start) || same(d, end) : same(d, single);
                const inRange = range && start && rangeEnd && !before(d, start) && !before(rangeEnd, d);
                return (
                  <td
                    key={iso(d)}
                    role="gridcell"
                    aria-selected={isSel || undefined}
                    className={cn(
                      inRange && "sh-calendar__cell--range",
                      range && same(d, start) && "sh-calendar__cell--start",
                      range && same(d, rangeEnd) && "sh-calendar__cell--end",
                    )}
                  >
                    <button
                      type="button"
                      tabIndex={same(d, focus) ? 0 : -1}
                      data-focus={same(d, focus) || undefined}
                      aria-label={fmtFull.format(d)}
                      aria-current={same(d, today) ? "date" : undefined}
                      aria-pressed={isSel}
                      disabled={disabled(d)}
                      className={cn("sh-calendar__day", outside && "sh-calendar__day--outside", isSel && "sh-calendar__day--selected", same(d, today) && "sh-calendar__day--today")}
                      onClick={() => { setFocus(d); pick(d); }}
                      onMouseEnter={() => range && setHover(d)}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- pickers ----------
type PickerBase = FieldProps & Omit<CalendarBase, "className"> & {
  placeholder?: string;
  /** Intl date format for the field. */
  format?: Intl.DateTimeFormatOptions;
  /** Shows an X to clear the value. */
  clearable?: boolean;
  disabled?: boolean;
  id?: string;
  /** Submits the value as YYYY-MM-DD (range: two fields, name[0] and name[1]). */
  name?: string;
  className?: string;
};

function PickerShell({ text, placeholder, onClear, panel, open, setOpen, disabled, fieldId, controlProps, label, message, error, className, hidden }: {
  text: string | null; placeholder: string; onClear?: () => void; panel: ReactNode; open: boolean; setOpen: (o: boolean) => void;
  disabled?: boolean; fieldId: string; controlProps: Record<string, unknown>; label?: ReactNode; message?: ReactNode; error?: ReactNode;
  className?: string; hidden: ReactNode;
}) {
  const { refs, floatingStyles, context } = useFloating({
    open, onOpenChange: setOpen, placement: "bottom-start", whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context), useRole(context, { role: "dialog" })]);
  return (
    <Field fieldId={fieldId} label={label} message={message} error={error} className={className}>
      <div className="sh-date-field">
        <button
          type="button"
          {...controlProps}
          {...getReferenceProps({ ref: refs.setReference })}
          disabled={disabled}
          className={cn("sh-input sh-date-field__button", !text && "sh-date-field__button--empty")}
        >
          <CalendarIcon />
          <span>{text ?? placeholder}</span>
        </button>
        {onClear && text && !disabled && (
          <button type="button" className="sh-date-field__clear" aria-label="Clear date" onClick={onClear}><XIcon /></button>
        )}
        {hidden}
      </div>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div ref={refs.setFloating} style={floatingStyles} className="sh-popover sh-date-popover" {...getFloatingProps()}>
              {panel}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </Field>
  );
}

export type DatePickerProps = PickerBase & {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (d: Date | null) => void;
};

/** Field that opens a Calendar (MUI X's DatePicker). */
export function DatePicker({ value, defaultValue = null, onValueChange, placeholder = "Pick a date", format = { dateStyle: "medium" }, clearable,
  disabled, id, name, label, hint, error, className, ...cal }: DatePickerProps) {
  const { fieldId, message, controlProps } = useField(id, { hint, error });
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const [open, setOpen] = useState(false);
  const set = (d: Date | null) => { if (value === undefined) setInternal(d); onValueChange?.(d); };
  return (
    <PickerShell
      text={current ? new Intl.DateTimeFormat(cal.locale, format).format(current) : null}
      placeholder={placeholder}
      onClear={clearable ? () => set(null) : undefined}
      open={open}
      setOpen={setOpen}
      disabled={disabled}
      fieldId={fieldId}
      controlProps={controlProps}
      label={label}
      message={message}
      error={error}
      className={className}
      hidden={name && <input type="hidden" name={name} value={current ? iso(current) : ""} />}
      panel={<Calendar {...cal} autoFocus value={current} onValueChange={(d) => { set(d); setOpen(false); }} />}
    />
  );
}

export type DateRangePickerProps = PickerBase & {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (r: DateRange) => void;
  /** Quick picks shown beside the calendar, e.g. [{ label: "Last 7 days", range: [...] }]. */
  presets?: Array<{ label: string; range: [Date, Date] }>;
};

/** Pick a start and end date (MUI X Pro's DateRangePicker). */
export function DateRangePicker({ value, defaultValue = [null, null], onValueChange, placeholder = "Pick dates", format = { dateStyle: "medium" }, clearable,
  presets, disabled, id, name, label, hint, error, className, ...cal }: DateRangePickerProps) {
  const { fieldId, message, controlProps } = useField(id, { hint, error });
  const [internal, setInternal] = useState<DateRange>(defaultValue);
  const current = value ?? internal;
  const [open, setOpen] = useState(false);
  const set = (r: DateRange) => { if (value === undefined) setInternal(r); onValueChange?.(r); };
  const f = new Intl.DateTimeFormat(cal.locale, format);
  const [s, e] = current;
  return (
    <PickerShell
      text={s ? (e ? (f as Intl.DateTimeFormat & { formatRange(a: Date, b: Date): string }).formatRange(s, e) : `${f.format(s)} – …`) : null}
      placeholder={placeholder}
      onClear={clearable ? () => set([null, null]) : undefined}
      open={open}
      setOpen={setOpen}
      disabled={disabled}
      fieldId={fieldId}
      controlProps={controlProps}
      label={label}
      message={message}
      error={error}
      className={className}
      hidden={name && <>
        <input type="hidden" name={`${name}[0]`} value={s ? iso(s) : ""} />
        <input type="hidden" name={`${name}[1]`} value={e ? iso(e) : ""} />
      </>}
      panel={
        <div className="sh-date-range">
          {presets && (
            <div className="sh-date-range__presets">
              {presets.map((p) => (
                <button key={p.label} type="button" className="sh-menu__item" onClick={() => { set(p.range); setOpen(false); }}>{p.label}</button>
              ))}
            </div>
          )}
          <Calendar {...cal} autoFocus mode="range" value={current} onValueChange={(r) => { set(r); if (r[1]) setOpen(false); }} />
        </div>
      }
    />
  );
}

export type TimePickerProps = FieldProps & {
  /** "HH:mm", 24-hour. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (time: string | null) => void;
  /** Minutes between options. */
  step?: number;
  /** "HH:mm" bounds, e.g. opening hours. */
  min?: string;
  max?: string;
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
};

/** Pick a time from a list you can type to filter (MUI X's TimePicker). */
export function TimePicker({ step = 30, min = "00:00", max = "23:59", locale, placeholder = "Pick a time", ...props }: TimePickerProps) {
  const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmt = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" });
  const options = [];
  for (let m = toMin(min); m <= toMin(max); m += step) {
    const value = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    options.push({ value, label: fmt.format(new Date(2000, 0, 1, Math.floor(m / 60), m % 60)) });
  }
  return <Combobox {...props} options={options} placeholder={placeholder} />;
}

export type DateTimePickerProps = Omit<DatePickerProps, "format" | "clearable"> & { step?: number; minTime?: string; maxTime?: string };

/** Date and time side by side, one Date value (MUI X's DateTimePicker). */
export function DateTimePicker({ value, defaultValue = null, onValueChange, step, minTime, maxTime, label, hint, error, className, locale, disabled, ...cal }: DateTimePickerProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const set = (d: Date | null) => { if (value === undefined) setInternal(d); onValueChange?.(d); };
  const time = current ? `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}` : null;
  return (
    <div className={cn("sh-datetime", className)}>
      <DatePicker
        {...cal}
        label={label}
        hint={hint}
        error={error}
        locale={locale}
        disabled={disabled}
        value={current}
        onValueChange={(d) => set(d && new Date(d.getFullYear(), d.getMonth(), d.getDate(), current?.getHours() ?? 9, current?.getMinutes() ?? 0))}
      />
      <TimePicker
        label={<span className={label ? "sh-datetime__time-label" : "sh-visually-hidden"}>Time</span>}
        locale={locale}
        step={step}
        min={minTime}
        max={maxTime}
        placeholder="Time"
        disabled={disabled || !current}
        value={time}
        onValueChange={(t) => {
          if (!current || !t) return;
          const [h, m] = t.split(":").map(Number);
          set(new Date(current.getFullYear(), current.getMonth(), current.getDate(), h, m));
        }}
      />
    </div>
  );
}
