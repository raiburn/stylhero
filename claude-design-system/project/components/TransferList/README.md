# TransferList

Move items between two lists (MUI Transfer List), e.g. which products earn stamps.

```tsx
<TransferList titles={["Products", "Earn stamps"]} value={chosen} onValueChange={setChosen}
  items={[{ value: "latte", label: "Latte" }, { value: "tea", label: "Tea" }]} />
```

Each list has a select-all checkbox, which shows a mixed state when only some items are checked. On phones the two lists stack.
