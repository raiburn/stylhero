"use client";

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";

export type TocItem = { id: string; label: ReactNode };

export type TableOfContentsProps = HTMLAttributes<HTMLElement> & {
  /** Sections on the page, by element id. */
  items: TocItem[];
  label?: string;
};

/** In-page jump links that highlight the section in view (scroll spy), like the "On this page" list in docs. */
export function TableOfContents({ items, label = "On this page", className, ...props }: TableOfContentsProps) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={cn("sh-toc", className)} {...props}>
      <ul className="sh-toc__list">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className="sh-toc__link" aria-current={active === id ? "location" : undefined}>
              <span className="sh-toc__line" aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
