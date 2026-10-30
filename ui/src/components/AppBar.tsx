import type { ReactNode } from "react";
import { cn } from "../cn";
import { useLinkComponent } from "../link";

export type NavLink = { label: ReactNode; href: string; active?: boolean };

export type AppBarProps = {
  /** Usually <img src="/stylhero-wordmark.svg" …>. */
  logo?: ReactNode;
  /** Where the logo links to. */
  logoHref?: string;
  links?: NavLink[];
  /** Right side: search, avatar, buttons. */
  actions?: ReactNode;
  /** Stays at the top while scrolling. */
  sticky?: boolean;
  className?: string;
};

/** Top bar with logo, main links and actions. Links scroll sideways on phones. */
export function AppBar({ logo, logoHref = "/", links, actions, sticky = true, className }: AppBarProps) {
  const LinkComp = useLinkComponent();
  return (
    <header className={cn("sh-appbar", sticky && "sh-appbar--sticky", className)}>
      {logo && <LinkComp href={logoHref} className="sh-appbar__logo">{logo}</LinkComp>}
      {links && (
        <nav className="sh-appbar__nav" aria-label="Main">
          {links.map((l) => (
            <LinkComp key={l.href} href={l.href} className="sh-appbar__link" aria-current={l.active ? "page" : undefined}>
              {l.label}
            </LinkComp>
          ))}
        </nav>
      )}
      {actions && <div className="sh-appbar__actions">{actions}</div>}
    </header>
  );
}
