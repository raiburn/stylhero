# ImageList

A grid of photos: products, a gallery, rewards (MUI ImageList).

```tsx
<ImageList variant="quilted" columns={3} rowHeight={120}
  items={[{ src, alt: "Latte", title: "Latte", cols: 2, rows: 2 }, { src, alt: "Pan" }]} />
```

Variants:
- `standard`: equal tiles
- `quilted`: each item sets its own `cols` and `rows`
- `masonry`: each image keeps its natural height

`titlePosition="below"` moves the title bar under the image.

Always write a real `alt`.
