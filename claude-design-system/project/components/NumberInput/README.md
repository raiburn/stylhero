# NumberInput

```tsx
<NumberInput label="Stamps to add" defaultValue={1} min={1} max={5} onValueChange={...} />
```

- Up and Down arrow keys step the value.
- Typed values are clamped to `min`/`max` on blur or Enter.
- The − and + buttons turn off at the limits.
