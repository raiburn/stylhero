// Generates styles/tokens.css and styles/tailwind.css from ../tokens.json (the source of truth),
// copies tokens.json into the Claude design system mirror, and checks text contrast.
// Run: npm run tokens   (also runs before every build)
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const src = join(root, "tokens.json");
const stylesDir = join(here, "..", "styles");
const mirror = join(root, "claude-design-system", "project", "tokens.json");

const tokens = JSON.parse(readFileSync(src, "utf8"));
const errors = [];

// ---------- read ----------
const themes = tokens.color.themes.map((t) => t.id);
const [baseTheme, ...otherThemes] = themes;
const darkTheme = themes.find((t) => t === "dark");

const valueIn = (token, theme) =>
  typeof token.value === "string" ? token.value : token.value[theme] ?? token.value[baseTheme];

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
for (const t of tokens.color.tokens) {
  for (const theme of themes) {
    const v = valueIn(t, theme);
    if (!HEX.test(v)) errors.push(`color "${t.name}" (${theme}): "${v}" is not a hex color`);
  }
}
const names = new Set();
for (const family of ["color", "spacing", "radius", "shadow"]) {
  for (const t of tokens[family]?.tokens ?? []) {
    if (names.has(t.name)) errors.push(`token name "${t.name}" is used twice`);
    names.add(t.name);
  }
}

// ---------- contrast ----------
// [text, background, minimum ratio]; checked in every theme.
const PAIRS = [
  ["ink", "surface", 4.5], ["ink", "surface-raised", 4.5],
  ["ink-muted", "surface", 4.5], ["ink-muted", "surface-raised", 4.5],
  ["on-primary", "primary", 4.5], ["on-primary", "primary-hover", 4.5],
  ["primary", "surface-raised", 4.5], ["primary", "primary-soft", 4.5], ["primary", "sky-soft", 4.5],
  ["accent-ink", "accent-soft", 4.5], ["success", "success-soft", 4.5], ["danger", "danger-soft", 4.5],
  ["on-accent", "accent", 4.5], ["ink", "sky-soft", 4.5],
  ["ink-muted", "surface-raised", 3, "control borders (checkbox, switch track)"],
];
const lum = (hex) => {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const byName = Object.fromEntries(tokens.color.tokens.map((t) => [t.name, t]));
for (const [fg, bg, min] of PAIRS) {
  if (!byName[fg] || !byName[bg]) continue;
  for (const theme of themes) {
    const r = ratio(valueIn(byName[fg], theme), valueIn(byName[bg], theme));
    if (r < min) errors.push(`contrast ${fg} on ${bg} (${theme}) is ${r.toFixed(2)}:1, needs ${min}:1`);
  }
}

if (errors.length) {
  console.error("tokens.json has problems:\n  - " + errors.join("\n  - "));
  process.exit(1);
}

// ---------- tokens.css ----------
const firstFamily = (stack) => stack.split(",")[0].trim();
const families = tokens.type.families;
// Each family reads a next/font variable; families sharing a font share the variable.
const fontVar = (key) => {
  const owner = Object.keys(families).find((k) => firstFamily(families[k]) === firstFamily(families[key]));
  return owner === "display" && "sans" in families && firstFamily(families.sans) === firstFamily(families.display) ? "sans" : owner;
};
const fontLines = Object.entries(families).map(([key, stack]) => {
  const [first, ...rest] = stack.split(",").map((s) => s.trim());
  return `  --font-${key}: var(--next-font-${fontVar(key)}, ${first}), ${rest.join(", ")};`;
});

const themed = (theme, indent) => [
  ...tokens.color.tokens.map((t) => `${indent}--${t.name}: ${valueIn(t, theme)};`),
  ...(tokens.shadow?.tokens ?? []).map((t) => `${indent}--${t.name}: ${valueIn(t, theme)};`),
];
const plain = (family) => (tokens[family]?.tokens ?? []).map((t) => `  --${t.name}: ${t.value};`);

const nextFontNote = `  /* next/font: load ${firstFamily(families.sans).replace(/"/g, "")} with \`variable: "--next-font-sans"\` and these pick it up */`;

let css = `/* GENERATED from tokens.json by scripts/build-tokens.mjs. Do not edit; edit tokens.json and run \`npm run tokens\`. */

:root {
${themed(baseTheme, "  ").join("\n")}

${nextFontNote}
${fontLines.join("\n")}

${plain("spacing").join("\n")}

${plain("radius").join("\n")}

  color-scheme: ${baseTheme === "dark" ? "dark" : "light"};
}
`;

if (darkTheme && darkTheme !== baseTheme) {
  css += `
/* Dark values, used by the OS setting unless data-theme="${baseTheme}" forces ${baseTheme} */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="${baseTheme}"]) {
${themed("dark", "    ").join("\n")}
    color-scheme: dark;
  }
}
`;
}
for (const theme of otherThemes) {
  css += `
:root[data-theme="${theme}"] {
${themed(theme, "  ").join("\n")}
  color-scheme: ${theme === "dark" ? "dark" : "light"};
}
`;
}
css += `
body {
  background: var(--surface);
  color: var(--ink);
  font: 400 16px/24px var(--font-sans);
}
`;

// ---------- tailwind.css ----------
const TAILWIND_DEFAULT_FONTS = new Set(["sans", "serif", "mono"]);
const tw = `/*
  GENERATED from tokens.json by scripts/build-tokens.mjs. Do not edit; edit tokens.json and run \`npm run tokens\`.

  Stylhero for Tailwind CSS v4. In your app's globals.css:
    @import "tailwindcss";
    @import "@stylhero/ui/tailwind.css";
  Gives you bg-primary, text-ink, border-line, font-display, rounded-lg, ...
  Spacing already matches: p-4 = 16px = --space-4.
*/
@import "./tokens.css";

@theme inline {
${tokens.color.tokens.map((t) => `  --color-${t.name}: var(--${t.name});`).join("\n")}
${(tokens.shadow?.tokens ?? []).map((t) => `  --${t.name}: var(--${t.name});`).join("\n")}
}

/* Tailwind's font-sans/mono and rounded-* read --font-* and --radius-*,
   which tokens.css already defines, so they use Stylhero values. Extra font families: */
@theme {
${Object.entries(families).filter(([k]) => !TAILWIND_DEFAULT_FONTS.has(k)).map(([k, v]) => `  --font-${k}: ${v};`).join("\n")}
}
`;

writeFileSync(join(stylesDir, "tokens.css"), css);
writeFileSync(join(stylesDir, "tailwind.css"), tw);
if (existsSync(dirname(mirror))) copyFileSync(src, mirror);

console.log(
  `tokens: ${tokens.color.tokens.length} colors × ${themes.length} themes, ` +
  `${Object.keys(families).length} font families, ${plain("spacing").length} spacing, ${plain("radius").length} radii, ` +
  `${tokens.shadow?.tokens.length ?? 0} shadows. Contrast OK (${PAIRS.length} pairs × ${themes.length} themes).`
);
