import type { ReactNode } from "react";
import { cn } from "../cn";

export type TimelineEvent = {
  title: ReactNode;
  description?: ReactNode;
  /** Shown on the side: a time or date. */
  time?: ReactNode;
  /** Icon inside the dot. */
  icon?: ReactNode;
  tone?: "neutral" | "primary" | "success" | "accent" | "danger";
};

export type TimelineProps = {
  events: TimelineEvent[];
  /** "alternate" puts events on both sides of the line on wide screens. */
  layout?: "left" | "alternate";
  className?: string;
};

/** Events in order: a customer's visits, an order's status history (MUI Lab's Timeline). */
export function Timeline({ events, layout = "left", className }: TimelineProps) {
  return (
    <ol className={cn("sh-timeline", `sh-timeline--${layout}`, className)}>
      {events.map((e, i) => (
        <li key={i} className={cn("sh-timeline__item", `sh-timeline__item--${e.tone ?? "primary"}`)}>
          {e.time && <span className="sh-timeline__time">{e.time}</span>}
          <span className={cn("sh-timeline__dot", !!e.icon && "sh-timeline__dot--icon")} aria-hidden="true">{e.icon}</span>
          <div className="sh-timeline__content">
            <span className="sh-timeline__title">{e.title}</span>
            {e.description && <span className="sh-timeline__desc">{e.description}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
