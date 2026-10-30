import { useId, type ReactNode } from "react";
import { cn } from "../cn";
import { ChevronDownIcon } from "../icons";

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode };

export type AccordionProps = {
  items: AccordionItem[];
  /** Ids open on first render. */
  defaultOpen?: string[];
  /** Only one open at a time. */
  single?: boolean;
  className?: string;
};

/** Collapsible sections built on native <details>, so they work without JavaScript and with find-in-page. */
export function Accordion({ items, defaultOpen = [], single, className }: AccordionProps) {
  const group = useId();
  return (
    <div className={cn("sh-accordion", className)}>
      {items.map((item) => (
        <details key={item.id} className="sh-accordion__item" name={single ? group : undefined} open={defaultOpen.includes(item.id) || undefined}>
          <summary className="sh-accordion__summary">
            <span>{item.title}</span>
            <ChevronDownIcon />
          </summary>
          <div className="sh-accordion__content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
