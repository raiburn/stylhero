# RadioGroup, CheckboxGroup and FieldSet

Related choices under one label (MUI RadioGroup, FormGroup and FormControl).

```tsx
<RadioGroup legend="Reward" row defaultValue="coffee" options={[{ value: "coffee", label: "Free coffee" }, "Pastry"]} />
<CheckboxGroup legend="Notify by" selectAll="All channels" options={["SMS", "Email", "WhatsApp"]} />
<FieldSet legend="Hours" hint="Local time">...any controls...</FieldSet>
```

- `selectAll` adds a parent checkbox that shows a dash (mixed) when some, but not all, options are checked.
- `Checkbox` also accepts `indeterminate` on its own.
