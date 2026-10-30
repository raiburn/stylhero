import type { HTMLAttributes } from "react";
import { cn } from "../cn";

/** Joins secondary Buttons or IconButtons into one bar. */
export function ButtonGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cn("sh-btn-group", className)} {...props} />;
}
