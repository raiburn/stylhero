# Layout: Container, Stack, Grid

Three layout primitives that read spacing from the tokens.

- **Container**: centered page column with a 16px gutter. Sizes sm 640, md 768, lg 1024 (default), xl 1280. Class `sh-container sh-container--lg`.
- **Stack**: flex column (or row) with a token gap. `<Stack gap={6}>` = 24px. Steps: 1 2 3 4 6 8 12.
- **Grid**: `<Grid minChildWidth={240}>` fits as many columns as possible and wraps on phones; `columns={3}` for a fixed count.

```html
<div class="sh-container sh-container--lg">
  <div class="sh-stack" style="flex-direction:column;gap:var(--space-8)">…</div>
  <div class="sh-grid" style="grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr));gap:var(--space-6)">…</div>
</div>
```

Lay out siblings with these (or flex/grid gap), never margins.
