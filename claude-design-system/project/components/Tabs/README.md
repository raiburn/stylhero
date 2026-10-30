# Tabs

Switches between a few views of the same thing without leaving the page.

React:
```tsx
<Tabs label="Customer" items={[
  { id: "overview", label: "Overview", content: <Overview /> },
  { id: "visits", label: "Visits", content: <Visits /> },
]} />
```

- Arrow keys move between tabs; Home/End jump to the ends. Controlled with `value` + `onValueChange`, or uncontrolled with `defaultValue`.
- 2–6 short, one- or two-word labels. Don't use tabs for steps in a sequence.
