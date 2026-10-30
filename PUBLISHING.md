# Publishing @stylhero/ui to npm

The package lives in `ui/`. Everything below runs from there unless noted.

## One-time setup

1. **Create an npm account** at https://www.npmjs.com/signup (skip if you have one), and turn on two-factor auth (npm asks for a one-time code on publish).
2. **Log in from the terminal:**
   ```bash
   npm login
   npm whoami        # should print your npm username
   ```
3. **Own the `@stylhero` scope.** A scoped package can only be published by the npm user or organization with that name. As of 2026-10-30 nobody owns it (`npm org ls stylhero` → "Scope not found", and `@stylhero/ui` and `stylhero` are both unclaimed). Pick one:
   - **Create the free organization "stylhero"**: https://www.npmjs.com/org/create → name `stylhero` → "Unlimited public packages" (free). You become its owner. *(Recommended: the name stays `@stylhero/ui`.)*
   - **Or use your username as the scope**: change `"name"` in `ui/package.json` to `@<your-npm-username>/ui` and update the imports in the READMEs (`@stylhero/ui/...`) to match.

`publishConfig.access` is already `"public"` in `ui/package.json`. Scoped packages are private (paid) by default, so without it the first publish would fail.

## Publish

```bash
cd ui
npm install
npm run check:pack    # optional: list what will be uploaded (should be dist/, styles/, logo/, README.md, package.json)
npm publish           # enter your 2FA code when asked
```

Then check https://www.npmjs.com/package/@stylhero/ui.

### What `npm publish` checks first

`npm publish` runs the `prepublishOnly` script and stops if any step fails, so a broken build can't be published:

1. `npm run typecheck`: `tsc --noEmit` over `src/`.
2. `npm run build`: regenerates `styles/tokens.css` and `styles/tailwind.css` from `../tokens.json` (and fails if any text/background pair drops below 4.5:1 contrast), then builds `dist/` with tsup.
3. `npm test`: builds the playground and runs the 66 behavior checks in headless Chrome.

The tests need Google Chrome. If it isn't at `C:/Program Files/Google/Chrome/Application/chrome.exe`, point to it first:
```bash
CHROME_PATH="/path/to/chrome" npm publish
```

## Releasing a new version

1. Make sure `main` is clean and the tests pass (`cd ui && npm test`).
2. Bump the version in `ui/package.json` and `ui/package-lock.json`:
   ```bash
   cd ui
   npm version patch --no-git-tag-version   # bug fixes:            0.4.0 -> 0.4.1
   npm version minor --no-git-tag-version   # new components/props: 0.4.0 -> 0.5.0
   npm version major --no-git-tag-version   # breaking changes:     0.4.0 -> 1.0.0
   ```
   While the version is `0.x`, treat `minor` as possibly breaking. Note what changed in the changelog. (If the repo uses Changesets, let `npx changeset version` do this step instead.)
3. Commit, tag, publish and push:
   ```bash
   git commit -am "Stylhero vX.Y.Z"
   git tag vX.Y.Z
   npm publish
   git push --follow-tags
   ```

If you published something broken: `npm deprecate @stylhero/ui@X.Y.Z "reason"` and release a fixed version. `npm unpublish` only works within 72 hours and the version number can never be reused.

## Notes for users of the package

- Fonts are not bundled. Next.js apps load them with `next/font` (see `ui/README.md`); other apps (e.g. Vite) need a Google Fonts `<link>` or `@fontsource/plus-jakarta-sans`, otherwise text falls back to Segoe UI / system-ui.
- Tested with a fresh Vite 8 + React 19 + TypeScript app installing the packed tarball: `tsc -b && vite build` passes, and the page renders with no console errors.
