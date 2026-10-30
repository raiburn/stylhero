# Dates and times

The pickers use plain `Date` objects (no date library) and `Intl` for month and day names.

- **DatePicker**: a field that opens a calendar. Add `clearable` for an X button. With `name`, it submits the date as YYYY-MM-DD.
- **DateRangePicker**: a start and an end date, plus optional `presets` such as "Last 7 days".
- **TimePicker**: a list of times you can type to filter. Set `step` (minutes) and `min`/`max`, e.g. opening hours. The value is "HH:mm".
- **DateTimePicker**: date and time side by side, as one `Date`.
- **Calendar**: the month grid on its own.

```tsx
<DatePicker label="Visit date" value={d} onValueChange={setD} isDateDisabled={(d) => d.getDay() === 0} />
<DateRangePicker label="Report period" locale="es-MX" weekStartsOn={1}
  presets={[{ label: "Last 7 days", range: [weekAgo, today] }]} />
<TimePicker label="Pickup" min="08:00" max="20:00" step={30} />
```

Calendar keyboard:
- Arrow keys move by a day or a week.
- PageUp and PageDown change the month; add Shift to change the year.
- Home and End jump to the start or end of the week.
- Enter picks the day.

Today has a ring. Disabled days are struck through.
