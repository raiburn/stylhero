# Popover

A small floating panel for quick forms, filters and details. Click to open; Esc or an outside click closes; focus moves inside.

React: `<Popover trigger={<Button>Add note</Button>} title="Quick note">…</Popover>`.

```html
<div class="sh-popover"><h3 class="sh-popover__title">Quick note</h3>…</div>
```

Max 320px wide. Anything bigger or anything that needs a decision belongs in a Dialog or Drawer.
