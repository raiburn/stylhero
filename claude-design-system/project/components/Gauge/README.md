# Gauge and Sparkline

- **Gauge**: one number against a goal, as a half ring (MUI X Gauge). `<Gauge value={68} label="of 500 visits" />`. It shows the percentage by default; pass `valueText` to change it.
- **Sparkline**: a tiny trend line with no axes, for stat tiles and table cells (MUI X SparkLineChart). `<Sparkline data={[3,5,4,8]} label="Visits, last 10 days, up" />`. The `label` is required; it is what screen readers hear.
