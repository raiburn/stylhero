# Button

Triggers an action; one `primary` button per view, everything else `secondary` or `ghost`.

```html
<button class="sh-btn sh-btn--primary">Add stamp</button>
<button class="sh-btn sh-btn--secondary sh-btn--sm">Edit</button>
```

React: `<Button variant="primary" size="md">Add stamp</Button>` from `@stylhero/ui`.

- **Variants:** `primary` (main action), `secondary` (other actions), `ghost` (low-emphasis, like Cancel), `danger` (destructive; ask for confirmation in the page).
- **Sizes:** default 40px tall; `sh-btn--sm` is 32px for tables and toolbars.
- Label with a verb that says what happens. Show progress by disabling and changing the label ("Saving…").
- Icons: put a Lucide icon inside the button (`<Plus />` from `lucide-react`); it is sized to 18px automatically. Icon-only buttons need `aria-label`.
- Focus ring uses `primary`; don't remove it.
