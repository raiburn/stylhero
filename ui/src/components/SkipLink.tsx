import { cn } from "../cn";

/** "Skip to content" link for keyboard users: hidden until focused. Put it first in the page. */
export function SkipLink({ href = "#content", children = "Skip to content", className }: { href?: string; children?: string; className?: string }) {
  return <a href={href} className={cn("sh-skip-link", className)}>{children}</a>;
}
