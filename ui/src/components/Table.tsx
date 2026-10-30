import type { TableHTMLAttributes } from "react";
import { cn } from "../cn";

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

/** A styled <table> in a scrolling, bordered wrapper. Write thead/tbody as usual; add `sh-num` to numeric cells. */
export function Table({ className, ...props }: TableProps) {
  return (
    <div className="sh-table-wrap">
      <table className={cn("sh-table", className)} {...props} />
    </div>
  );
}
