# BottomNav

Phone tab bar for 3 to 5 top-level destinations (MUI BottomNavigation).

```tsx
<BottomNav fixed items={[
  { label: "Home", icon: <Home />, href: "/", active: true },
  { label: "Rewards", icon: <Gift />, href: "/rewards", badge: 2 },
]} />
```

- `compact` shows the label only on the active item.
- `fixed` pins it to the bottom of the screen and pads for the iPhone home bar. Add bottom padding to the page so content isn't hidden behind it.
- Links render through LinkProvider (next/link).
