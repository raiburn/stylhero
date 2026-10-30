# Switch

An on/off toggle for settings that take effect immediately.

```html
<label class="sh-switch"><input type="checkbox" role="switch"><span>Accept new members</span></label>
```

React: `<Switch label="Accept new members" checked={on} onChange={e => setOn(e.target.checked)} />` from `@stylhero/ui`.

- Use only when the change saves instantly; inside a form with a Save button, use Checkbox.
- The label names the setting, not the state ("Accept new members", not "On").
