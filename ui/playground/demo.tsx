import { useState } from "react";
import { createRoot } from "react-dom/client";
import * as S from "../src/index";
import { InfoIcon, StarIcon, CheckCircleIcon } from "../src/icons";
import { More as MoreComponents } from "./more";

const More = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
);
const log = (m: string) => { (window as any).events.push(m); };
(window as any).events = [];

function App() {
  const [page, setPage] = useState(6);
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [city, setCity] = useState<string | null>(null);
  const [chips, setChips] = useState(["Coffee", "Bakery"]);
  const [filter, setFilter] = useState(true);
  const toast = S.useToast();
  return (
    <>
      <S.AppBar
        logo={<b style={{ font: "800 22px var(--font-display)", color: "var(--primary)" }}>stylhero<span style={{ color: "var(--sky)" }}>.</span></b>}
        links={[{ label: "Dashboard", href: "#", active: true }, { label: "Customers", href: "#c" }, { label: "Rewards", href: "#r" }]}
        actions={<>
          <S.Tooltip content="Help"><S.IconButton id="help" label="Help"><InfoIcon /></S.IconButton></S.Tooltip>
          <S.Avatar name="Ana Ruiz" size="sm" />
        </>}
      />
      <S.Container size="xl" style={{ paddingBlock: 24 }}>
        <S.Stack gap={8}>
          <S.Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Customers", href: "#" }, { label: "Ana Ruiz" }]} />
          <S.Stack direction="row" justify="space-between" align="center" wrap gap={3}>
            <S.Text variant="h1">Customers</S.Text>
            <S.Stack direction="row" gap={2}>
              <S.ToggleGroup label="View" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
              <S.Menu
                trigger={<S.IconButton id="menu" label="More actions" variant="secondary"><More /></S.IconButton>}
                items={[
                  { label: "Export CSV", icon: <CheckCircleIcon />, onSelect: () => log("export"), shortcut: "Ctrl+E" },
                  { label: "Import", onSelect: () => log("import") },
                  { label: "Archive", disabled: true },
                  "separator",
                  { label: "Delete all", danger: true, onSelect: () => log("delete") },
                ]}
              />
            </S.Stack>
          </S.Stack>

          <S.Grid minChildWidth={200} gap={4}>
            <S.Card><S.Stat label="Visits this week" value="1,284" change="+12%" hint="vs last week" /></S.Card>
            <S.Card><S.Stat label="Avg. wait" value="3m 10s" change="-8%" invert hint="faster" /></S.Card>
            <S.Card><S.Stat label="Rewards redeemed" value="96" change="-4%" /></S.Card>
            <S.Card><S.Stack direction="row" gap={4} align="center"><S.ProgressCircle value={7} max={10} label="Stamps">7/10</S.ProgressCircle><S.Text variant="small" tone="muted">stamps to next reward</S.Text></S.Stack></S.Card>
          </S.Grid>

          <S.Grid minChildWidth={320} gap={6}>
            <S.Card title="Inputs">
              <S.Combobox id="city" label="City" placeholder="Pick a city" value={city} onValueChange={(v) => { setCity(v); log("city:" + v); }}
                options={["Hermosillo", "Ciudad Obregón", "Nogales", "Guaymas", "Navojoa", "San Luis Río Colorado"]} hint="Type to filter" />
              <S.Slider label="Stamps per visit" showValue defaultValue={2} min={1} max={5} />
              <S.Stack direction="row" gap={2} wrap>
                {chips.map((c) => <S.Chip key={c} onRemove={() => setChips(chips.filter((x) => x !== c))}>{c}</S.Chip>)}
                <S.Chip selected={filter} onClick={() => setFilter(!filter)}>Active only</S.Chip>
              </S.Stack>
              <S.Rating id="rating" defaultValue={3} label="Rate your visit" onValueChange={(v) => log("rating:" + v)} />
              <S.ButtonGroup><S.Button variant="secondary">Day</S.Button><S.Button variant="secondary">Week</S.Button><S.Button variant="secondary">Month</S.Button></S.ButtonGroup>
            </S.Card>

            <S.Card title="Progress">
              <S.Stepper active={1} steps={[{ label: "Account" }, { label: "Business" }, { label: "Cards" }]} />
              <S.Progress label="Uploading" value={40} valueText />
              <S.Progress label="Syncing" />
              <S.Skeleton lines={3} />
              <S.Divider label="or" />
              <S.Stack direction="row" gap={2} wrap>
                <S.Button id="open-dialog" onClick={() => setDialog(true)}>Open dialog</S.Button>
                <S.Button id="open-drawer" variant="secondary" onClick={() => setDrawer(true)}>Open drawer</S.Button>
                <S.Button id="toast" variant="ghost" onClick={() => toast({ message: "Stamp added", tone: "success" })}>Toast</S.Button>
                <S.Popover trigger={<S.Button id="pop" variant="secondary">Popover</S.Button>} title="Quick note">
                  <S.Input label="Note" id="note" />
                  <S.Button size="sm">Save note</S.Button>
                </S.Popover>
              </S.Stack>
            </S.Card>

            <S.Card title="List">
              <S.List>
                <S.ListItem leading={<S.Avatar name="Ana Ruiz" size="sm" />} title="Ana Ruiz" description="8 stamps · last visit today" trailing={<S.Badge tone="accent">Reward</S.Badge>} href="#ana" />
                <S.ListItem leading={<S.Avatar name="Luis Peña" size="sm" />} title="Luis Peña" description="3 stamps" trailing="2d ago" onClick={() => log("luis")} />
                <S.ListItem leading={<StarIcon />} title="Static row" description="No action" />
              </S.List>
              <S.Accordion single defaultOpen={["a"]} items={[
                { id: "a", title: "How do stamps work?", content: "Each visit adds one stamp. Ten stamps earn a free coffee." },
                { id: "b", title: "Can I transfer cards?", content: "Yes, from the customer page." },
              ]} />
            </S.Card>

            <S.Card title="Tabs & table">
              <S.Tabs label="Period" items={[
                { id: "t1", label: "Today", content: <S.Text variant="small">12 visits today.</S.Text> },
                { id: "t2", label: "Week", content: <S.Text variant="small">84 visits this week.</S.Text> },
                { id: "t3", label: "Month", content: <S.Text variant="small">310 visits this month.</S.Text> },
              ]} />
              <S.Pagination page={page} count={20} onPageChange={setPage} />
              <S.Text variant="small" tone="muted">Read the <S.Link href="#docs">docs</S.Link>. Press <kbd>Esc</kbd> to close.</S.Text>
            </S.Card>
          </S.Grid>
        </S.Stack>
      </S.Container>
      <MoreComponents />

      <S.Dialog open={dialog} onClose={() => setDialog(false)} title="Delete customer?" footer={<><S.Button variant="secondary" onClick={() => setDialog(false)}>Cancel</S.Button><S.Button variant="danger" onClick={() => setDialog(false)}>Delete</S.Button></>}>
        Ana Ruiz and her 8 stamps will be removed.
      </S.Dialog>
      <S.Drawer open={drawer} onClose={() => setDrawer(false)} title="Menu" side="left">
        <S.SideNav sections={[{ items: [{ label: "Dashboard", href: "#", active: true, badge: 3 }, { label: "Customers", href: "#c" }] }, { title: "Settings", items: [{ label: "Team", href: "#t" }] }]} />
      </S.Drawer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<S.ToastProvider><App /></S.ToastProvider>);
