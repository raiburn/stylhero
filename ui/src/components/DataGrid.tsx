"use client";

import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../cn";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchIcon } from "../icons";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Pagination } from "./Pagination";
import { Popover } from "./Popover";

export type GridColumn<T> = {
  /** Key in the row object. Also the column id. */
  field: string;
  header: ReactNode;
  /** Custom cell, e.g. a Badge. Search and sort still use the raw value. */
  render?: (row: T) => ReactNode;
  /** Turns the raw value into text (e.g. money). Used for the cell, search and CSV. */
  format?: (value: unknown, row: T) => string;
  /** Value used for sorting and search, when it isn't row[field]. */
  getValue?: (row: T) => unknown;
  /** Right-aligns and uses tabular numbers. */
  numeric?: boolean;
  sortable?: boolean;
  /** Start hidden; people can show it from "Columns". */
  hidden?: boolean;
  width?: number | string;
};

export type SortState = { field: string; direction: "asc" | "desc" } | null;

export type DataGridProps<T> = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  rows: T[];
  columns: GridColumn<T>[];
  /** Defaults to row.id. */
  getRowId?: (row: T) => string;
  /** Adds a search box that filters rows across all visible columns. */
  search?: boolean | string;
  /** Checkbox column; read the result with onSelectionChange. */
  checkboxSelection?: boolean;
  selection?: string[];
  onSelectionChange?: (ids: string[]) => void;
  defaultSort?: SortState;
  /** Rows per page. 0 shows everything. */
  pageSize?: number;
  pageSizeOptions?: number[];
  /** Shows a "Columns" button to hide and show columns. */
  columnsButton?: boolean;
  /** Shows an "Export" button that downloads the filtered rows as CSV with this file name. */
  exportFileName?: string;
  /** Extra buttons in the toolbar (right side). */
  actions?: ReactNode;
  onRowClick?: (row: T) => void;
  density?: "compact" | "standard" | "comfortable";
  loading?: boolean;
  emptyText?: ReactNode;
  /** Scroll the body inside this height with a sticky header. */
  maxHeight?: number | string;
  /** Accessible name. */
  label?: string;
};

