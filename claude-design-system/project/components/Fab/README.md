# Fab and SpeedDial

- **Fab**: the one main action on a screen. Round with an icon (`label` becomes its aria-label), or `extended` to show the label. Tones: primary, accent, surface. `fixed` pins it to the bottom-right corner, clear of the iPhone home bar.
- **SpeedDial**: a Fab that fans out 2 to 5 related actions, each with a visible label. Esc closes it and puts focus back on the main button.

```tsx
<Fab label="New customer" extended fixed><Plus /></Fab>
<SpeedDial label="Quick actions" fixed actions={[{ label: "Schedule", icon: <Calendar />, onClick: ... }]} />
```

Only use one Fab per screen.
