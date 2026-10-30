import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";

export type TransitionProps = {
  /** Show or hide the children. */
  in: boolean;
  children: ReactNode;
  /** fade: opacity · grow: fade + scale from 75% · zoom: scale from 0 · slide: from `direction` · collapse: height. */
  effect?: "fade" | "grow" | "zoom" | "slide" | "collapse";
  direction?: "up" | "down" | "left" | "right";
  /** ms. */
  duration?: number;
  /** Keep the children in the DOM while hidden (default: removed after the exit animation). */
  keepMounted?: boolean;
  className?: string;
};

/** Animates children in and out (MUI's Fade, Grow, Zoom, Slide and Collapse). Honors reduced motion. */
export function Transition({ in: show, children, effect = "fade", direction = "up", duration = 200, keepMounted, className }: TransitionProps) {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(show);
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(show ? "auto" : 0);

  useEffect(() => {
    if (show) {
      setMounted(true);
      // two frames so the browser paints the hidden state before transitioning
      const r = requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        if (effect === "collapse") setHeight(ref.current?.scrollHeight ?? "auto");
      }));
      return () => cancelAnimationFrame(r);
    }
    if (effect === "collapse" && ref.current) {
      setHeight(ref.current.scrollHeight);
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)));
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [show, effect, duration]);

  if (!mounted && !keepMounted) return null;
  return (
    <div
      ref={ref}
      className={cn("sh-transition", `sh-transition--${effect}`, `sh-transition--${direction}`, visible && "sh-transition--in", className)}
      style={{
        transitionDuration: `${duration}ms`,
        ...(effect === "collapse" ? { height: visible && height !== 0 ? height : 0 } : {}),
      }}
      hidden={!mounted && keepMounted ? true : undefined}
      onTransitionEnd={(e) => { if (e.target === e.currentTarget && effect === "collapse" && show) setHeight("auto"); }}
    >
      {children}
    </div>
  );
}

export const Fade = (p: Omit<TransitionProps, "effect">) => <Transition {...p} effect="fade" />;
export const Grow = (p: Omit<TransitionProps, "effect">) => <Transition {...p} effect="grow" />;
export const Zoom = (p: Omit<TransitionProps, "effect">) => <Transition {...p} effect="zoom" />;
export const Slide = (p: Omit<TransitionProps, "effect">) => <Transition {...p} effect="slide" />;
export const Collapse = (p: Omit<TransitionProps, "effect">) => <Transition {...p} effect="collapse" />;
