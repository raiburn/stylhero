# IconButton

A square button with one Lucide icon: 40px (32px small).

```html
<button class="sh-icon-btn sh-icon-btn--secondary" aria-label="More actions"><i data-lucide="ellipsis"></i></button>
```

React: `<IconButton label="More actions" variant="secondary"><Ellipsis /></IconButton>`; `label` is required and becomes the aria-label.

- Ghost (default) in toolbars and app bars; secondary when it needs an edge; primary only for the single main action.
- Pair with Tooltip when the icon alone may be unclear.
