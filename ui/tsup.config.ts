import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  // Tabs, Dialog and Toast use hooks; this lets Next.js server components import the package directly.
  banner: { js: '"use client";' },
});
