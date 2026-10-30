# Combobox (Autocomplete)

An input that filters a list of options as you type. Arrow keys move the highlight, Enter picks, Esc closes.

React: `<Combobox label="City" options={["Hermosillo", "Nogales", …]} value={city} onValueChange={setCity} />`. Options can be `{ value, label, hint }`.

Anatomy: `sh-select-wrap sh-combobox` around the `sh-input`; the popup is `sh-listbox` with `sh-listbox__option` rows (`--active` = highlighted, `aria-selected="true"` = chosen).

Use Select for under ~8 fixed options; Combobox when the list is long or searchable.
