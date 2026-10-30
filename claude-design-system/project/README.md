# Stylhero

Clear, confident interfaces: deep navy for trust, sky blue for clarity, a flash of lemon for the moments worth celebrating.

Stylhero is a personal style library. It is used for web apps built with Next.js and for pages Claude makes. The same tokens and component classes ship as the `@stylhero/ui` npm package (`tokens.css`, `components.css`, `tailwind.css` and React components), so anything built here matches the apps.

## Logo

The wordmark is lowercase **stylhero** in Plus Jakarta Sans ExtraBold, followed by a round dot. The letters are outlined paths, so the logo looks the same everywhere without the font installed.

| File | Use |
| --- | --- |
| `stylhero-wordmark.svg` | Default. Navy letters, sky dot, on light backgrounds. |
| `stylhero-wordmark-reverse.svg` | White letters, lemon dot, on navy or dark backgrounds. |
| `stylhero-mark.svg` | App icon and favicon: "s." on a navy rounded square. |

- Keep clear space around the logo equal to the dot's diameter × 2.
- Minimum width: 96px for the wordmark, 24px for the mark.
- Don't recolor, stretch, add effects or retype the logo in another font. The dot is always sky (on light) or lemon (on navy).

## Content fundamentals

- Write the way a helpful shop owner talks: short sentences, plain words, no jargon.
- Buttons say exactly what happens: "Save customer", "Add stamp", not "Submit" or "OK".
- Errors say what went wrong and how to fix it: "Enter a phone number with 10 digits."
- Use sentence case for headings and buttons. Use uppercase only in the `label` style (badges, eyebrows).
- Numbers that line up in columns use the `mono` style or `font-variant-numeric: tabular-nums`.

## Visual foundations

**Color.** Pages sit on `surface`. Content that floats on top (cards, inputs) uses `surface-raised` with a `line` border. `primary` navy marks the one main action per view, links and focus. In dark mode it turns bright blue so it stays readable. `sky` is the second brand blue, for illustration and the logo dot. It is never text on light backgrounds. `accent` lemon is for rewards, milestones and celebration, used in small doses. Never use it for text; on a lemon fill use `on-accent`, on `accent-soft` use `accent-ink`. `success` and `danger` mean states only, always with their `-soft` background for banners and badges.

**Type.** One family: Plus Jakarta Sans. Headlines (`display`, `h1`) use ExtraBold 800 with tight tracking. `h2` and `h3` use Bold 700. Body text is Regular 400 at 16px/24px. JetBrains Mono is for codes, IDs and figures. Keep running text near 65 characters wide.

**Space.** A 4px base: `space-2` inside controls, `space-6` inside cards, `space-8` between cards, `space-12` between sections. Lay out siblings with flex or grid `gap`, not margins.

**Shape.** `radius-md` for controls, `radius-lg` for cards, `radius-sm` for badges, `radius-full` for pills, avatars and the dot motif. Soft corners, never sharp, never bubbly.

**Depth.** Borders do most of the separating. `shadow-card` is only for cards that need to lift off the page.

**Themes.** Light and dark are equal. Every component reads tokens only, so it works in both without changes.

**Data visualization.** Charts use `chart-1` … `chart-8` in that order: blue, orange, aqua, yellow, magenta, green, violet, red. That order was checked for color-blind separation in both themes. Never cycle the colors, and never repaint a series when a filter removes another one: a series keeps its color. Past 8 series, group the rest into "Other". Keep scatter plots to 3 series. Use one y-axis only. Every chart needs:
- a legend when it has 2 or more series
- hover tooltips
- a table view

Text stays in `ink` or `ink-muted`, never in a series color. The `@stylhero/ui` charts (BarChart, LineChart, PieChart, ScatterChart, Sparkline, Gauge) already follow these rules.

## Iconography

Icons come from [Lucide](https://lucide.dev): `lucide-react` in apps, or the `lucide` script on plain pages.

- Default 20px with a 1.75 stroke (`sh-icon`); 16px (`sh-icon--sm`) in dense tables, 24px (`sh-icon--lg`) for empty states.
- Inside a button, icons are 18px with a 2px stroke. Put them before the label, or after it for "next" arrows.
- Icons take the text color: `ink-muted` at rest, `primary` when active or selected.
- An icon-only button needs an `aria-label`.
- Stay inside Lucide. Don't mix in filled icons or other sets.
