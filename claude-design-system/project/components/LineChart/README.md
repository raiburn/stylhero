# LineChart

Change over time (MUI X LineChart). `area` adds a 10% wash under each line; `curved` smooths the lines.

```tsx
<LineChart title="Stamps this year" area labels={months}
  series={[{ name: "Hermosillo", data: [...] }, { name: "Nogales", data: [...] }]} />
```

- Lines are 2px, with an end dot that has a 2px surface ring. Hovering shows a crosshair and every series' value.
- Only one y-axis, ever. For two measures with different scales, use two charts.
