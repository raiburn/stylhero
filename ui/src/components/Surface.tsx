import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { cn } from "../cn";
import { space, type Space } from "./Stack";

export type PaperProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType;
  /** 0 = flat, 1 = card shadow, 2 = popover shadow. */
  elevation?: 0 | 1 | 2;
  outlined?: boolean;
  /** Inner padding in spacing steps. Leave unset to pad with your own classes. */
  padding?: Space;
  radius?: "sm" | "md" | "lg" | "none";
  /** "sunken" for wells inside a raised surface. */
  tone?: "raised" | "sunken" | "page";
};

/** A plain surface: background, radius, optional border and shadow. Card adds a title and layout on top of this. */
export function Paper({ as: Tag = "div", elevation = 1, outlined, padding, radius = "lg", tone = "raised", className, style, ...props }: PaperProps) {
  return (
    <Tag
      className={cn("sh-paper", `sh-paper--${tone}`, `sh-paper--e${elevation}`, outlined && "sh-paper--outlined", className)}
      style={{ padding: padding === undefined ? undefined : space(padding), borderRadius: radius === "none" ? 0 : `var(--radius-${radius})`, ...style }}
      {...props}
    />
  );
}

type Spacing = { p?: Space; px?: Space; py?: Space; m?: Space; mx?: Space; my?: Space; mt?: Space; mb?: Space };

export type BoxProps = HTMLAttributes<HTMLElement> & Spacing & {
  as?: ElementType;
  /** Any token color name, e.g. "surface-sunken" or "primary-soft". */
  bg?: string;
  /** Text color token, e.g. "ink-muted". */
  color?: string;
  radius?: "sm" | "md" | "lg" | "full";
  border?: boolean;
  display?: CSSProperties["display"];
};

/** Generic wrapper with token-based spacing and colors (MUI's Box). Prefer Stack/Grid for layout and Tailwind if you use it. */
export function Box({ as: Tag = "div", p, px, py, m, mx, my, mt, mb, bg, color, radius, border, display, style, ...props }: BoxProps) {
  const s = (n?: Space) => (n === undefined ? undefined : space(n));
  return (
    <Tag
      style={{
        padding: s(p), paddingInline: s(px), paddingBlock: s(py),
        margin: s(m), marginInline: s(mx), marginBlock: s(my), marginTop: s(mt), marginBottom: s(mb),
        background: bg ? `var(--${bg})` : undefined,
        color: color ? `var(--${color})` : undefined,
        borderRadius: radius ? `var(--radius-${radius})` : undefined,
        border: border ? "1px solid var(--line)" : undefined,
        display,
        ...style,
      }}
      {...props}
    />
  );
}
