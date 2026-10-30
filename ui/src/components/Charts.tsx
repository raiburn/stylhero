"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";

// Colors come from tokens chart-1..8 (validated for color-blind separation). Slots are assigned in order and never cycled.
const MAX_SERIES = 8;
const color = (i: number) => `var(--chart-${i + 1})`;
const OTHER = "var(--ink-muted)";

export type ChartSeries = { name: string; data: number[] };
type Fmt = (n: number) => string;
const defaultFmt: Fmt = (n) => n.toLocaleString();

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
function useWidth<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceScale(lo: number, hi: number, count = 5) {
  if (lo === hi) hi = lo + 1;
  const raw = (hi - lo) / count;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  const min = Math.floor(lo / step) * step;
  const max = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let t = min; t <= max + step / 2; t += step) ticks.push(+t.toFixed(10));
  return { min, max, ticks };
}

type FrameProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  legend?: Array<{ name: string; color: string; value?: string }>;
  table: { head: string[]; rows: Array<Array<string>> };
  children: ReactNode;
  className?: string;
  /** Screen-reader summary of what the chart shows. */
  description?: string;
};

function ChartFrame({ title, subtitle, legend, table, children, className, description }: FrameProps) {
  const [showTable, setShowTable] = useState(false);
  const id = useId();
  return (
    <figure className={cn("sh-chart", className)} aria-labelledby={title ? `${id}-t` : undefined}>
      {(title || subtitle) && (
        <figcaption className="sh-chart__caption">
          {title && <span id={`${id}-t`} className="sh-chart__title">{title}</span>}
          {subtitle && <span className="sh-chart__subtitle">{subtitle}</span>}
        </figcaption>
      )}
      {legend && legend.length > 1 && (
        <ul className="sh-chart__legend">
          {legend.map((l) => (
            <li key={l.name}>
              <span className="sh-chart__swatch" style={{ background: l.color }} />
              {l.name}
              {l.value && <span className="sh-chart__legend-value">{l.value}</span>}
            </li>
          ))}
        </ul>
      )}
      {showTable ? (
        <div className="sh-table-wrap sh-chart__table">
          <table className="sh-table">
            <thead><tr>{table.head.map((h, i) => <th key={i} className={i ? "sh-num" : undefined}>{h}</th>)}</tr></thead>
            <tbody>{table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j ? "sh-num" : undefined}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : (
        <div className="sh-chart__plot" role="img" aria-label={description ?? (typeof title === "string" ? title : "Chart")}>
          {children}
        </div>
      )}
      <button type="button" className="sh-chart__toggle" aria-pressed={showTable} onClick={() => setShowTable(!showTable)}>
        {showTable ? "Show chart" : "Show as table"}
      </button>
    </figure>
  );
}

function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) {
  const left = Math.min(Math.max(x, 80), width - 80);
  return <div className="sh-chart__tooltip" style={{ left, top: y }} aria-hidden="true">{children}</div>;
}

function TipRows({ title, rows }: { title: ReactNode; rows: Array<{ name: string; color: string; value: string }> }) {
  return (
    <>
      <div className="sh-chart__tooltip-title">{title}</div>
      {rows.map((r) => (
        <div key={r.name} className="sh-chart__tooltip-row">
          <span className="sh-chart__swatch" style={{ background: r.color }} />
          <span>{r.name}</span>
          <b>{r.value}</b>
        </div>
      ))}
    </>
  );
}

type CartesianProps = {
  /** X-axis categories, e.g. ["Mon", "Tue", ...]. */
  labels: string[];
  /** Up to 8 series. More than that should be grouped into "Other" before charting. */
  series: ChartSeries[];
  title?: ReactNode;
  subtitle?: ReactNode;
  height?: number;
  valueFormat?: Fmt;
  description?: string;
  className?: string;
};

const tableOf = (labels: string[], series: ChartSeries[], fmt: Fmt) => ({
  head: ["", ...series.map((s) => s.name)],
  rows: labels.map((l, i) => [l, ...series.map((s) => fmt(s.data[i] ?? 0))]),
});

function Axes({ ticks, y, left, right, labels, xAt, bottom, fmt, every }: {
  ticks: number[]; y: (v: number) => number; left: number; right: number; labels: string[]; xAt: (i: number) => number; bottom: number; fmt: Fmt; every: number;
}) {
  return (
    <g className="sh-chart__axes">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={right} y1={y(t)} y2={y(t)} className={t === 0 ? "sh-chart__baseline" : "sh-chart__grid"} />
          <text x={left - 8} y={y(t)} dy="0.32em" textAnchor="end">{fmt(t)}</text>
        </g>
      ))}
      {labels.map((l, i) => (i % every === 0 ? <text key={i} x={xAt(i)} y={bottom + 18} textAnchor="middle">{l}</text> : null))}
    </g>
  );
}

