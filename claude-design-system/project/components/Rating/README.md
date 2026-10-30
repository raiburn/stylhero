# Rating

Stars filled with `accent` and outlined with `accent-ink`; empty stars are `ink-muted` outlines.

React: `<Rating label="Rate your visit" onValueChange={…} />` (a radio group, so arrow keys work) or `<Rating value={4} readOnly />`.

```html
<span class="sh-rating" role="img" aria-label="4 out of 5">
  <span class="sh-rating__star sh-rating__star--on">★ svg</span> …
</span>
```

Read-only ratings always need the number nearby or in the aria-label.
