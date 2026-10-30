# Table

A bordered data table that scrolls sideways inside its own frame on narrow screens.

```html
<div class="sh-table-wrap"><table class="sh-table">…</table></div>
```

React: `<Table><thead>…</thead><tbody>…</tbody></Table>` from `@stylhero/ui`.

- Add `sh-num` to number cells and their header: right-aligned, tabular digits.
- Use badges for status columns and `sh-btn--sm` for row actions.
- Over ~50 rows, paginate or filter.
