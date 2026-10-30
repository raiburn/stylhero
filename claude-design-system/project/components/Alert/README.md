# Alert

An inline message that tells people about something on the current page, in four tones.

```html
<div class="sh-alert sh-alert--warning" role="alert">
  <svg>…triangle-alert…</svg>
  <div><strong class="sh-alert__title">Card expires in 3 days</strong>Remind the customer.</div>
</div>
```

React: `<Alert tone="warning" title="Card expires in 3 days">Remind the customer.</Alert>` from `@stylhero/ui`; it adds the matching Lucide icon and role.

- **Tones:** `info` (sky-soft), `success`, `warning` (lemon accent-soft), `danger`.
- Say what happened and what to do next. Keep the title to a few words.
- For short-lived confirmations after an action, use Toast instead.
