"use client";

import type { ReactNode } from "react";
import { cn } from "../cn";
import { useLinkComponent } from "../link";

export type BottomNavItem = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  /** Small count on the icon. */
  badge?: number;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  /** Hide labels except on the active item (MUI's showLabels={false}). */
  compact?: boolean;
  /** Pins it to the bottom of the screen, above the iPhone home bar. */
  fixed?: boolean;
  label?: string;
  className?: string;
};

/** Phone tab bar: 3 to 5 top-level destinations. */
export function BottomNav({ items, compact, fixed, label = "Main", className }: BottomNavProps) {
  const LinkComp = useLinkComponent();
  return (
    <nav aria-label={label} className={cn("sh-bottom-nav", fixed && "sh-bottom-nav--fixed", compact && "sh-bottom-nav--compact", className)}>
      {items.map((it) => {
        const body = (
          <>
            <span className="sh-bottom-nav__icon">
              {it.icon}
              {!!it.badge && <span className="sh-bottom-nav__badge">{it.badge > 99 ? "99+" : it.badge}</span>}
            </span>
            <span className="sh-bottom-nav__label">{it.label}</span>
          </>
        );
        const cls = "sh-bottom-nav__item";
        return it.href ? (
          <LinkComp key={it.label} href={it.href} className={cls} aria-current={it.active ? "page" : undefined}>{body}</LinkComp>
        ) : (
          <button key={it.label} type="button" className={cls} aria-current={it.active ? "page" : undefined} onClick={it.onClick}>{body}</button>
        );
      })}
    </nav>
  );
}
