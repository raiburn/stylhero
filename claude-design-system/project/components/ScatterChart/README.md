# ScatterChart

Relationship between two measures (MUI X ScatterChart).

```tsx
<ScatterChart xLabel="Visits" yLabel="Avg. ticket" yFormat={(n) => "$" + n}
  series={[{ name: "Hermosillo", data: [{ x: 2, y: 60 }, { x: 5, y: 75 }] }]} />
```

Keep it to 3 series. With points mixed together, more colors can't be told apart reliably. Past 3, use small multiples instead.
