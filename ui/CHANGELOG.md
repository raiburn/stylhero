# Changelog

All notable changes to `@stylhero/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the version is 0.x, a minor release may contain breaking changes; they are
always listed under **Changed** or **Removed**.

New entries are generated with [Changesets](https://changesets.dev) (see
`.changeset/README.md`). Version headings are written without brackets
(`## 0.4.0 - 2026-10-30`) so `changeset version` inserts new releases right below
"Unreleased".

## Unreleased

## 0.5.0 - 2026-10-31

### Added

- Components that render their own element now accept that element's HTML attributes (`id`, `style`, `data-*`, `aria-*`, event handlers…) and pass them to it: Accordion, AppBar, Avatar, AvatarGroup, Backdrop, BottomNav, the charts (BarChart, LineChart, ScatterChart, PieChart, Sparkline, Gauge), Chip, CountBadge, DataGrid, Dialog, Divider, Drawer, EmptyState, FieldSet (and RadioGroup/CheckboxGroup), ImageList, ListItem, MobileStepper, Modal, Pagination, Progress, ProgressCircle, Rating, SideNav, Skeleton, SpeedDial, Spinner, Stat, Stepper, TableOfContents, Tabs, Timeline, TransferList and TreeView. Your `style` is merged with the component's own, and your `onClick`/`onCancel`/`onKeyDown`/`onMouseLeave` run alongside the internal handlers. Before, these attributes were rejected by TypeScript and dropped at runtime.

### Fixed

- `Calendar`, `DatePicker` and `DateRangePicker`: keyboard focus no longer gets lost when an arrow key or PageUp/PageDown moves to another month or onto a disabled day. Keyboard moves now skip disabled days, and the calendar opens on the nearest enabled day when today is disabled.

## 0.4.0 - 2026-10-30

### Added

- `TableOfContents`, `SkipLink` and `Spotlight` components.
- Icons exported from the package: `ArrowUpRight`, `ArrowLeft`, `Mail`, `GitHub`, `LinkedIn` (alongside the existing ones).
- `Link`: `tone="ink"`, `external` and `stretched` props.
- `Card`: `variant="ghost"`.
- `IconButton`: `href` (renders a link) and `size="lg"` (44px).
- `Stat`: `valueFirst` prop.
- `Text`: `lead` and `strong` variants.
- `Avatar`: `size="xl"` and custom image children.

### Changed

- **Breaking:** `components.css` is now wrapped in `@layer components` and `base.css` in `@layer base`. Tailwind utilities and unlayered app CSS now override Stylhero styles. If you relied on Stylhero winning over your own rules, raise the specificity or move those rules into a layer.
- **Breaking:** `Paper` no longer sets `padding: 0` by default. When the `padding` prop is unset, no inline padding is applied, so padding from your own classes takes effect.

## 0.3.0 - 2026-10-29

Full Material UI coverage (Material UI, MUI Lab and the free MUI X packages).

### Added

- `DataGrid`.
- Charts: `BarChart`, `LineChart`, `ScatterChart`, `PieChart`, `Sparkline`, `Gauge`, with new `chart-1` to `chart-8` color tokens.
- Date and time: `Calendar`, `DatePicker`, `DateRangePicker`, `TimePicker`, `DateTimePicker`.
- `TreeView`, `Timeline`, `TransferList`, `NumberInput`.
- Form grouping: `FieldSet`, `RadioGroup`, `CheckboxGroup`.
- `Fab`, `SpeedDial`, `BottomNav`, `MobileStepper`.
- `CountBadge`, `AvatarGroup`.
- `Snackbar`, `Backdrop`, `Modal`.
- Layout: `Paper`, `Box`, `ImageList`, `Masonry`.
- Transitions: `Transition`, `Fade`, `Grow`, `Zoom`, `Slide`, `Collapse`.
- Utilities: `Portal`, `NoSsr`, `ClickAwayListener`, `useMediaQuery`.
- `base.css`: optional page defaults (body background, font, focus ring), like MUI's CssBaseline.
- New props on existing components:
  - `Button`: `loading`, `size="lg"`, `fullWidth`.
  - `Input`: `start` and `end` adornments.
  - `Textarea`: `autoResize`.
  - `Checkbox`: `indeterminate`.
  - `Card`: `subtitle`, `action`, `media`, `footer`, `outlined`.
  - `Alert`: `action`, `onClose`, `variant`.
  - `Tabs`: `vertical`, `pills`, disabled tabs.
  - `Combobox`: `multiple`.
  - `List`: extended item options.

## 0.2.0 - 2026-10-29

### Added

- Layout and type: `Stack`, `Grid`, `Container`, `Divider`, `Text`, `Link`, `LinkProvider` (plug in `next/link` or any router link).
- Inputs: `IconButton`, `ButtonGroup`, `ToggleGroup`, `Chip`, `Slider`, `Rating`, `Combobox`.
- Overlays: `Tooltip`, `Popover`, `Menu`, `Drawer`.
- Navigation: `AppBar`, `SideNav`, `Breadcrumbs`, `Pagination`, `Stepper`.
- Display: `Accordion`, `List`, `Stat`, `Skeleton`, `Progress`.
- Playground page with every component, plus automated browser tests (`npm test`).

### Changed

- `@floating-ui/react` added as the package's only runtime dependency (used for positioning tooltips, popovers and menus).

## 0.1.0 - 2026-10-28

First release.

### Added

- Ocean palette design tokens in `tokens.json`, built into `tokens.css` and a Tailwind v4 theme by `scripts/build-tokens.mjs`, with a WCAG contrast check.
- Fonts: Plus Jakarta Sans (text and display) and JetBrains Mono (code).
- Core components: `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Alert`, `Spinner`, `Avatar`, `Table`, `Tabs`, `Dialog`, `Toast`, `EmptyState`.
