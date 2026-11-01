# @stylhero/ui

[![npm](https://img.shields.io/npm/v/@stylhero/ui)](https://www.npmjs.com/package/@stylhero/ui) [![CI](https://github.com/raiburn/stylhero/actions/workflows/ci.yml/badge.svg)](https://github.com/raiburn/stylhero/actions/workflows/ci.yml) [![license](https://img.shields.io/npm/l/@stylhero/ui)](https://github.com/raiburn/stylhero/blob/main/LICENSE)

Stylhero design system for React: design tokens, a Tailwind v4 theme, plain CSS component styles and 80+ React components covering Material UI, MUI Lab and the free MUI X packages (date pickers, DataGrid, TreeView, charts).

**Look:** Ocean palette (navy `#173a7a`, sky `#3ba3e6`, lemon `#f5d23d`) · Plus Jakarta Sans · Lucide icons. Light and dark themes.

Full documentation, component list and playground: https://github.com/raiburn/stylhero

## Install

```bash
npm install @stylhero/ui
npm install lucide-react   # optional, for icons
```

Requires React 18 or newer.

## Import the CSS

Import the styles once, in your global stylesheet (`app/globals.css` in Next.js, `src/index.css` in Vite):

```css
/* with Tailwind v4 */
@import "tailwindcss";
@import "@stylhero/ui/tailwind.css";
@import "@stylhero/ui/components.css";

/* without Tailwind */
@import "@stylhero/ui/tokens.css";
@import "@stylhero/ui/components.css";

/* optional page defaults (like MUI's CssBaseline): body background, font, focus ring */
@import "@stylhero/ui/base.css";
```

Or from JavaScript: `import "@stylhero/ui/tokens.css"; import "@stylhero/ui/components.css";`

With Tailwind you also get `bg-primary`, `text-ink`, `text-ink-muted`, `border-line`, `bg-surface-raised`, `font-display`, `shadow-card`, and so on.

## Fonts

The package does not ship font files. The CSS asks for Plus Jakarta Sans and JetBrains Mono and falls back to system fonts.

**Next.js** (`app/layout.tsx`):

```tsx
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--next-font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--next-font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Other setups** (Vite, CRA, ...): load the fonts by name, e.g. in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet" />
```

or self-host them with `@fontsource/plus-jakarta-sans` and `@fontsource/jetbrains-mono`.

## Use it

```tsx
import { Button, Card, Badge, Text, DatePicker } from "@stylhero/ui";
import { Plus } from "lucide-react";

export function Rewards() {
  return (
    <Card title="Free coffee">
      <Badge tone="accent">Reward ready</Badge>
      <Text>Ten stamps and the next one is on us.</Text>
      <DatePicker label="Visit date" />
      <Button><Plus />Add stamp</Button>
    </Card>
  );
}
```

Each component is its own file, and only interactive ones are marked `"use client"`, so presentational components (Card, Badge, Text, Stack…) render as server components with no JavaScript. All of them can be imported from server components. Add `experimental: { optimizePackageImports: ["@stylhero/ui"] }` to `next.config.ts` so Next.js only loads the ones you import.

Components that render their own element also take that element's HTML attributes (`id`, `style`, `data-*`, `aria-*`, event handlers…) and put them on it, as `<Button>` does. Your `className` and `style` are added to the component's own, and handlers it uses internally (like Dialog's backdrop click) run alongside yours. Two kinds don't:
- Tooltip, Popover, Menu and the transitions wrap the element you pass them, so put attributes on that element.
- Combobox, NumberInput and the date and time pickers take `id`, `name`, `disabled` and `className`, which go to the form control and field.

### Links with next/link

AppBar, SideNav, Breadcrumbs, List, Menu and Link render plain `<a>` tags by default. For Next.js client-side navigation, wrap your app once:

```tsx
// app/providers.tsx
"use client";
import NextLink from "next/link";
import { LinkProvider, ToastProvider } from "@stylhero/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LinkProvider component={NextLink}>
      <ToastProvider>{children}</ToastProvider>
    </LinkProvider>
  );
}
```

Then use `<Providers>{children}</Providers>` in `app/layout.tsx`.

### Dark mode

Dark mode follows the OS. Force a theme with `<html data-theme="dark">` or `data-theme="light"`.

### Logo

The wordmark and app icon ship as SVGs in `@stylhero/ui/logo/` (`stylhero-wordmark.svg`, `stylhero-wordmark-reverse.svg`, `stylhero-mark.svg`). Copy them into your app's `public/` folder.

## Versions

Changes are listed in [CHANGELOG.md](https://github.com/raiburn/stylhero/blob/main/ui/CHANGELOG.md). While the version is 0.x, a minor version may contain breaking changes, always listed under **Changed** or **Removed**. Pin with `~0.5.0` to accept only patches.

## License

MIT. Third-party licenses are in `THIRD_PARTY_NOTICES.md`.
