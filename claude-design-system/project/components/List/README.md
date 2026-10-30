# List

A bordered list of rows: leading Avatar or icon, title and description, trailing Badge, value or IconButton.

React:
```tsx
<List>
  <ListItem leading={<Avatar name="Ana Ruiz" size="sm" />} title="Ana Ruiz" description="8 stamps" trailing={<Badge tone="accent">Reward</Badge>} href="/customers/ana" />
</List>
```

With `href` or `onClick` the whole row is clickable. Titles and descriptions truncate with an ellipsis. For many columns use Table.
