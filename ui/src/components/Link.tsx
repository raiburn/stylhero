"use client";

import type { AnchorHTMLAttributes } from "react";
import { cn } from "../cn";
import { useLinkComponent } from "../link";
import { ArrowUpRightIcon } from "../icons";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  muted?: boolean;
  /** "ink": heading color, primary on hover, no underline. For titles that are links. */
  tone?: "primary" | "ink";
  /** Opens in a new tab and adds an arrow that nudges on hover. */
  external?: boolean;
  /** Makes the whole nearest positioned parent (e.g. a ghost Card) clickable. */
  stretched?: boolean;
};

/** Styled text link. Renders your router's link when wrapped in <LinkProvider>. */
export function Link({ muted, tone = "primary", external, stretched, className, children, ...props }: LinkProps) {
  const Comp = useLinkComponent();
  const cls = cn("sh-link", muted && "sh-link--muted", tone === "ink" && "sh-link--ink", stretched && "sh-link--stretched", className);
  if (external) {
    return (
      <a className={cls} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
        <ArrowUpRightIcon className="sh-link__arrow" />
      </a>
    );
  }
  return <Comp className={cls} {...props}>{children}</Comp>;
}
