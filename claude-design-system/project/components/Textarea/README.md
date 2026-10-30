# Textarea

A labeled multi-line text field for notes and longer answers.

```html
<div class="sh-field">
  <label class="sh-field__label" for="note">Note</label>
  <textarea class="sh-input sh-textarea" id="note"></textarea>
</div>
```

React: `<Textarea label="Note" hint="Only staff can see this." rows={4} />` from `@stylhero/ui`.

- Same field anatomy as Input: label, control, hint or error (`sh-field--error`).
- 96px minimum height; people can resize it vertically.
