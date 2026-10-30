# Input

A labeled single-line text field with optional hint or error message.

```html
<div class="sh-field">
  <label class="sh-field__label" for="name">Customer name</label>
  <input class="sh-input" id="name">
  <span class="sh-field__hint">As it appears on their card.</span>
</div>
```

React: `<Input label="Phone" hint="10 digits" error={err} />` from `@stylhero/ui`; it wires up `id`, `aria-describedby` and `aria-invalid`.

- Always give a visible label; placeholders are examples, not labels.
- Add `sh-field--error` to the wrapper to show an error; the hint becomes the error text in `danger`.
- 16px text, so phones don't zoom in on focus.
