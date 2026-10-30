# Chip

A compact pill for filters, tags and picked values.

```html
<span class="sh-chip sh-chip--selected"><button class="sh-chip__main" aria-pressed="true">Active only</button></span>
<span class="sh-chip"><span class="sh-chip__main">Coffee</span><button class="sh-chip__remove" aria-label="Remove Coffee">×</button></span>
```

React: `<Chip selected={on} onClick={toggle}>Active only</Chip>`, `<Chip onRemove={…}>Coffee</Chip>`.

- Filter chips show a check when selected.
- Not for status: that is Badge.
