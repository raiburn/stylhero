# Stylhero style library

One set of styles, used in two places:

| Folder | What it is |
| --- | --- |
| `tokens.json` | **Source of truth**: colors (light + dark), fonts, type sizes, spacing, radii, shadow. |
| `ui/` | `@stylhero/ui`, an npm package for Next.js: `tokens.css`, `components.css`, `tailwind.css`, an optional `base.css` and 80+ React components covering Material UI, MUI Lab and the free MUI X packages (list below). |
| `ui/playground/` | Every component on one page, plus an automated test that clicks through them. |
| `claude-design-system/` | The same system as a Claude design system: https://claude.ai/artifact/KfcuDkGt29XNKmJTEtEamb |
| `brand/logo/` | Wordmark (light + reverse) and app icon, as outlined SVGs. Also shipped in the package as `@stylhero/ui/logo/*`. |

**Look:** Ocean palette (navy `#173a7a`, sky `#3ba3e6`, lemon `#f5d23d`) · Plus Jakarta Sans · Lucide icons.

## Use it in a Next.js app

1. Build the package once:
   ```bash
   cd ui
   npm install
   npm run build
   ```
2. In your app, install it from the folder (or publish it to npm later):
   ```bash
   npm install ../path/to/stylhero/ui
   ```
3. In `app/globals.css`:
   ```css
   /* with Tailwind v4 */
   @import "tailwindcss";
   @import "@stylhero/ui/tailwind.css";
   @import "@stylhero/ui/components.css";

   /* without Tailwind */
   @import "@stylhero/ui/tokens.css";
   @import "@stylhero/ui/components.css";

   /* optional page defaults (MUI's CssBaseline): body background, font, focus ring */
   @import "@stylhero/ui/base.css";
   ```
4. Load the fonts in `app/layout.tsx`:
   ```tsx
   import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
   const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--next-font-sans" });
   const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--next-font-mono" });

   <html className={`${sans.variable} ${mono.variable}`}>
   ```
5. Use it:
   ```tsx
   import { Button, Card, Badge, Input } from "@stylhero/ui";

   <Card title="Free coffee">
     <Badge tone="accent">Reward ready</Badge>
     <Button>Add stamp</Button>
   </Card>
   ```
   With Tailwind you also get `bg-primary`, `text-ink`, `text-ink-muted`, `border-line`, `bg-surface-raised`, `font-display`, `shadow-card`, and so on.

### Icons (Lucide)
```bash
npm install lucide-react
```
```tsx
import { Plus } from "lucide-react";
<Button><Plus />Add stamp</Button>          {/* auto-sized to 18px in buttons */}
<Plus className="sh-icon" />                 {/* 20px, 1.75 stroke elsewhere */}
```

### Logo
Copy `node_modules/@stylhero/ui/logo/*.svg` (or `brand/logo/`) into your app's `public/` folder:
```tsx
<img src="/stylhero-wordmark.svg" alt="stylhero" height={32} />          {/* light backgrounds */}
<img src="/stylhero-wordmark-reverse.svg" alt="stylhero" height={32} />  {/* navy/dark backgrounds */}
```
Use `stylhero-mark.svg` as the favicon (`app/icon.svg` in Next.js).

Dark mode follows the OS. Force a theme with `<html data-theme="dark">` or `data-theme="light"`.

### Components

| Group | Components | MUI equivalent |
| --- | --- | --- |
| Layout | Container, Stack, Grid, Box, Paper, Divider, ImageList, Masonry | Container, Stack, Grid, Box, Paper, Divider, ImageList, Lab Masonry |
| Type | Text, Link | Typography, Link |
| Actions | Button (`loading`, `size="lg"`, `fullWidth`), IconButton, ButtonGroup, Fab, SpeedDial | Button, LoadingButton, IconButton, ButtonGroup, Fab, SpeedDial |
| Forms | Input (`start`/`end` adornments), Textarea (`autoResize`), Select, Combobox (`multiple`), NumberInput, Checkbox (`indeterminate`), Radio, RadioGroup, CheckboxGroup, FieldSet, Switch, Slider, Rating, ToggleGroup, Chip, TransferList | TextField, InputAdornment, TextareaAutosize, Select, Autocomplete, NumberInput, Checkbox, Radio, RadioGroup, FormGroup/FormControl, Switch, Slider, Rating, ToggleButtonGroup, Chip, Transfer List |
| Dates | Calendar, DatePicker, DateRangePicker, TimePicker, DateTimePicker | MUI X DateCalendar, DatePicker, DateRangePicker (Pro), TimePicker, DateTimePicker |
| Overlays | Dialog, Drawer, Modal, Backdrop, Popover, Menu, Tooltip, Toast (`useToast`), Snackbar | Dialog, Drawer, Modal, Backdrop, Popover/Popper, Menu, Tooltip, Snackbar |
| Navigation | AppBar, SideNav, BottomNav, Tabs (`vertical`, `pills`), Breadcrumbs, Pagination, Stepper (clickable, error), MobileStepper | AppBar, Drawer nav, BottomNavigation, Tabs, Breadcrumbs, Pagination, Stepper, MobileStepper |
| Data display | Card (`media`, `action`, `footer`), Badge, CountBadge, Avatar, AvatarGroup, Table, DataGrid, List (`subheader`, `selected`), ListItem, TreeView, Timeline, Stat, Accordion, EmptyState | Card, Chip, Badge, Avatar, AvatarGroup, Table, MUI X DataGrid, List, MUI X TreeView, Lab Timeline, Accordion |
| Charts | BarChart (grouped or `stacked`), LineChart (`area`, `curved`), ScatterChart, PieChart (donut), Sparkline, Gauge | MUI X Charts |
| Feedback | Alert (`onClose`, `action`, `outlined`/`filled`), Spinner, Progress, ProgressCircle, Skeleton | Alert, CircularProgress, LinearProgress, Skeleton |
| Motion & utilities | Transition, Fade, Grow, Zoom, Slide, Collapse, Portal, NoSsr, ClickAwayListener, `useClickAway`, `useMediaQuery`, `base.css` | Transitions, Portal, NoSsr, ClickAwayListener, useMediaQuery, CssBaseline |

