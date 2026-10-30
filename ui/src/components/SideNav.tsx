"use client";

import type { ReactNode } from "react";
import { cn } from "../cn";
import { useLinkComponent } from "../link";

export type SideNavItem = { label: ReactNode; href: string; icon?: ReactNode; active?: boolean; /** Count or Badge on the right. */ badge?: ReactNode };
export type SideNavSection = { title?: ReactNode; items: SideNavItem[] };

export type SideNavProps = {
  sections: SideNavSection[];
  /** Top of the sidebar, e.g. the logo. */
  header?: ReactNode;
  /** Bottom of the sidebar, e.g. the signed-in user. */
  footer?: ReactNode;
  className?: string;
};

/** Vertical app navigation for dashboards. Put it in a Drawer on phones. */
export function SideNav({ sections, header, footer, className }: SideNavProps) {
  const LinkComp = useLinkComponent();
  return (
    <aside className={cn("sh-sidenav", className)}>
      {header && <div className="sh-sidenav__header">{header}</div>}
      <nav className="sh-sidenav__nav" aria-label="Sections">
        {sections.map((s, i) => (
          <div key={i} className="sh-sidenav__section">
            {s.title && <div className="sh-sidenav__title">{s.title}</div>}
            {s.items.map((item) => (
              <LinkComp key={item.href} href={item.href} className="sh-sidenav__link" aria-current={item.active ? "page" : undefined}>
                {item.icon}
                <span className="sh-sidenav__label">{item.label}</span>
                {item.badge !== undefined && <span className="sh-sidenav__badge">{item.badge}</span>}
              </LinkComp>
            ))}
          </div>
        ))}
      </nav>
      {footer && <div className="sh-sidenav__footer">{footer}</div>}
    </aside>
  );
}
