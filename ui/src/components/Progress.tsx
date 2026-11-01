import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** 0 to max. Leave out for an indeterminate (moving) bar. */
  value?: number;
  max?: number;
  label?: ReactNode;
  /** Show "40%" (or a custom string) next to the label. */
  valueText?: boolean | string;
  tone?: "primary" | "success" | "accent";
};

/** Linear progress bar. */
export function Progress({ value, max = 100, label, valueText, tone = "primary", className, ...props }: ProgressProps) {
  const pct = value === undefined ? undefined : Math.min(100, Math.max(0, (value / max) * 100));
  const text = typeof valueText === "string" ? valueText : valueText && pct !== undefined ? `${Math.round(pct)}%` : null;
  return (
    <div className={cn("sh-progress", `sh-progress--${tone}`, className)} {...props}>
      {(label || text) && (
        <div className="sh-progress__head">
          <span>{label}</span>
          {text && <span className="sh-progress__value">{text}</span>}
        </div>
      )}
      <div
        className={cn("sh-progress__track", pct === undefined && "sh-progress__track--indeterminate")}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={typeof label === "string" ? label : undefined}
      >
        <div className="sh-progress__bar" style={pct === undefined ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
}

export type ProgressCircleProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
  max?: number;
  /** Diameter in px. */
  size?: number;
  /** Text in the middle; defaults to the percentage. */
  children?: ReactNode;
  label?: string;
  tone?: "primary" | "success" | "accent";
};

/** Ring progress, e.g. "7 of 10 stamps". */
export function ProgressCircle({ value, max = 100, size = 64, children, label, tone = "primary", className, style, ...props }: ProgressCircleProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = 15.5;
  const c = 2 * Math.PI * r;
  return (
    <div
      className={cn("sh-ring", `sh-progress--${tone}`, className)}
      style={{ width: size, height: size, ...style }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      {...props}
    >
      <svg viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r={r} className="sh-ring__track" />
        <circle cx="18" cy="18" r={r} className="sh-ring__bar" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className="sh-ring__text" style={{ fontSize: Math.max(11, size * 0.22) }}>{children ?? `${Math.round(pct)}%`}</span>
    </div>
  );
}
