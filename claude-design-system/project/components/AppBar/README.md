# AppBar

The 64px top bar: logo, main links, actions on the right. Sticky by default.

React: `<AppBar logo={<img src="/stylhero-wordmark.svg" alt="stylhero" />} links={[{ label: "Dashboard", href: "/", active: true }]} actions={…} />`.

- The current page link gets `aria-current="page"` (primary on primary-soft).
- On phones the links scroll sideways; for more than 4 links, move them to a SideNav in a Drawer.
- In real apps use the wordmark SVG from the Logos group, 28px tall.
