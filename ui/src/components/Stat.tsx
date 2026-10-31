import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";
import { TrendDownIcon, TrendUpIcon } from "../icons";

export type StatProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
  /** e.g. "+12%". Its sign picks the arrow unless `trend` is set. */
  change?: string;
  trend?: "up" | "down";
  /** Set when going down is good (e.g. wait time), so down shows green. */
  invert?: boolean;
  hint?: ReactNode;
  /** Number above the label, for labels that continue the number ("3 · checks per answer"). */
  valueFirst?: boolean;
};

/** A headline number for dashboards. */
export function Stat({ label, value, change, trend, invert, hint, valueFirst, className, ...props }: StatProps) {
  const dir = trend ?? (change?.trim().startsWith("-") || change?.trim().startsWith("−") ? "down" : "up");
  const good = (dir === "up") !== Boolean(invert);
  const labelEl = <span className="sh-stat__label">{label}</span>;
  return (
    <div className={cn("sh-stat", className)} {...props}>
      {!valueFirst && labelEl}
      <span className="sh-stat__value">{value}</span>
      {valueFirst && labelEl}
      {(change || hint) && (
        <span className="sh-stat__meta">
          {change && (
            <span className={cn("sh-stat__change", good ? "sh-stat__change--good" : "sh-stat__change--bad")}>
              {dir === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
              {change}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </span>
      )}
    </div>
  );
}
