# @stylhero/native

Stylhero for React Native and Expo. Same `tokens.json` as [`@stylhero/ui`](../ui), so a web app and a mobile app built with Stylhero share colors, type, spacing, radii and shadows automatically.

Requires React 19 and React Native 0.78+. Card shadows use the `boxShadow` style, which needs the New Architecture (the default since RN 0.76 / Expo SDK 52).

## Use it

```bash
npm install ../path/to/stylhero/native
```

```tsx
import { ThemeProvider, Card, Badge, Button, Text } from "@stylhero/native";

export default function App() {
  return (
    <ThemeProvider>{/* follows the device light/dark setting */}
      <Card title="Budget 1440p build" subtitle="$1,500" action={<Badge tone="success">Compatible</Badge>}>
        <Text>8 parts, ~140 FPS in Cyberpunk 2077</Text>
        <Button onPress={save}>Save build</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Fonts

Without configuration the components use the system font. To use Plus Jakarta Sans, load it (e.g. with `@expo-google-fonts/plus-jakarta-sans`) and map token families + weights to the loaded names:

```tsx
const jakarta = { "400": "PlusJakartaSans_400Regular", "500": "PlusJakartaSans_500Medium",
  "600": "PlusJakartaSans_600SemiBold", "700": "PlusJakartaSans_700Bold", "800": "PlusJakartaSans_800ExtraBold" };

<ThemeProvider fonts={(family, weight) => (family === "mono" ? undefined : jakarta[weight])}>
```

Define the resolver outside the component (or memoize it) so the theme isn't rebuilt every render.

### Theme in your own components

```tsx
const theme = useTheme();
<View style={{ padding: theme.spacing[4], backgroundColor: theme.colors.surfaceRaised, borderRadius: theme.radius.lg }}>
  <RNText style={[theme.text("h3"), { color: theme.colors.ink }]}>…</RNText>
</View>
```

## Components

| Component | Notes |
| --- | --- |
| `ThemeProvider`, `useTheme` | `colorScheme="system" \| "light" \| "dark"`, optional `fonts` resolver |
| `Text` | Variants from tokens (`display`, `h1`–`h3`, `body`, `small`, `label`, `mono`, `strong`) and tones |
| `Stack` | Flex row/column with token gaps and padding |
| `Button` | `primary`, `secondary`, `ghost`, `danger`; `sm`/`md`/`lg`; `loading`; `icon`; `fullWidth` |
| `IconButton` | Icon-only; `accessibilityLabel` is required |
| `Badge` | `neutral`, `primary`, `info`, `accent`, `success`, `danger` |
| `Card` | Title, subtitle, action slot, footer; `elevated` or `outlined`; whole card pressable with `onPress` |
| `TextField` | Label, hint, error, leading/trailing slots, disabled |
| `ListItem` | Title, subtitle, leading/trailing slots, chevron; pressable rows |

## Accessibility

Built in, not opt-in:

- **Touch targets:** every pressable is at least 44×44pt. Small buttons keep their look and get the extra area through `hitSlop`.
- **Roles and state:** buttons expose `button` with `disabled` and `busy`; `h1`–`h3` and `display` expose `header` so screen reader users can jump between sections.
- **Font scaling:** text follows the user's font size setting (headings up to 1.5×, body up to 2×). Buttons use `minHeight` and wrapping labels, so they grow instead of clipping.
- **Forms:** `TextField` is labelled by its visible label; the hint or error is the accessibility hint; errors set `aria-invalid`, use a polite live region on Android, and are announced on iOS. If your screen moves focus to the first invalid field (or shows an error summary), pass `announceError={false}` so errors aren't read twice. The border uses `lineStrong`, which keeps 3:1 contrast (WCAG 1.4.11).
- **Long labels:** `Button` labels wrap instead of being cut off at large text sizes; pass `numberOfLines` to cap them.
- **Rows read as one element:** `ListItem` and pressable `Card` combine title and subtitle into one label; decorative chevrons are hidden from screen readers.
- **Contrast:** the color pairs are checked against WCAG AA when tokens are built (see `ui/scripts/build-tokens.mjs`).

## Develop

```bash
npm install
npm run tokens     # regenerate src/theme/tokens.ts from ../tokens.json
npm test           # Jest + React Native Testing Library
npm run typecheck
npm run build      # tokens + tsc -> dist/
```

`src/theme/tokens.ts` is generated: edit `tokens.json` at the repo root and run `npm run tokens`. CI fails if the generated file is out of date.
