# Publishing @stylhero/ui to npm

The package lives in `ui/`. Everything below runs from there unless noted.

Releases are published by GitHub Actions (`.github/workflows/release.yml`), not from your machine. When a change to the version in `ui/package.json` reaches `main`, the workflow:

1. checks whether that version is already on npm, and stops if it is
2. runs `npm publish --provenance` (which first runs the typecheck, build and tests, see below)
3. tags the commit `vX.Y.Z` and creates a GitHub release from its CHANGELOG entry

Provenance means the npm page shows that the package was built from this repository by GitHub Actions, and links to the exact commit and workflow run.

## One-time setup

1. **Create an npm account** at https://www.npmjs.com/signup (skip if you have one), and turn on two-factor auth.
2. **Own the `@stylhero` scope.** A scoped package can only be published by the npm user or organization with that name. As of 2026-10-30 nobody owns it (`npm org ls stylhero` → "Scope not found", and `@stylhero/ui` and `stylhero` are both unclaimed). Pick one:
   - **Create the free organization "stylhero"**: https://www.npmjs.com/org/create → name `stylhero` → "Unlimited public packages" (free). You become its owner. *(Recommended: the name stays `@stylhero/ui`.)*
   - **Or use your username as the scope**: change `"name"` in `ui/package.json` to `@<your-npm-username>/ui` (and in `release.yml`), and update the imports in the READMEs (`@stylhero/ui/...`) to match.
3. **Give the workflow a token for the first publish.** Trusted publishing can only be set up on a package that already exists, so the first release uses a token:
   - On npmjs.com: avatar → **Access Tokens** → **Generate New Token** → **Granular Access Token**. Give it read and write access to packages in the `stylhero` scope, allow it to bypass two-factor auth (the workflow can't type a code), and give it a short expiry (7 days is enough).
   - On GitHub: raiburn/stylhero → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, named `NPM_TOKEN`.
4. **After the first publish, switch to trusted publishing** and drop the token:
   - On npmjs.com: package `@stylhero/ui` → **Settings** → **Trusted Publisher** → **GitHub Actions**. Organization or user `raiburn`, repository `stylhero`, workflow filename `release.yml`.
   - Delete the `NPM_TOKEN` secret on GitHub and revoke the token on npm. From then on the workflow signs in with a short-lived GitHub identity token, and there's no secret to leak or renew.

`publishConfig.access` is already `"public"` in `ui/package.json`. Scoped packages are private (paid) by default, so without it the first publish would fail.

## Releasing a new version

1. Each pull request that changes the package adds a changeset (`cd ui && npm run changeset`).
2. When you want to release, make a branch from `main` and bump the version:
   ```bash
   cd ui
   npx changeset status        # what's pending
   npm run version-packages    # bumps package.json and the lockfile, writes CHANGELOG.md, deletes the changesets
   ```
   Tidy the new CHANGELOG entry: give the heading a date (`## X.Y.Z - YYYY-MM-DD`) and sort the items into Added / Changed / Fixed / Removed. While the version is `0.x`, a `minor` may be breaking: list those under "Changed".
3. Open a pull request named "Stylhero vX.Y.Z". When CI passes, merge it. The release workflow publishes, tags and creates the GitHub release. Follow it under the repository's **Actions** tab.

If the publish step fails (for example, an expired token), fix the cause and rerun it from **Actions** → **Release** → **Run workflow**. It skips versions that are already on npm, so rerunning is always safe.

### What `npm publish` checks first

`npm publish` runs the `prepublishOnly` script and stops if any step fails, so a broken build can't be published:

1. `npm run typecheck`: `tsc --noEmit` over `src/` and the playground.
2. `npm run build`: regenerates `styles/tokens.css` and `styles/tailwind.css` from `../tokens.json` (and fails if any text/background pair drops below 4.5:1 contrast), then builds `dist/` with tsup.
3. `npm test`: builds the playground and runs the 72 behavior checks in headless Chrome.

### Publishing by hand

Only if GitHub Actions is unavailable. This build has no provenance.

```bash
npm login
cd ui
npm run check:pack    # optional: list what will be uploaded
npm publish           # enter your 2FA code when asked
git tag vX.Y.Z && git push origin vX.Y.Z
```

The tests need Google Chrome. If it isn't at `C:/Program Files/Google/Chrome/Application/chrome.exe`, set `CHROME_PATH="/path/to/chrome"` first.

### If you published something broken

`npm deprecate @stylhero/ui@X.Y.Z "reason"` and release a fixed version. `npm unpublish` only works within 72 hours and the version number can never be reused.

## Notes for users of the package

- Fonts are not bundled. Next.js apps load them with `next/font` (see `ui/README.md`); other apps (e.g. Vite) need a Google Fonts `<link>` or `@fontsource/plus-jakarta-sans`, otherwise text falls back to Segoe UI / system-ui.
- Tested with a fresh Vite 8 + React 19 + TypeScript app installing the packed tarball: `tsc -b && vite build` passes, and the page renders with no console errors.
