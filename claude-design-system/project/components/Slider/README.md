# Slider

A styled native range input. The filled part of the track uses `primary`.

```html
<input type="range" class="sh-slider" min="0" max="100" value="40" style="--sh-fill:40%">
```

Set `--sh-fill` to the value as a percentage (the React component does it for you).

React: `<Slider label="Stamps per visit" min={1} max={5} showValue />`.

Use when the exact number matters less than the feel; otherwise use a number Input.
