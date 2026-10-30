# ToggleGroup

A segmented control: the pressed item lifts onto `surface-raised`.

```html
<div class="sh-toggle-group" role="group" aria-label="View">
  <button class="sh-toggle-group__item" aria-pressed="true">List</button>
  <button class="sh-toggle-group__item" aria-pressed="false">Grid</button>
</div>
```

React: `<ToggleGroup label="View" options={[{ value: "list", label: "List" }, …]} onValueChange={…} />`; add `multiple` for independent toggles.

Use for 2–4 short options that switch a view. For form answers use Radio.
