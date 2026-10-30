import { defineConfig } from "tsup";

// One output file per source module (no bundling), so apps only load the components they use
// and bundlers can tree-shake. Without bundling esbuild keeps each file's own "use client"
// directive: only modules that need the browser (hooks, state, context, floating-ui) carry it,
// so presentational components (Text, Stack, Card...) stay usable as React Server Components.
// scripts/fix-dist-imports.mjs then adds file extensions to the relative imports.
export default defineConfig({
  entry: ["src/**/*.{ts,tsx}"],
  format: ["esm", "cjs"],
  bundle: false,
  dts: true,
  clean: true,
  target: "es2020",
});
