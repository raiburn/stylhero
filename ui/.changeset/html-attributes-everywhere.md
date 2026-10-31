---
"@stylhero/ui": minor
---

Components that render their own element now accept that element's HTML attributes (`id`, `style`, `data-*`, `aria-*`, event handlers…) and pass them to it: Accordion, AppBar, Avatar, AvatarGroup, Backdrop, BottomNav, the charts (BarChart, LineChart, ScatterChart, PieChart, Sparkline, Gauge), Chip, CountBadge, DataGrid, Dialog, Divider, Drawer, EmptyState, FieldSet (and RadioGroup/CheckboxGroup), ImageList, ListItem, MobileStepper, Modal, Pagination, Progress, ProgressCircle, SideNav, Skeleton, SpeedDial, Spinner, Stat, Stepper, TableOfContents, Tabs, Timeline, TransferList and TreeView. Your `style` is merged with the component's own, and your `onClick`/`onCancel`/`onKeyDown`/`onMouseLeave` run alongside the internal handlers.
