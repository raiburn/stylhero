# Select

A labeled dropdown for choosing one option from a short list, built on the native `<select>`.

```html
<div class="sh-field">
  <label class="sh-field__label" for="reward">Reward</label>
  <div class="sh-select-wrap"><select class="sh-input" id="reward"><option>Free coffee</option></select></div>
</div>
```

React: `<Select label="Reward"><option>Free coffee</option></Select>` from `@stylhero/ui`.

- Native, so keyboard, screen readers and phone pickers work for free.
- For 2–4 options that should all be visible, use Radio instead.
