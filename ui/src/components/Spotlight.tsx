"use client";

import { useEffect, useRef } from "react";
import { cn } from "../cn";

/** Soft glow that follows the cursor, for landing and portfolio pages. Wide screens only; off for reduced motion. */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current?.style.setProperty("--sh-x", `${e.clientX}px`);
      ref.current?.style.setProperty("--sh-y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={ref} aria-hidden="true" className={cn("sh-spotlight", className)} />;
}
