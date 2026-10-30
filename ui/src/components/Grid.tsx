import type { HTMLAttributes } from "react";
import { cn } from "../cn";
import { space, type Space } from "./Stack";

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  /** Fixed number of equal columns. */
  columns?: number;
  /** Or: fit as many columns as possible, each at least this wide (e.g. 240). Wraps on small screens. */
  minChildWidth?: number;
  gap?: Space;
};

export function Grid({ columns, minChildWidth = 240, gap = 6, className, style, ...props }: GridProps) {
  const template = columns ? `repeat(${columns}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(min(${minChildWidth}px, 100%), 1fr))`;
  return <div className={cn("sh-grid", className)} style={{ gridTemplateColumns: template, gap: space(gap), ...style }} {...props} />;
}
