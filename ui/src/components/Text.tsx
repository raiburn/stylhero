import type { ElementType, HTMLAttributes } from "react";
import { cn } from "../cn";

// "lead" is a larger intro paragraph; "strong" keeps the surrounding size and makes text bold ink.
type Variant = "display" | "h1" | "h2" | "h3" | "lead" | "body" | "small" | "label" | "mono" | "strong";
const defaultTag: Record<Variant, ElementType> = {
  display: "h1", h1: "h1", h2: "h2", h3: "h3", lead: "p", body: "p", small: "p", label: "span", mono: "code", strong: "strong",
};

export type TextProps = HTMLAttributes<HTMLElement> & {
  /** Type style from tokens.json. */
  variant?: Variant;
  tone?: "ink" | "muted" | "primary" | "success" | "danger";
  /** Override the HTML tag, e.g. variant="h1" as="h2" for an h1 look at h2 level. */
  as?: ElementType;
};

export function Text({ variant = "body", tone, as, className, ...props }: TextProps) {
  const Tag = as ?? defaultTag[variant];
  return <Tag className={cn("sh-text", `sh-text--${variant}`, tone && `sh-text--${tone}`, className)} {...props} />;
}
