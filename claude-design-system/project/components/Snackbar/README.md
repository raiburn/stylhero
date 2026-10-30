# Snackbar, Backdrop, Modal and alert variants

- **Toast actions**: `toast({ message: "Customer archived", action: { label: "Undo", onClick: undo } })`. A toast with an action stays up for 6 seconds.
- **Snackbar**: one toast whose open state you control (MUI Snackbar). `<Snackbar open={open} onClose={...} message="Saved" position="bottom-center" />`
- **Backdrop**: dims the whole screen, e.g. `<Backdrop open={saving} label="Saving"><Spinner /></Backdrop>`. Without `onClose` it blocks until you close it.
- **Modal**: a bare modal layer for your own panel, with no header or padding. Use Dialog for standard confirmations.
- **Alert** now takes `onClose`, `action` and `variant`: soft (default), outlined or filled. Save filled for errors that need attention now.
