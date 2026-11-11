/*
  GENERATED from tokens.json by scripts/build-tokens.mjs. Do not edit; edit tokens.json and run `npm run tokens`.

  Stylhero for Tailwind CSS v3 (the v4 equivalent is tailwind.css). In tailwind.config:
    presets: [require("@stylhero/ui/tailwind-preset")]
  Load the CSS before Tailwind's layers, with postcss-import in your PostCSS config:
    @import "@stylhero/ui/styles/tokens.css";
    @import "@stylhero/ui/styles/components.css";
    @tailwind base; @tailwind components; @tailwind utilities;
  postcss-import inlines components.css, so Tailwind v3 moves its `@layer components`
  rules into its own components layer (after preflight, before utilities).
  Values are CSS variables, so light and dark come from tokens.css.
*/
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        "surface-sunken": "var(--surface-sunken)",
        "ink": "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "line": "var(--line)",
        "line-strong": "var(--line-strong)",
        "primary": "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "on-primary": "var(--on-primary)",
        "primary-soft": "var(--primary-soft)",
        "sky": "var(--sky)",
        "sky-soft": "var(--sky-soft)",
        "accent": "var(--accent)",
        "on-accent": "var(--on-accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-ink": "var(--accent-ink)",
        "success": "var(--success)",
        "success-soft": "var(--success-soft)",
        "danger": "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
        "chart-6": "var(--chart-6)",
        "chart-7": "var(--chart-7)",
        "chart-8": "var(--chart-8)"
      },
      "fontFamily": {
        "display": [
          "var(--font-display)"
        ],
        "sans": [
          "var(--font-sans)"
        ],
        "mono": [
          "var(--font-mono)"
        ]
      },
      "borderRadius": {
        "sm": "var(--radius-sm)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "full": "var(--radius-full)"
      },
      "boxShadow": {
        "card": "var(--shadow-card)",
        "dialog": "var(--shadow-dialog)"
      }
    }
  }
};