Left out on purpose:
- `sx`, `styled()` and theme objects. Use `tokens.json`, Tailwind or the `sh-` classes instead.
- Material Icons. Use Lucide instead.
- DataGrid features that MUI X only sells in its paid Pro and Premium plans: row grouping, column pinning and Excel export.

**DataGrid** can:
- sort (click a header; click again to reverse)
- search every visible column
- select rows with checkboxes
- paginate
- hide columns
- export the filtered rows to CSV

```tsx
<DataGrid
  rows={customers}
  columns={[
    { field: "name", header: "Name" },
    { field: "stamps", header: "Stamps", numeric: true },
    { field: "spent", header: "Spent", numeric: true, format: (v) => `$${v}` },
    { field: "status", header: "Status", render: (r) => <Badge>{r.status}</Badge> },
  ]}
  search checkboxSelection columnsButton exportFileName="customers"
/>
```

**Dates** use plain `Date` objects (no date library) and `Intl` for month and day names. For Spanish with Monday first, pass `locale="es-MX"` and `weekStartsOn={1}`. To block days (e.g. closed on Sundays), use `isDateDisabled`.

**Charts** use the `chart-1` … `chart-8` colors from `tokens.json`, in that order.
- The colors were checked for color-blind separation in both themes.
- Every chart has hover tooltips and a "Show as table" button.
- Charts with 2 or more series also show a legend.
- Use 8 series at most; PieChart folds extra slices into "Other".
- Keep ScatterChart to 3 series.

Menu, Popover, Tooltip and Combobox use [floating-ui](https://floating-ui.com) (installed automatically) for positioning and keyboard support. Dialog, Drawer and Accordion use native `<dialog>` and `<details>`.

### Links with next/link
AppBar, SideNav, Breadcrumbs, List, Menu and Link render plain `<a>` tags by default. To use Next.js client-side navigation, wrap your app once:
```tsx
// app/providers.tsx
"use client";
import NextLink from "next/link";
import { LinkProvider, ToastProvider } from "@stylhero/ui";
export function Providers({ children }: { children: React.ReactNode }) {
  return <LinkProvider component={NextLink}><ToastProvider>{children}</ToastProvider></LinkProvider>;
}
```
Then use `<Providers>{children}</Providers>` in `app/layout.tsx`.

## Playground and tests

In `ui/`:
```bash
npm run playground   # builds and opens a page with every component (light/dark follows your OS)
npm test             # opens it in headless Chrome and checks 66 behaviors: menus, keyboard, dialogs, combobox, date pickers, data grid, tree view, charts...
```
`npm test` saves screenshots to `ui/playground/screenshots/`. Run it after changing components.

## Use it with Claude

Tell Claude: *"use my Stylhero design system"* (or paste the link above). Claude reads its README and tokens before making pages, slides or designs.

## Changing styles

`tokens.json` is the only file you edit for colors, fonts, spacing, radii and shadows.

1. Edit `tokens.json`.
2. In `ui/`, run:
   ```bash
   npm run tokens        # once
   npm run tokens:watch  # or: regenerate on every save
   ```
   This regenerates `ui/styles/tokens.css` and `ui/styles/tailwind.css` (don't edit those by hand), copies `tokens.json` into `claude-design-system/`, and **checks contrast**: if a text color drops below 4.5:1 on its background in either theme, it stops and tells you which pair failed. `npm run build` runs it automatically.
3. For component changes, edit `ui/styles/components.css`.
4. Ask Claude to "sync Stylhero to the design system" to republish the Claude version.

Adding a color: add it to `color.tokens` with a light and dark value. It becomes `var(--name)` in CSS and `bg-name` / `text-name` in Tailwind automatically. If it's a text/background pair, add it to `PAIRS` in `ui/scripts/build-tokens.mjs` so contrast is checked.

## License

[MIT](LICENSE) © 2026 Oscar Ruíz. Includes icons from [Lucide](https://lucide.dev) (ISC); see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
