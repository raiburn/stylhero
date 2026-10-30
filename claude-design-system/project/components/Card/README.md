# Card

A raised container that groups one item's content: a customer, a reward, a summary.

```html
<div class="sh-card">
  <h3 class="sh-card__title">Free coffee</h3>
  <p class="sh-card__body">Unlocked at 10 stamps.</p>
</div>
```

React: `<Card title="Free coffee">…</Card>` from `@stylhero/ui`.

- `space-6` padding, `space-3` gap between children, `radius-lg` corners, `shadow-card`.
- Lay cards out in a grid with `space-8` (or `space-6`) gaps; give cards in a row the same structure.
- Don't nest cards. Inside a card, separate with `line` dividers or spacing.
