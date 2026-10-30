# TreeView

Nested, collapsible list (MUI X Tree View): regions → branches → stores, folders, categories.

```tsx
<TreeView label="Branches" defaultExpanded={["son"]} onSelect={(id) => ...}
  items={[{ id: "son", label: "Sonora", children: [{ id: "hmo", label: "Hermosillo" }] }]} />
```

Keyboard:
- Up and Down move between rows.
- Right expands a row, or moves into it if it is already open.
- Left collapses a row, or goes to its parent.
- Home and End jump to the first and last rows.
- Enter and Space select.
- `*` expands all siblings.

An item can have an `icon` and can be `disabled`.