const labelEvery = (labels: string[], plotW: number) => {
  const longest = Math.max(...labels.map((l) => l.length), 1) * 7 + 12;
  return Math.max(1, Math.ceil((labels.length * longest) / plotW));
};
const marginLeft = (ticks: number[], fmt: Fmt) => Math.max(...ticks.map((t) => fmt(t).length)) * 7 + 14;

/** Bar path: 4px rounded data end, square at the baseline. */
function barPath(x: number, w: number, yTop: number, yBase: number) {
  const h = yBase - yTop;
  if (h <= 0) return "";
  const r = Math.min(4, h, w / 2);
  return `M${x},${yBase}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop + r}V${yBase}Z`;
}

export type BarChartProps = CartesianProps & { stacked?: boolean };

/** Compare amounts across categories (MUI X's BarChart). Hover a column for exact values. */
export function BarChart({ labels, series: all, title, subtitle, height = 260, valueFormat = defaultFmt, stacked, description, className }: BarChartProps) {
  const series = all.slice(0, MAX_SERIES);
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const totals = labels.map((_, i) => series.reduce((s, x) => s + Math.max(0, x.data[i] ?? 0), 0));
  const maxV = stacked ? Math.max(...totals, 0) : Math.max(...series.flatMap((s) => s.data), 0);
  const { max, ticks } = niceScale(0, maxV);
  const top = 8, bottom = height - 28, left = marginLeft(ticks, valueFormat), right = width - 4;
  const y = (v: number) => bottom - (v / max) * (bottom - top);
  const band = (right - left) / Math.max(labels.length, 1);
  const k = stacked ? 1 : series.length;
  const barW = Math.max(2, Math.min(24, (band * 0.7 - (k - 1) * 2) / k));
  const groupW = barW * k + (k - 1) * 2;
  const xAt = (i: number) => left + band * i + band / 2;

  return (
    <ChartFrame title={title} subtitle={subtitle} description={description} className={className}
      legend={series.map((s, i) => ({ name: s.name, color: color(i) }))} table={tableOf(labels, series, valueFormat)}>
      <div ref={ref} className="sh-chart__canvas" onMouseLeave={() => setHover(null)}>
        <svg width={width} height={height}>
          {width > 80 && <>
          <Axes ticks={ticks} y={y} left={left} right={right} labels={labels} xAt={xAt} bottom={bottom} fmt={valueFormat} every={labelEvery(labels, right - left)} />
          {labels.map((_, i) => {
            const x0 = xAt(i) - groupW / 2;
            let acc = 0;
            return (
              <g key={i}>
                {hover === i && <rect x={left + band * i} y={top} width={band} height={bottom - top} className="sh-chart__hover-band" />}
                {series.map((s, j) => {
                  const v = Math.max(0, s.data[i] ?? 0);
                  if (stacked) {
                    const isTop = series.slice(j + 1).every((n) => !(n.data[i] > 0));
                    const yb = y(acc) - (acc > 0 ? 2 : 0);
                    acc += v;
                    const yt = y(acc);
                    return v > 0 && yb > yt ? (
                      <path key={j} d={isTop ? barPath(x0, barW, yt, yb) : `M${x0},${yb}V${yt}H${x0 + barW}V${yb}Z`} fill={color(j)} />
                    ) : null;
                  }
                  return <path key={j} d={barPath(x0 + j * (barW + 2), barW, y(v), bottom)} fill={color(j)} />;
                })}
                <rect x={left + band * i} y={top} width={band} height={bottom - top} fill="transparent" onMouseEnter={() => setHover(i)} />
              </g>
            );
          })}
          </>}
        </svg>
        {hover !== null && (
          <Tooltip x={xAt(hover)} y={Math.max(top, y(stacked ? totals[hover] : Math.max(...series.map((s) => s.data[hover] ?? 0)))) - 8} width={width}>
            <TipRows title={labels[hover]} rows={series.map((s, i) => ({ name: s.name, color: color(i), value: valueFormat(s.data[hover] ?? 0) }))} />
          </Tooltip>
        )}
      </div>
    </ChartFrame>
  );
}

