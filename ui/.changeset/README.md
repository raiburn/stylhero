# Changesets

This folder holds pending release notes for `@stylhero/ui`, managed by [Changesets](https://changesets.dev).
Run every command from `ui/` (the package root), not from the repo root.

## Adding a changeset

When a change should show up in the next release:

```bash
cd ui
npm run changeset
```

Pick the bump type and write a one-line summary for users. This creates a markdown
file in this folder; commit it together with your change.

| Bump  | When (while in 0.x)                                          |
| ----- | ------------------------------------------------------------ |
| patch | Bug fixes, style tweaks that do not change the API           |
| minor | New components or props, **and any breaking change**         |
| major | Reserved for 1.0.0                                           |

Breaking changes must say so in the summary (start it with `**Breaking:**`) so they
can be listed under "Changed"/"Removed" in `CHANGELOG.md`.

## Releasing

```bash
cd ui
npx changeset status   # what will be released
npm run version        # bumps package.json and writes CHANGELOG.md, deletes the changesets
```

`changeset version` inserts the new version above the latest version heading in
`CHANGELOG.md` (below "Unreleased"). Tidy the generated entry into Added / Changed /
Fixed / Removed sections and add the date, then commit.
