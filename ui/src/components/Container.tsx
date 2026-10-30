import type { ElementType, HTMLAttributes } from "react";
import { cn } from "../cn";

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Max width: sm 640, md 768, lg 1024, xl 1280. */
  size?: "sm" | "md" | "lg" | "xl";
};

/** Centered page column with a 16px gutter on phones. */
export function Container({ as: Tag = "div", size = "lg", className, ...props }: ContainerProps) {
  return <Tag className={cn("sh-container", `sh-container--${size}`, className)} {...props} />;
}
