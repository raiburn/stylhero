import type { CSSProperties } from "react";
import { cn } from "../cn";

export type SkeletonProps = {
  variant?: "text" | "rect" | "circle";
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  /** For text: number of lines (the last one is shorter). */
  lines?: number;
  className?: string;
};

/** Grey placeholder shown while content loads. */
export function Skeleton({ variant = "text", width, height, lines = 1, className }: SkeletonProps) {
  if (variant === "text" && lines > 1) {
    return (
      <span className={cn("sh-skeleton-lines", className)} aria-hidden>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="sh-skeleton sh-skeleton--text" style={{ width: i === lines - 1 ? "60%" : width }} />
        ))}
      </span>
    );
  }
  return <span aria-hidden className={cn("sh-skeleton", `sh-skeleton--${variant}`, className)} style={{ width, height }} />;
}
