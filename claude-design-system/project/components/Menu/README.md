# Menu

A dropdown of actions, usually behind a "more" IconButton. Arrow keys, Home/End, type-to-jump and Esc work.

React:
```tsx
<Menu
  trigger={<IconButton label="More actions"><Ellipsis /></IconButton>}
  items={[{ label: "Edit", icon: <Pencil />, onSelect: edit }, "separator", { label: "Delete", danger: true, onSelect: del }]}
/>
```

Items can have `href`, `shortcut`, `disabled`. Put destructive items last, after a separator, with `danger`.