const valueOf = <T,>(row: T, c: GridColumn<T>) => (c.getValue ? c.getValue(row) : (row as Record<string, unknown>)[c.field]);
const textOf = <T,>(row: T, c: GridColumn<T>) => {
  const v = valueOf(row, c);
  return c.format ? c.format(v, row) : v == null ? "" : String(v);
};
const compare = (a: unknown, b: unknown) => {
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

/** Table with sorting, search, selection, pagination, column hiding and CSV export (MUI X's DataGrid). */
export function DataGrid<T>({
  rows, columns, getRowId = (r) => String((r as { id: unknown }).id), search, checkboxSelection, selection, onSelectionChange,
  defaultSort = null, pageSize: pageSizeProp = 10, pageSizeOptions = [10, 25, 50], columnsButton, exportFileName, actions,
  onRowClick, density = "standard", loading, emptyText = "No rows", maxHeight, label, className, ...props
}: DataGridProps<T>) {
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeProp);
  const [hidden, setHidden] = useState(() => columns.filter((c) => c.hidden).map((c) => c.field));
  const [selInternal, setSelInternal] = useState<string[]>([]);
  const selected = selection ?? selInternal;
  const setSelected = (ids: string[]) => {
    if (selection === undefined) setSelInternal(ids);
    onSelectionChange?.(ids);
  };

  const cols = columns.filter((c) => !hidden.includes(c.field));
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = q ? rows.filter((r) => cols.some((c) => textOf(r, c).toLowerCase().includes(q))) : rows.slice();
    if (sort) {
      const c = columns.find((x) => x.field === sort.field);
      if (c) out = out.sort((a, b) => compare(valueOf(a, c), valueOf(b, c)) * (sort.direction === "asc" ? 1 : -1));
    }
    return out;
  }, [rows, query, sort, columns, hidden]); // eslint-disable-line react-hooks/exhaustive-deps

  const pages = pageSize > 0 ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const current = Math.min(page, pages);
  const shown = pageSize > 0 ? filtered.slice((current - 1) * pageSize, current * pageSize) : filtered;
  const shownIds = shown.map(getRowId);
  const allOnPage = shownIds.length > 0 && shownIds.every((id) => selected.includes(id));
  const someOnPage = shownIds.some((id) => selected.includes(id));

  const cycleSort = (field: string) =>
    setSort((s) => (s?.field !== field ? { field, direction: "asc" } : s.direction === "asc" ? { field, direction: "desc" } : null));

  const exportCsv = () => {
    const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
    const head = cols.map((c) => esc(typeof c.header === "string" ? c.header : c.field)).join(",");
    const body = filtered.map((r) => cols.map((c) => esc(textOf(r, c))).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + head + "\n" + body], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: exportFileName!.endsWith(".csv") ? exportFileName : `${exportFileName}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const toolbar = search || columnsButton || exportFileName || actions || (checkboxSelection && selected.length > 0);

  return (
    <div className={cn("sh-grid-table", `sh-grid-table--${density}`, className)} {...props}>
      {toolbar && (
        <div className="sh-grid-table__toolbar">
          {search && (
            <Input
              className="sh-grid-table__search"
              aria-label="Search rows"
              placeholder={typeof search === "string" ? search : "Search"}
              start={<SearchIcon />}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          )}
          {checkboxSelection && selected.length > 0 && (
            <span className="sh-grid-table__selected" role="status">{selected.length} selected</span>
          )}
          <div className="sh-grid-table__actions">
            {columnsButton && (
              <Popover trigger={<Button variant="secondary" size="sm">Columns</Button>} title="Show columns" placement="bottom-end">
                {columns.map((c) => (
                  <Checkbox
                    key={c.field}
                    label={c.header}
                    checked={!hidden.includes(c.field)}
                    disabled={!hidden.includes(c.field) && cols.length === 1}
                    onChange={() => setHidden((h) => (h.includes(c.field) ? h.filter((x) => x !== c.field) : [...h, c.field]))}
                  />
                ))}
              </Popover>
            )}
            {exportFileName && <Button variant="secondary" size="sm" onClick={exportCsv}>Export CSV</Button>}
            {actions}
          </div>
        </div>
      )}
      <div className="sh-table-wrap" style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
        <table className="sh-table" aria-label={label} aria-busy={loading || undefined} aria-rowcount={filtered.length + 1}>
          <thead>
            <tr>
              {checkboxSelection && (
                <th className="sh-grid-table__check">
                  <Checkbox
                    label={<span className="sh-visually-hidden">Select all rows on this page</span>}
                    checked={allOnPage}
                    indeterminate={!allOnPage && someOnPage}
                    disabled={!shownIds.length}
                    onChange={() => setSelected(allOnPage ? selected.filter((id) => !shownIds.includes(id)) : [...new Set([...selected, ...shownIds])])}
                  />
                </th>
              )}
              {cols.map((c) => {
                const sortable = c.sortable !== false;
                const dir = sort?.field === c.field ? sort.direction : null;
                return (
                  <th
                    key={c.field}
                    className={cn(c.numeric && "sh-num")}
                    style={{ width: c.width }}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : sortable ? "none" : undefined}
                  >
                    {sortable ? (
                      <button type="button" className={cn("sh-grid-table__sort", dir && "sh-grid-table__sort--on")} onClick={() => cycleSort(c.field)}>
                        {c.header}
                        {dir === "asc" ? <ArrowUpIcon /> : dir === "desc" ? <ArrowDownIcon /> : <ArrowUpDownIcon />}
                      </button>
                    ) : c.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && !rows.length ? (
              Array.from({ length: 3 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={cols.length + (checkboxSelection ? 1 : 0)}><span className="sh-skeleton sh-skeleton--text" /></td>
                </tr>
              ))
            ) : shown.length === 0 ? (
              <tr><td className="sh-grid-table__empty" colSpan={cols.length + (checkboxSelection ? 1 : 0)}>{query ? `No rows match "${query}"` : emptyText}</td></tr>
            ) : (
              shown.map((r) => {
                const id = getRowId(r);
                const isSel = selected.includes(id);
                return (
                  <tr
                    key={id}
                    aria-selected={checkboxSelection ? isSel : undefined}
                    className={cn(isSel && "sh-grid-table__row--selected", onRowClick && "sh-grid-table__row--click")}
                    onClick={onRowClick ? (e) => { if (!(e.target as HTMLElement).closest("input,button,a")) onRowClick(r); } : undefined}
                  >
                    {checkboxSelection && (
                      <td className="sh-grid-table__check">
                        <Checkbox
                          label={<span className="sh-visually-hidden">Select row</span>}
                          checked={isSel}
                          onChange={() => setSelected(isSel ? selected.filter((x) => x !== id) : [...selected, id])}
                        />
                      </td>
                    )}
                    {cols.map((c) => (
                      <td key={c.field} className={cn(c.numeric && "sh-num")}>{c.render ? c.render(r) : textOf(r, c)}</td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {pageSize > 0 && filtered.length > Math.min(pageSize, ...pageSizeOptions) && (
        <div className="sh-grid-table__footer">
          <label className="sh-grid-table__page-size">
            Rows per page
            <select className="sh-input" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[...new Set([pageSizeProp, ...pageSizeOptions])].sort((a, b) => a - b).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <span className="sh-grid-table__range">
            {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, filtered.length)} of {filtered.length}
          </span>
          {pages > 1 && <Pagination page={current} count={pages} onPageChange={setPage} siblings={0} />}
        </div>
      )}
    </div>
  );
}
