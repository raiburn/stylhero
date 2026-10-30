# SideNav

A 256px sidebar for dashboard apps: header (logo), sections of links with Lucide icons and optional count badges, footer (signed-in user).

React: `<SideNav header={logo} sections={[{ items: [{ label: "Dashboard", href: "/", icon: <LayoutDashboard />, active: true }] }, { title: "Settings", items: […] }]} footer={…} />`.

On phones hide it and put the same SideNav inside `<Drawer side="left">`; it fills the drawer automatically.
