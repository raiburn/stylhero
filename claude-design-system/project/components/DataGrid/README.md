# DataGrid

Table with sorting, search, checkbox selection, pagination, column hiding and CSV export (MUI X DataGrid).

```tsx
<DataGrid
  rows={customers}
  columns={[
    { field: "name", header: "Name" },
    { field: "stamps", header: "Stamps", numeric: true },
    { field: "spent", header: "Spent", numeric: true, format: (v) => `$${v}` },
    { field: "status", header: "Status", render: (r) => <Badge tone="success">{r.status}</Badge> },
  ]}
  search checkboxSelection columnsButton exportFileName="customers" pageSize={10}
/>
```

- Click a header to sort; click again to reverse; a third click clears.
- `numeric` right-aligns with tabular figures. `render` customizes the cell, but search and sort still use the raw value.
- `density`: compact, standard, comfortable. `maxHeight` gives a scrolling body with a sticky header.
- For a plain static table use **Table**.
