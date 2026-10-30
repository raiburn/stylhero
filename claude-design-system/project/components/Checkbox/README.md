# Checkbox

Checkboxes for independent yes/no choices and radios for picking one of a few options; React exports `Checkbox` and `Radio`.

```html
<label class="sh-check"><input type="checkbox"><span>Send SMS</span></label>
<label class="sh-check"><input type="radio" name="plan"><span>Monthly</span></label>
```

React: `<Checkbox label="Send SMS" hint="Optional detail" />`, `<Radio name="plan" label="Monthly" />` from `@stylhero/ui`.

- The whole label is clickable. Write labels as positive statements ("Send SMS", not "Don't send SMS").
- Radios in one group share a `name`; wrap them in an element with `role="radiogroup"` and a label.
- For a setting that applies instantly, use Switch.
