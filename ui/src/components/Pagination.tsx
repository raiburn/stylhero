import { cn } from "../cn";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export type PaginationProps = {
  /** Current page, starting at 1. */
  page: number;
  /** Total number of pages. */
  count: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one. */
  siblings?: number;
  className?: string;
};

/** 1 … 4 5 [6] 7 8 … 20 */
export function pageRange(page: number, count: number, siblings = 1): Array<number | "gap"> {
  const total = siblings * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - siblings, count - siblings * 2 - 2));
  const end = Math.min(count - 1, Math.max(page + siblings, siblings * 2 + 3));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...(start > 2 ? ["gap" as const] : []), ...middle, ...(end < count - 1 ? ["gap" as const] : []), count];
}

export function Pagination({ page, count, onPageChange, siblings = 1, className }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cn("sh-pagination", className)}>
      <button type="button" className="sh-pagination__item" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeftIcon />
      </button>
      {pageRange(page, count, siblings).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="sh-pagination__gap" aria-hidden>…</span>
        ) : (
          <button
            key={p}
            type="button"
            className="sh-pagination__item"
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button type="button" className="sh-pagination__item" aria-label="Next page" disabled={page >= count} onClick={() => onPageChange(page + 1)}>
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
