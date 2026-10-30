import type { ReactNode } from "react";
import { cn } from "../cn";
import { ChevronRightIcon } from "../icons";
import { useLinkComponent } from "../link";

export type Crumb = { label: ReactNode; href?: string };

/** Trail of parent pages. The last item is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const LinkComp = useLinkComponent();
  return (
    <nav aria-label="Breadcrumb" className={cn("sh-breadcrumbs", className)}>
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined}>{c.label}</span>
              ) : (
                <LinkComp href={c.href} className="sh-breadcrumbs__link">{c.label}</LinkComp>
              )}
              {!last && <ChevronRightIcon />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
