"use client";

import { useId, useState, type HTMLAttributes } from "react";
import { cn } from "../cn";
import { StarIcon } from "../icons";

export type RatingProps = Omit<HTMLAttributes<HTMLElement>, "defaultValue"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  /** Display only. */
  readOnly?: boolean;
  /** Accessible name, e.g. "Rate your visit". */
  label?: string;
  name?: string;
  size?: "sm" | "md";
};

/** Star rating. The interactive version is a radio group, so arrow keys work. */
export function Rating({ value, defaultValue = 0, onValueChange, max = 5, readOnly, label = "Rating", name, size = "md", className, onMouseLeave, ...props }: RatingProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const current = value ?? internal;
  const autoName = useId();
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const classes = cn("sh-rating", size === "sm" && "sh-rating--sm", className);

  if (readOnly) {
    return (
      <span className={classes} role="img" aria-label={`${current} out of ${max}`} onMouseLeave={onMouseLeave} {...props}>
        {stars.map((n) => (
          <span key={n} className={cn("sh-rating__star", n <= current && "sh-rating__star--on")}><StarIcon /></span>
        ))}
      </span>
    );
  }
  return (
    <div className={classes} role="radiogroup" aria-label={label} onMouseLeave={(e) => { setHover(null); onMouseLeave?.(e); }} {...props}>
      {stars.map((n) => (
        <label key={n} className={cn("sh-rating__star", n <= (hover ?? current) && "sh-rating__star--on")} onMouseEnter={() => setHover(n)}>
          <input
            type="radio"
            name={name ?? autoName}
            value={n}
            checked={current === n}
            aria-label={n === 1 ? "1 star" : `${n} stars`}
            onChange={() => {
              if (value === undefined) setInternal(n);
              onValueChange?.(n);
            }}
          />
          <StarIcon />
        </label>
      ))}
    </div>
  );
}
