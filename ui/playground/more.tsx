import { useState } from "react";
import * as S from "../src/index";
import { CalendarIcon, CheckCircleIcon, ClockIcon, InfoIcon, PlusIcon, SearchIcon, StarIcon } from "../src/icons";

const log = (m: string) => { (window as any).events.push(m); };

// Placeholder photos as inline SVG gradients, so the playground works offline.
const photo = (a: string, b: string, h = 300) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${h}"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="${h}" fill="url(#g)"/></svg>`)}`;
const photos = [photo("#173a7a", "#3ba3e6"), photo("#f5d23d", "#eb6834", 420), photo("#1baf7a", "#3ba3e6", 240), photo("#6250d6", "#e87ba4", 360), photo("#0b1b33", "#173a7a"), photo("#e3ebf8", "#3ba3e6", 280)];

type Customer = { id: string; name: string; city: string; stamps: number; spent: number; status: "Active" | "Reward" | "Inactive"; trend: number[] };
const names = ["Ana Ruiz", "Luis Peña", "María López", "Jorge Díaz", "Sofía Castro", "Diego Romero", "Valeria Soto", "Carlos Vega", "Lucía Ramos", "Pedro Flores", "Elena Cruz", "Raúl Ortiz"];
const cities = ["Hermosillo", "Nogales", "Guaymas", "Navojoa"];
const customers: Customer[] = names.map((name, i) => ({
  id: String(i + 1), name, city: cities[i % 4], stamps: (i * 7) % 11, spent: 180 + ((i * 937) % 2400),
  status: i % 5 === 0 ? "Reward" : i % 4 === 3 ? "Inactive" : "Active",
  trend: Array.from({ length: 10 }, (_, j) => 3 + ((i * 3 + j * 5) % 7)),
}));
const money = (n: unknown) => `$${Number(n).toLocaleString("en-US")}`;

export function More() {
  const [tags, setTags] = useState<string[]>(["Coffee"]);
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<S.DateRange>([null, null]);
  const [snack, setSnack] = useState(false);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(false);
  const [alert, setAlert] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const [step, setStep] = useState(1);
  const [nav, setNav] = useState("Home");
  const [chosen, setChosen] = useState(["latte"]);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const days = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

  return (
    <S.Container size="xl" style={{ paddingBlock: 24 }} id="more">
      <S.Stack gap={8}>
        <S.Text variant="h1">More components</S.Text>

        <S.Grid minChildWidth={320} gap={6}>
          <S.Card title="Forms" subtitle="Adornments, multi-select, groups">
            <S.Input id="search" label="Search" placeholder="Name or phone" start={<SearchIcon />} />
            <S.Input label="Price" start="$" end="MXN" defaultValue="45" inputMode="decimal" />
            <S.NumberInput id="qty" label="Stamps to add" defaultValue={1} min={1} max={5} onValueChange={(v) => log("qty:" + v)} />
            <S.Combobox id="tags" multiple label="Categories" placeholder="Add categories" value={tags} onValueChange={(v) => { setTags(v); log("tags:" + v.join("+")); }}
              options={["Coffee", "Bakery", "Breakfast", "Lunch", "Desserts"]} />
            <S.RadioGroup legend="Reward" row defaultValue="coffee" options={[{ value: "coffee", label: "Free coffee" }, { value: "pastry", label: "Pastry" }, { value: "off", label: "10% off", disabled: true }]} />
            <S.CheckboxGroup legend="Notify by" selectAll="All channels" defaultValue={["sms"]} options={[{ value: "sms", label: "SMS" }, { value: "email", label: "Email" }, { value: "wa", label: "WhatsApp" }]} />
            <S.Textarea id="auto" label="Notes" autoResize maxRows={5} placeholder="Grows as you type" />
            <S.Stack direction="row" gap={2} wrap>
              <S.Button id="save" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }}>Save</S.Button>
              <S.Button size="lg" variant="secondary">Large</S.Button>
            </S.Stack>
          </S.Card>

          <S.Card title="Dates and times">
            <S.DatePicker id="date" label="Visit date" value={date} onValueChange={(d) => { setDate(d); log("date:" + (d ? d.getDate() : "null")); }} clearable
              min={days(-60)} isDateDisabled={(d) => d.getDay() === 0} hint="Closed on Sundays" />
            <S.DateRangePicker id="range" label="Report period" value={range} onValueChange={setRange} locale="es-MX" weekStartsOn={1}
              presets={[{ label: "Last 7 days", range: [days(-6), today] }, { label: "Last 30 days", range: [days(-29), today] }]} />
            <S.TimePicker id="time" label="Pickup time" min="08:00" max="20:00" step={30} />
            <S.DateTimePicker label="Appointment" />
            <S.Calendar value={date} onValueChange={setDate} />
          </S.Card>

          <S.Card title="Charts" subtitle="Hover for values; every chart has a table view">
            <S.BarChart data-attrs="chart" title="Visits by day" labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} height={220}
              series={[{ name: "New", data: [12, 18, 9, 22, 30, 41, 15] }, { name: "Returning", data: [40, 35, 44, 38, 52, 66, 30] }]} />
            <S.LineChart title="Stamps this year" area curved labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]} height={220}
              series={[{ name: "Hermosillo", data: [120, 132, 150, 170, 160, 190, 210, 230] }, { name: "Nogales", data: [80, 90, 85, 100, 120, 115, 130, 150] }, { name: "Guaymas", data: [40, 45, 60, 58, 70, 82, 80, 95] }]} />
          </S.Card>
        </S.Grid>

        <S.Grid minChildWidth={300} gap={6}>
          <S.Card title="Rewards redeemed">
            <S.PieChart centerLabel={<><b>352</b><span>total</span></>} data={[{ label: "Coffee", value: 180 }, { label: "Pastry", value: 92 }, { label: "Breakfast", value: 50 }, { label: "Other", value: 30 }]} size={180} />
          </S.Card>
          <S.Card title="Monthly goal">
            <S.Stack align="center"><S.Gauge value={68} label="of 500 visits" /></S.Stack>
            <S.Stack direction="row" justify="space-between" align="center">
              <S.Stat label="Visits" value="340" change="+12%" />
              <S.Sparkline data-attrs="sparkline" data={[3, 5, 4, 6, 8, 7, 9, 11, 10, 12]} label="Visits, last 10 days, trending up" />
            </S.Stack>
          </S.Card>
          <S.Card title="Basket size vs visits">
            <S.ScatterChart xLabel="Visits" yLabel="Avg. ticket" yFormat={(n) => "$" + n} height={220}
              series={[{ name: "Hermosillo", data: [{ x: 2, y: 60 }, { x: 5, y: 75 }, { x: 9, y: 90 }, { x: 12, y: 85 }] }, { name: "Nogales", data: [{ x: 1, y: 40 }, { x: 4, y: 55 }, { x: 7, y: 70 }] }]} />
          </S.Card>
        </S.Grid>

        <S.DataGrid<Customer>
          data-attrs="grid"
          label="Customers"
          rows={customers}
          search="Search customers"
          checkboxSelection
          onSelectionChange={(ids) => log("sel:" + ids.length)}
          columnsButton
          exportFileName="customers"
          pageSize={5}
          pageSizeOptions={[5, 10]}
          columns={[
            { field: "name", header: "Name", render: (r) => <S.Stack direction="row" gap={2} align="center"><S.Avatar name={r.name} size="sm" />{r.name}</S.Stack> },
            { field: "city", header: "City" },
            { field: "stamps", header: "Stamps", numeric: true },
            { field: "spent", header: "Spent", numeric: true, format: money },
            { field: "status", header: "Status", render: (r) => <S.Badge tone={r.status === "Reward" ? "accent" : r.status === "Active" ? "success" : "neutral"}>{r.status}</S.Badge> },
            { field: "trend", header: "Last 10 visits", sortable: false, hidden: false, render: (r) => <S.Sparkline data={r.trend} label={`${r.name} visit trend`} width={80} height={24} area={false} /> },
          ]}
        />

        <S.Grid minChildWidth={300} gap={6}>
          <S.Card title="Tree view">
            <S.TreeView label="Branches" defaultExpanded={["son"]} items={[
              { id: "son", label: "Sonora", children: [
                { id: "hmo", label: "Hermosillo", children: [{ id: "hmo-1", label: "Centro" }, { id: "hmo-2", label: "Pitic" }] },
                { id: "nog", label: "Nogales" },
                { id: "gym", label: "Guaymas", disabled: true },
              ] },
              { id: "sin", label: "Sinaloa", children: [{ id: "cul", label: "Culiacán" }] },
            ]} onSelect={(id) => log("tree:" + id)} />
          </S.Card>
          <S.Card title="Timeline">
            <S.Timeline events={[
              { title: "Reward redeemed", description: "Free coffee", time: "Today 9:41", tone: "accent", icon: <StarIcon /> },
              { title: "Stamp added", time: "Yesterday", tone: "primary" },
              { title: "Card created", description: "Hermosillo Centro", time: "Mar 3", tone: "success", icon: <CheckCircleIcon /> },
            ]} />
          </S.Card>
          <S.Card title="Transfer list">
            <S.TransferList titles={["Products", "Earn stamps"]} value={chosen} onValueChange={setChosen}
              items={[{ value: "latte", label: "Latte" }, { value: "mocha", label: "Mocha" }, { value: "tea", label: "Tea" }, { value: "bagel", label: "Bagel" }]} />
          </S.Card>
        </S.Grid>

        <S.Grid minChildWidth={300} gap={6}>
          <S.Card title="Feedback">
            {alert && <S.Alert id="closable" tone="success" title="Saved" onClose={() => setAlert(false)} action={<S.Button size="sm" variant="ghost">Undo</S.Button>}>Your changes are live.</S.Alert>}
            <S.Alert tone="warning" variant="outlined">Card expires in 3 days.</S.Alert>
            <S.Alert tone="danger" variant="filled">Payment failed.</S.Alert>
            <S.Stack direction="row" gap={2} wrap>
              <S.Button id="snack" variant="secondary" onClick={() => setSnack(true)}>Snackbar</S.Button>
              <S.Button id="busy" variant="secondary" onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 600); }}>Backdrop</S.Button>
              <S.Button id="modal" variant="secondary" onClick={() => setModal(true)}>Modal</S.Button>
            </S.Stack>
            <S.Stack direction="row" gap={4} align="center">
              <S.CountBadge count={4} label="4 unread"><S.IconButton label="Notifications" variant="secondary"><InfoIcon /></S.IconButton></S.CountBadge>
              <S.CountBadge count={120}><S.Avatar name="Ana Ruiz" /></S.CountBadge>
              <S.CountBadge dot tone="success"><S.Avatar name="Luis Peña" shape="rounded" /></S.CountBadge>
              <S.AvatarGroup max={4}>{names.slice(0, 7).map((n) => <S.Avatar key={n} name={n} size="sm" />)}</S.AvatarGroup>
            </S.Stack>
          </S.Card>

          <S.Card title="Café Pitic" subtitle="Hermosillo · Open now" media={<img src={photos[0]} alt="" />}
            action={<S.IconButton label="Favorite"><StarIcon /></S.IconButton>}
            footer={<><S.Button variant="ghost">Details</S.Button><S.Button>Add stamp</S.Button></>}>
            <S.Text variant="small" tone="muted">8 of 10 stamps. Two more for a free coffee.</S.Text>
            <S.MobileStepper steps={4} active={step}
              back={<S.Button size="sm" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</S.Button>}
              next={<S.Button id="next" size="sm" variant="ghost" disabled={step === 3} onClick={() => setStep(step + 1)}>Next</S.Button>} />
          </S.Card>

          <S.Card title="Navigation">
            <S.Tabs variant="pills" label="Range" items={[{ id: "d", label: "Day", content: null }, { id: "w", label: "Week", content: null }, { id: "m", label: "Month", content: null, disabled: true }]} />
            <S.Tabs orientation="vertical" label="Settings" items={[
              { id: "p", label: "Profile", content: <S.Text variant="small">Business name, logo, hours.</S.Text> },
              { id: "c", label: "Cards", content: <S.Text variant="small">Stamps per reward.</S.Text> },
              { id: "t", label: "Team", content: <S.Text variant="small">Cashiers and roles.</S.Text> },
            ]} />
            <S.Paper outlined elevation={0} radius="lg" style={{ overflow: "hidden" }}>
              <S.BottomNav items={["Home", "Scan", "Rewards", "Profile"].map((l, i) => ({
                label: l, icon: [<StarIcon />, <PlusIcon />, <CheckCircleIcon />, <InfoIcon />][i], active: nav === l, onClick: () => setNav(l), badge: l === "Rewards" ? 2 : undefined,
              }))} />
            </S.Paper>
            <S.Stack direction="row" gap={4} align="center" justify="space-between">
              <S.Fab label="New customer" extended><PlusIcon /></S.Fab>
              <S.SpeedDial label="Quick actions" actions={[
                { label: "Schedule", icon: <CalendarIcon />, onClick: () => log("dial:schedule") },
                { label: "Clock in", icon: <ClockIcon />, onClick: () => log("dial:clock") },
              ]} />
            </S.Stack>
          </S.Card>
        </S.Grid>

        <S.Grid minChildWidth={300} gap={6}>
          <S.Card title="Image list">
            <S.ImageList columns={3} rowHeight={90} variant="quilted" items={[
              { src: photos[0], alt: "Latte", title: "Latte", cols: 2, rows: 2 }, { src: photos[1], alt: "Pan" }, { src: photos[2], alt: "Tea" },
              { src: photos[3], alt: "Cake" }, { src: photos[4], alt: "Beans", title: "Beans", cols: 2 },
            ]} />
          </S.Card>
          <S.Card title="Masonry">
            <S.Masonry columns={2} gap={2}>
              {[60, 110, 80, 50, 95, 70].map((h, i) => <S.Box key={i} bg={i % 2 ? "sky-soft" : "primary-soft"} radius="md" p={3} style={{ height: h }}><S.Text variant="small">{i + 1}</S.Text></S.Box>)}
            </S.Masonry>
          </S.Card>
          <S.Card title="Transitions and lists">
            <S.Button id="collapse" variant="secondary" size="sm" onClick={() => setCollapse(!collapse)} aria-expanded={collapse}>{collapse ? "Hide" : "Show"} details</S.Button>
            <S.Collapse in={collapse}><S.Paper tone="sunken" elevation={0} padding={4} radius="md"><S.Text variant="small" id="collapsed-text">Stamps expire after 12 months without a visit.</S.Text></S.Paper></S.Collapse>
            <S.List subheader="Recent" dense>
              <S.ListItem title="Ana Ruiz" description="Today" selected onClick={() => {}} />
              <S.ListItem title="Luis Peña" description="Yesterday" onClick={() => {}} />
              <S.ListItem title="Archived" disabled onClick={() => {}} />
            </S.List>
          </S.Card>
        </S.Grid>
      </S.Stack>

      <S.Snackbar open={snack} onClose={() => setSnack(false)} message="Customer archived" action={{ label: "Undo", onClick: () => log("undo") }} />
      <S.Backdrop open={busy} label="Saving"><S.Spinner /></S.Backdrop>
      <S.Modal open={modal} onClose={() => setModal(false)} label="Custom panel">
        <S.Paper padding={6} elevation={2} style={{ width: 320 }}><S.Text variant="h3">Custom modal</S.Text><S.Text variant="small" tone="muted">Bring your own layout.</S.Text></S.Paper>
      </S.Modal>
    </S.Container>
  );
}
