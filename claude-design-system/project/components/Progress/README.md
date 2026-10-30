# Progress

A linear bar (`sh-progress`) or ring (`sh-ring`). Tones: primary (default), success, accent (lemon, for reward progress).

React: `<Progress label="Importing" value={40} valueText />`, `<Progress />` (indeterminate), `<ProgressCircle value={7} max={10}>7/10</ProgressCircle>`.

- The ring is the natural "stamps to next reward" display.
- Always show the number in text too; with the accent tone, the color alone has low contrast.
