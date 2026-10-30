// Bundles the playground (every component on one page) into playground/demo.js.
// npm run playground   -> builds and opens it in your browser
// npm run playground -- --watch   -> rebuilds on save
import { context } from "esbuild";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ctx = await context({
  entryPoints: [join(here, "demo.tsx")],
  outfile: join(here, "demo.js"),
  bundle: true,
  format: "iife",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"development"' },
  logLevel: "info",
});

if (process.argv.includes("--watch")) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  await ctx.dispose();
  if (!process.argv.includes("--no-open")) {
    const page = join(here, "index.html");
    const [cmd, args] = process.platform === "win32" ? ["cmd", ["/c", "start", "", page]] : [process.platform === "darwin" ? "open" : "xdg-open", [page]];
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  }
}
