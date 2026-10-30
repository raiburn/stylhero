# Timeline

Events in order, such as a customer's visits or an order's history (MUI Lab Timeline).

```tsx
<Timeline events={[
  { title: "Reward redeemed", description: "Free coffee", time: "Today 9:41", tone: "accent", icon: <Star /> },
  { title: "Stamp added", time: "Yesterday" },
]} />
```

- Tones: neutral, primary (default), success, accent, danger.
- `layout="alternate"` puts events on both sides of the line on wide screens. Phones always get one column.