export type LineChartProps = CartesianProps & {
  /** Fills under each line with a light wash (MUI's area chart). */
  area?: boolean;
  /** Smooth curves instead of straight segments. */
  curved?: boolean;
};

function linePath(pts: Array<[number, number]>, curved?: boolean) {
  if (!curved || pts.length < 3) return pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join("");
  // monotone-ish cubic: control points at 1/3 of the horizontal distance
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], dx = (x1 - x0) / 3;
    d += `C${x0 + dx},${y0} ${x1 - dx},${y1} ${x1},${y1}`;
  }
  return d;
}

/** Change over time (MUI X's LineChart). Hover anywhere for a crosshair with every series' value. */
export function LineChart({ labels, series: all, title, subtitle, height = 260, valueFormat = defaultFmt, area, curved, description, className }: LineChartProps) {
  const series = all.slice(0, MAX_SERIES);
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const values = series.flatMap((s) => s.data);
  const { min, max, ticks } = niceScale(Math.min(0, ...values), Math.max(...values, 0));
  const top = 12, bottom = height - 28, left = marginLeft(ticks, valueFormat), right = width - 12;
  const y = (v: number) => bottom - ((v - min) / (max - min)) * (bottom - top);
  const step = (right - left) / Math.max(labels.length - 1, 1);
  const xAt = (i: number) => left + i * step;
  const base = y(Math.max(0, min));

  return (
    <ChartFrame title={title} subtitle={subtitle} description={description} className={className}
      legend={series.map((s, i) => ({ name: s.name, color: color(i) }))} table={tableOf(labels, series, valueFormat)}>
      <div
        ref={ref}
        className="sh-chart__canvas"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const i = Math.round((e.clientX - r.left - left) / step);
          setHover(i >= 0 && i < labels.length ? i : null);
        }}
        onMouseLeave={() => setHover(null)}
      >
        <svg width={width} height={height}>
          {width > 80 && <>
          <Axes ticks={ticks} y={y} left={left} right={right} labels={labels} xAt={xAt} bottom={bottom} fmt={valueFormat} every={labelEvery(labels, right - left)} />
          {hover !== null && <line x1={xAt(hover)} x2={xAt(hover)} y1={top} y2={bottom} className="sh-chart__crosshair" />}
          {series.map((s, j) => {
            const pts = s.data.map((v, i) => [xAt(i), y(v)] as [number, number]);
            const d = linePath(pts, curved);
            return (
              <g key={j}>
                {area && pts.length > 1 && <path d={`${d}L${pts[pts.length - 1][0]},${base}L${pts[0][0]},${base}Z`} fill={color(j)} opacity={0.1} />}
                <path d={d} fill="none" stroke={color(j)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {pts.length > 0 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={color(j)} className="sh-chart__dot" />}
                {hover !== null && pts[hover] && <circle cx={pts[hover][0]} cy={pts[hover][1]} r={5} fill={color(j)} className="sh-chart__dot" />}
              </g>
            );
          })}
          </>}
        </svg>
        {hover !== null && (
          <Tooltip x={xAt(hover)} y={top} width={width}>
            <TipRows title={labels[hover]} rows={series.map((s, i) => ({ name: s.name, color: color(i), value: valueFormat(s.data[hover] ?? 0) }))} />
          </Tooltip>
        )}
      </div>
    </ChartFrame>
  );
}

export type ScatterSeries = { name: string; data: Array<{ x: number; y: number; label?: string }> };
export type ScatterChartProps = {
  /** Keep it to 3 series or fewer: past that, colors get hard to tell apart when points mix. */
  series: ScatterSeries[];
  xLabel?: string;
  yLabel?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  height?: number;
  xFormat?: Fmt;
  yFormat?: Fmt;
  description?: string;
  className?: string;
};

