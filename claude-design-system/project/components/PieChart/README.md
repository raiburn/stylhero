# PieChart

Parts of a whole (MUI X PieChart). It is a donut by default (`donut={false}` for a full pie). Slices are sorted largest first, and anything past 7 slices folds into "Other".

```tsx
<PieChart centerLabel={<><b>352</b><span>total</span></>}
  data={[{ label: "Coffee", value: 180 }, { label: "Pastry", value: 92 }]} />
```

The legend lists each slice's value and share. Hovering a slice or legend row dims the others and shows its share in the middle. It works best with 2 to 5 slices. For more, use a BarChart.
