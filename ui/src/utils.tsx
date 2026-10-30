"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactElement, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

/** Renders children into document.body (or `container`), outside overflow and stacking contexts. */
export function Portal({ children, container }: { children: ReactNode; container?: Element | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, container ?? document.body) : null;
}

/** Renders children only in the browser, after hydration (e.g. things that read window or localStorage). */
export function NoSsr({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

/** Calls `handler` on a pointer down outside `ref`. */
export function useClickAway(ref: RefObject<HTMLElement | null>, handler: (e: PointerEvent) => void) {
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    const on = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) saved.current(e);
    };
    document.addEventListener("pointerdown", on);
    return () => document.removeEventListener("pointerdown", on);
  }, [ref]);
}

/** Wraps one element and calls `onClickAway` when someone clicks outside it. */
export function ClickAwayListener({ children, onClickAway }: { children: ReactElement; onClickAway: (e: PointerEvent) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, onClickAway);
  return <div ref={ref} style={{ display: "contents" }}>{children}</div>;
}

/**
 * `const wide = useMediaQuery("(min-width: 768px)")`. Returns false during server rendering.
 * Breakpoints used by the components: 640px (phone) and 1024px (desktop).
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