/** Relationship between two measures (MUI X's ScatterChart). */
export function ScatterChart({ series: all, xLabel = "x", yLabel = "y", title, subtitle, height = 280, xFormat = defaultFmt, yFormat = defaultFmt, description, className }: ScatterChartProps) {
  const series = all.slice(0, 3);
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<[number, number] | null>(null);
  const xs = series.flatMap((s) => s.data.map((p) => p.x));
  const ys = series.flatMap((s) => s.data.map((p) => p.y));
  const sx = niceScale(Math.min(...xs, 0), Math.max(...xs, 1));
  const sy = niceScale(Math.min(...ys, 0), Math.max(...ys, 1));
  const top = 12, bottom = height - 40, left = marginLeft(sy.ticks, yFormat), right = width - 12;
  const x = (v: number) => left + ((v - sx.min) / (sx.max - sx.min)) * (right - left);
  const y = (v: number) => bottom - ((v - sy.min) / (sy.max - sy.min)) * (bottom - top);
  const hp = hover && series[hover[0]].data[hover[1]];
  return (
    <ChartFrame title={title} subtitle={subtitle} description={description} className={className}
      legend={series.map((s, i) => ({ name: s.name, color: color(i) }))}
      table={{ head: ["Series", xLabel, yLabel], rows: series.flatMap((s) => s.data.map((p) => [p.label ? `${s.name}: ${p.label}` : s.name, xFormat(p.x), yFormat(p.y)])) }}>
      <div ref={ref} className="sh-chart__canvas" onMouseLeave={() => setHover(null)}>
        <svg width={width} height={height}>
          {width > 80 && <>
          <g className="sh-chart__axes">
            {sy.ticks.map((t) => (
              <g key={t}><line x1={left} x2={right} y1={y(t)} y2={y(t)} className={t === 0 ? "sh-chart__baseline" : "sh-chart__grid"} /><text x={left - 8} y={y(t)} dy="0.32em" textAnchor="end">{yFormat(t)}</text></g>
            ))}
            {sx.ticks.map((t) => <text key={t} x={x(t)} y={bottom + 18} textAnchor="middle">{xFormat(t)}</text>)}
            <text x={(left + right) / 2} y={height - 4} textAnchor="middle" className="sh-chart__axis-title">{xLabel}</text>
          </g>
          {series.map((s, j) => s.data.map((p, i) => (
            <circle key={`${j}-${i}`} cx={x(p.x)} cy={y(p.y)} r={hover?.[0] === j && hover[1] === i ? 6 : 4} fill={color(j)} className="sh-chart__dot"
              onMouseEnter={() => setHover([j, i])} />
          )))}
          </>}
        </svg>
        {hp && hover && (
          <Tooltip x={x(hp.x)} y={y(hp.y) - 10} width={width}>
            <TipRows title={hp.label ?? series[hover[0]].name} rows={[
              { name: xLabel, color: color(hover[0]), value: xFormat(hp.x) },
              { name: yLabel, color: color(hover[0]), value: yFormat(hp.y) },
            ]} />
          </Tooltip>
        )}
      </div>
    </ChartFrame>
  );
}

export type PieSlice = { label: string; value: number };
export type PieChartProps = {
  /** Up to 8 slices; anything past the 7 largest is grouped into "Other". */
  data: PieSlice[];
  /** Hole in the middle (0 = pie). */
  donut?: boolean;
  /** Text in the hole, e.g. the total. */
  centerLabel?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  size?: number;
  valueFormat?: Fmt;
  description?: string;
  className?: string;
};

