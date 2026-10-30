// Adds explicit extensions to relative imports in dist/ (esbuild keeps them as written when
// not bundling). Strict ESM resolvers (Node, webpack for "type": "module") need "./cn.js";
// CommonJS files must point at the .cjs build, and each .d.ts/.d.cts at its matching build.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const esm = /(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.{1,2}\/[^"']*)\2/g;
const cjs = /(\brequire\s*\(\s*)(["'])(\.{1,2}\/[^"']*)\2/g;
// [file suffix, extension to add, import pattern]; the more specific .d.* suffixes come first.
const rules = [
  [".d.ts", ".js", esm],
  [".d.cts", ".cjs", esm],
  [".js", ".js", esm],
  [".cjs", ".cjs", cjs],
];

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

let changed = 0;
for (const file of walk(dist)) {
  const rule = rules.find(([suffix]) => file.endsWith(suffix));
  if (!rule) continue;
  const [, ext, re] = rule;
  const src = readFileSync(file, "utf8");
  const out = src.replace(re, (m, pre, q, spec) => {
    if (/\.(c|m)?js$/.test(spec)) return m;
    const base = join(dirname(file), spec);
    const target = existsSync(base + ext) ? spec + ext : spec + "/index" + ext;
    return `${pre}${q}${target}${q}`;
  });
  if (out !== src) {
    writeFileSync(file, out);
    changed++;
  }
}
console.log(`fix-dist-imports: updated ${changed} files`);
