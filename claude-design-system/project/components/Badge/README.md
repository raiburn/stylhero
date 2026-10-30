# Badge

A short uppercase tag that shows status or category at a glance.

```html
<span class="sh-badge sh-badge--success">Active</span>
```

React: `<Badge tone="success">Active</Badge>` from `@stylhero/ui`.

- **Tones:** `neutral` (default, drafts and counts), `primary` (brand tags), `info` (news, tips), `accent` (rewards and milestones), `success`, `danger`.
- One or two words. Badges are not buttons; don't make them clickable.
- Tone backgrounds use the `-soft` tokens, so text stays readable in both themes.
- An optional 12px Lucide icon can go before the text.