/** Parts of a whole (MUI X's PieChart). Best with 2 to 5 slices. */
export function PieChart({ data, donut = true, centerLabel, title, subtitle, size = 200, valueFormat = defaultFmt, description, className }: PieChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const slices = sorted.length > MAX_SERIES
    ? [...sorted.slice(0, MAX_SERIES - 1), { label: "Other", value: sorted.slice(MAX_SERIES - 1).reduce((s, d) => s + d.value, 0) }]
    : sorted;
  const colors = slices.map((s, i) => (s.label === "Other" && sorted.length > MAX_SERIES ? OTHER : color(i)));
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2, inner = donut ? r * 0.62 : 0;
  const pct = (v: number) => `${Math.round((v / total) * 100)}%`;
  let a0 = -Math.PI / 2;
  const arcs = slices.map((s) => {
    const a1 = a0 + (s.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (rad: number, a: number) => `${r + rad * Math.cos(a)},${r + rad * Math.sin(a)}`;
    const full = s.value / total > 0.9999;
    const d = full
      ? `M${p(r, 0)}A${r},${r} 0 1 1 ${p(r, Math.PI)}A${r},${r} 0 1 1 ${p(r, 0)}` + (inner ? `M${p(inner, 0)}A${inner},${inner} 0 1 0 ${p(inner, Math.PI)}A${inner},${inner} 0 1 0 ${p(inner, 0)}` : "") + "Z"
      : inner
        ? `M${p(r, a0)}A${r},${r} 0 ${large} 1 ${p(r, a1)}L${p(inner, a1)}A${inner},${inner} 0 ${large} 0 ${p(inner, a0)}Z`
        : `M${r},${r}L${p(r, a0)}A${r},${r} 0 ${large} 1 ${p(r, a1)}Z`;
    const mid = (a0 + a1) / 2;
    a0 = a1;
    return { d, mid };
  });
  return (
    <ChartFrame title={title} subtitle={subtitle} description={description} className={cn("sh-chart--pie", className)}
      table={{ head: ["", "Value", "Share"], rows: slices.map((s) => [s.label, valueFormat(s.value), pct(s.value)]) }}>
      <div className="sh-pie">
        <div className="sh-pie__canvas" style={{ width: size, height: size }} onMouseLeave={() => setHover(null)}>
          <svg width={size} height={size} fillRule="evenodd">
            {arcs.map((a, i) => (
              <path key={i} d={a.d} fill={colors[i]} className={cn("sh-pie__slice", hover !== null && hover !== i && "sh-pie__slice--dim")} onMouseEnter={() => setHover(i)} />
            ))}
          </svg>
          {donut && (
            <div className="sh-pie__center">
              {hover !== null ? <><b>{pct(slices[hover].value)}</b><span>{slices[hover].label}</span></> : centerLabel}
            </div>
          )}
          {!donut && hover !== null && (
            <Tooltip x={r + Math.cos(arcs[hover].mid) * r * 0.6} y={r + Math.sin(arcs[hover].mid) * r * 0.6} width={size + 160}>
              <TipRows title={slices[hover].label} rows={[{ name: pct(slices[hover].value), color: colors[hover], value: valueFormat(slices[hover].value) }]} />
            </Tooltip>
          )}
        </div>
        <ul className="sh-chart__legend sh-chart__legend--column">
          {slices.map((s, i) => (
            <li key={s.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <span className="sh-chart__swatch" style={{ background: colors[i] }} />
              {s.label}
              <span className="sh-chart__legend-value">{valueFormat(s.value)} · {pct(s.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  );
}

export type SparklineProps = {
  data: number[];
  /** Accessible summary, e.g. "Visits, last 14 days, up 12%". */
  label: string;
  width?: number;
  height?: number;
  area?: boolean;
  className?: string;
};

/** Tiny trend line with no axes, for tables and stat tiles (MUI X's SparkLineChart). */
export function Sparkline({ data, label, width = 120, height = 32, area = true, className }: SparklineProps) {
  if (data.length < 2) return null;
  const lo = Math.min(...data), hi = Math.max(...data);
  const pad = 4;
  const x = (i: number) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v: number) => height - pad - ((v - lo) / (hi - lo || 1)) * (height - pad * 2);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  return (
    <svg className={cn("sh-sparkline", className)} width={width} height={height} role="img" aria-label={label}>
      {area && <path d={`${d}L${x(data.length - 1)},${height}L${x(0)},${height}Z`} fill="var(--chart-1)" opacity={0.1} />}
      <path d={d} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r={3} fill="var(--chart-1)" className="sh-chart__dot" />
    </svg>
  );
}

export type GaugeProps = {
  value: number;
  max?: number;
  /** Text under the number, e.g. "of monthly goal". */
  label?: ReactNode;
  /** Text in the middle; defaults to the percentage. */
  valueText?: ReactNode;
  size?: number;
  className?: string;
};

/** One number against a goal, as a half ring (MUI X's Gauge). */
export function Gauge({ value, max = 100, label, valueText, size = 180, className }: GaugeProps) {
  const pct = Math.min(1, Math.max(0, value / max));
  const sw = size * 0.09, r = (size - sw) / 2, cx = size / 2, cy = size / 2;
  const arc = (to: number) => {
    const a = Math.PI + to * Math.PI;
    return `M${cx - r},${cy}A${r},${r} 0 0 1 ${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  };
  return (
    <div className={cn("sh-gauge", className)} style={{ width: size }} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
      aria-label={typeof label === "string" ? label : undefined}>
      <svg width={size} height={size / 2 + sw / 2} aria-hidden="true">
        <path d={arc(1)} fill="none" stroke="var(--line)" strokeWidth={sw} strokeLinecap="round" />
        {pct > 0 && <path d={arc(pct)} fill="none" stroke="var(--primary)" strokeWidth={sw} strokeLinecap="round" />}
      </svg>
      <div className="sh-gauge__text">
        <b>{valueText ?? `${Math.round(pct * 100)}%`}</b>
        {label && <span>{label}</span>}
      </div>
    </div>
  );
}
