import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Used for the initials and the image's alt text. */
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** "rounded" is a soft square, for businesses and logos. */
  shape?: "circle" | "rounded";
  /** Your own image element instead of `src`, e.g. next/image. */
  children?: ReactNode;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function Avatar({ name, src, size = "md", shape = "circle", className, children, ...props }: AvatarProps) {
  return (
    <span className={cn("sh-avatar", size !== "md" && `sh-avatar--${size}`, shape === "rounded" && "sh-avatar--rounded", className)} title={name} {...props}>
      {children ?? (src ? <img src={src} alt={name} /> : <span aria-label={name}>{initials(name)}</span>)}
    </span>
  );
}

export type AvatarGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Avatar elements. */
  children: ReactNode[];
  /** Show at most this many, then "+N". */
  max?: number;
  size?: AvatarProps["size"];
};

/** Overlapping stack of avatars with a "+N" for the rest. */
export function AvatarGroup({ children, max = 4, size = "md", className, ...props }: AvatarGroupProps) {
  const shown = children.length > max ? children.slice(0, max - 1) : children;
  const rest = children.length - shown.length;
  return (
    <div className={cn("sh-avatar-group", className)} role="group" {...props}>
      {shown}
      {rest > 0 && (
        <span className={cn("sh-avatar sh-avatar--more", size !== "md" && `sh-avatar--${size}`)} aria-label={`${rest} more`}>
          +{rest}
        </span>
      )}
    </div>
  );
}
