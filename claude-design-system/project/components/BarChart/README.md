# BarChart

Compare amounts across categories (MUI X BarChart).

```tsx
<BarChart title="Visits by day" labels={["Mon","Tue","Wed"]}
  series={[{ name: "New", data: [12, 18, 9] }, { name: "Returning", data: [40, 35, 44] }]} />
```

- `stacked` stacks the series. Up to 8 series; colors are `chart-1` … `chart-8` in order, never cycled.
- Bars are at most 24px thick, round at the top, square at the baseline, and 2px apart.
- Hover a column for a tooltip with every series. A legend appears for 2+ series. "Show as table" swaps in the data table.
- `valueFormat={(n) => "$" + n}` formats the axis and tooltip.
