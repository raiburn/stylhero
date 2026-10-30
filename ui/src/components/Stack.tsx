import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { cn } from "../cn";

/** Spacing steps from tokens.json: 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 6 = 24px, 8 = 32px, 12 = 48px. */
export type Space = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;
export const space = (n: Space) => (n === 0 ? "0" : `var(--space-${n})`);

export type StackProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  direction?: "column" | "row";
  gap?: Space;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
};

/** Flex column (or row) with token-based gaps. */
export function Stack({ as: Tag = "div", direction = "column", gap = 3, align, justify, wrap, className, style, ...props }: StackProps) {
  return (
    <Tag
      className={cn("sh-stack", className)}
      style={{ flexDirection: direction, gap: space(gap), alignItems: align, justifyContent: justify, flexWrap: wrap ? "wrap" : undefined, ...style }}
      {...props}
    />
  );
}
