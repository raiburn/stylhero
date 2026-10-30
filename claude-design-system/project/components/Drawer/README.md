# Drawer

A full-height panel on the native `<dialog>`, sliding from the right (default), left, or bottom (a sheet on phones). Same header and footer as Dialog.

React: `<Drawer open={open} onClose={close} title="Filters" side="right" footer={…}>…</Drawer>`.

- Right: filters, details, edit forms. Left: mobile navigation (put a SideNav inside). Bottom: phone action sheets.
- Esc and backdrop clicks close it.
