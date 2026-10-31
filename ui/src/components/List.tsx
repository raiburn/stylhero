"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";
import { useLinkComponent } from "../link";

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  /** Small heading above the rows (MUI's ListSubheader). */
  subheader?: ReactNode;
  /** No border or background, for lists inside cards and drawers. */
  plain?: boolean;
  /** Tighter rows. */
  dense?: boolean;
};

/** Bordered list of rows, e.g. customers or recent visits. */
export function List({ subheader, plain, dense, className, children, ...props }: ListProps) {
  const list = (
    <ul className={cn("sh-list", plain && "sh-list--plain", dense && "sh-list--dense", className)} {...props}>
      {children}
    </ul>
  );
  if (!subheader) return list;
  return (
    <div className="sh-list-group">
      <div className="sh-list-group__title">{subheader}</div>
      {list}
    </div>
  );
}

export type ListItemProps = Omit<HTMLAttributes<HTMLLIElement>, "title" | "onClick"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Left side: an Avatar, icon or Checkbox. */
  leading?: ReactNode;
  /** Right side: a Badge, value or IconButton. */
  trailing?: ReactNode;
  /** Makes the whole row a link. */
  href?: string;
  onClick?: () => void;
  /** Highlights the row (e.g. the open conversation). */
  selected?: boolean;
  disabled?: boolean;
};

export function ListItem({ title, description, leading, trailing, href, onClick, selected, disabled, className, ...props }: ListItemProps) {
  const LinkComp = useLinkComponent();
  const body = (
    <>
      {leading && <span className="sh-list__leading">{leading}</span>}
      <span className="sh-list__text">
        <span className="sh-list__title">{title}</span>
        {description && <span className="sh-list__desc">{description}</span>}
      </span>
      {trailing && <span className="sh-list__trailing">{trailing}</span>}
    </>
  );
  const rowClass = cn("sh-list__row sh-list__row--action", selected && "sh-list__row--selected");
  return (
    <li className={cn("sh-list__item", className)} {...props}>
      {href && !disabled ? (
        <LinkComp href={href} className={rowClass} aria-current={selected ? "page" : undefined}>{body}</LinkComp>
      ) : onClick ? (
        <button type="button" className={rowClass} onClick={onClick} disabled={disabled} aria-pressed={selected === undefined ? undefined : selected}>{body}</button>
      ) : (
        <div className={cn("sh-list__row", selected && "sh-list__row--selected")}>{body}</div>
      )}
    </li>
  );
}
