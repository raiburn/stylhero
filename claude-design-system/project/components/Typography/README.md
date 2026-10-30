# Typography: Text and Link

Classes for every type style in tokens.json, so pages never hand-set font sizes.

| Class | Style |
| --- | --- |
| `sh-text--display` | 48/52 ExtraBold (36px on phones), hero only |
| `sh-text--h1` / `--h2` / `--h3` | 32, 24, 18px headings |
| `sh-text--body` / `--small` | 16 and 14px text |
| `sh-text--label` | 12px uppercase eyebrow |
| `sh-text--mono` | JetBrains Mono for codes and IDs |

Tones: `sh-text--muted`, `--primary`, `--success`, `--danger`. Always combine with `sh-text`.

```html
<h1 class="sh-text sh-text--h1">Customers</h1>
<p class="sh-text sh-text--small sh-text--muted">Last visit today</p>
<a class="sh-link" href="/rewards">How rewards work</a>
```

React: `<Text variant="h1">`, `<Text variant="small" tone="muted">`, `<Link href="…">`. `as` changes the tag without changing the look.
