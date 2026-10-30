import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";
import { space, type Space } from "./Stack";

export type ImageListItem = {
  src: string;
  alt: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Top-right action on the title bar, e.g. a favorite IconButton. */
  action?: ReactNode;
  /** Quilted layout: how many columns/rows this tile spans. */
  cols?: number;
  rows?: number;
};

export type ImageListProps = {
  items: ImageListItem[];
  /** "masonry" keeps each image's own height. "quilted" uses cols/rows per item. */
  variant?: "standard" | "quilted" | "masonry";
  columns?: number;
  /** Row height in px for standard and quilted. */
  rowHeight?: number;
  gap?: Space;
  /** Where the title sits: over the image or under it. */
  titlePosition?: "overlay" | "below";
  className?: string;
};

/** Grid of photos: products, a business's gallery, rewards. */
export function ImageList({ items, variant = "standard", columns = 3, rowHeight = 180, gap = 2, titlePosition = "overlay", className }: ImageListProps) {
  const masonry = variant === "masonry";
  const style: CSSProperties = masonry
    ? { columnCount: columns, columnGap: space(gap) }
    : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridAutoRows: rowHeight, gap: space(gap) };
  return (
    <ul className={cn("sh-image-list", `sh-image-list--${variant}`, className)} style={style}>
      {items.map((it, i) => (
        <li
          key={i}
          className={cn("sh-image-list__item", titlePosition === "below" && "sh-image-list__item--below")}
          style={masonry ? { marginBottom: space(gap) } : variant === "quilted" ? { gridColumn: `span ${it.cols ?? 1}`, gridRow: `span ${it.rows ?? 1}` } : undefined}
        >
          <img src={it.src} alt={it.alt} loading="lazy" />
          {(it.title || it.action) && (
            <div className="sh-image-list__bar">
              <div className="sh-image-list__text">
                {it.title && <span className="sh-image-list__title">{it.title}</span>}
                {it.subtitle && <span className="sh-image-list__subtitle">{it.subtitle}</span>}
              </div>
              {it.action}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export type MasonryProps = HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  gap?: Space;
};

/** Cards of different heights packed into columns, Pinterest-style (MUI Lab's Masonry). Items flow top-to-bottom per column. */
export function Masonry({ columns = 3, gap = 4, className, style, children, ...props }: MasonryProps) {
  return (
    <div className={cn("sh-masonry", className)} style={{ columnCount: columns, columnGap: space(gap), ["--sh-gap" as string]: space(gap), ...style }} {...props}>
      {children}
    </div>
  );
}
