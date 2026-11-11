---
"@stylhero/ui": minor
---

Fixes and additions from adopting Stylhero in a real Next.js 14 / React 18 / Tailwind v3 app (BuildMyRig):

- New `line-strong` color token for control borders (text inputs, selects, slider tracks), at least 3:1 against every surface in both themes (WCAG 1.4.11). `line` stays for dividers. The token build now checks these pairs.
- Tailwind v3 support: `@stylhero/ui/tailwind-preset` (generated from tokens.json) plus setup docs. `@stylhero/ui/styles/*` is exported too.
- `Button` takes `href` and renders a link styled as a button, through `LinkProvider`; `http(s)` links open in a new tab.
- `IconButton` with an internal `href` now goes through `LinkProvider` (client-side navigation) instead of a plain `<a>`.
- `LinkProvider` accepts any component (`ElementType`), so `next/link` typechecks with `@types/react` 18.
- `Badge` has a `warning` tone.
- `Card` takes `titleAs` to set the title's heading level (default `h3`).
- `ToastProvider` takes `position`, and `toast()` shows a toast from outside components.
- New `ChoiceCard`: a radio or checkbox drawn as a selectable card.
