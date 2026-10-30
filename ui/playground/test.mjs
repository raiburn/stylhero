import puppeteer from "puppeteer-core";
// Clicks, types and tabs through the playground in headless Chrome and checks each component behaves.
// npm test   (set CHROME_PATH if Chrome is not in the default Windows location)
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const url = "file:///" + fileURLToPath(new URL("./index.html", import.meta.url)).replace(/\\/g, "/");
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.type() + ": " + m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });

const shots = fileURLToPath(new URL("./screenshots/", import.meta.url));
mkdirSync(shots, { recursive: true });
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const events = () => page.evaluate(() => window.events.slice());
const center = (sel) => page.$eval(sel, (e) => e.scrollIntoView({ block: "center" }));
const active = () => page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName);

await page.screenshot({ path: shots + "light.png", fullPage: true });

// Tooltip
await page.hover("#help"); await wait(450);
const tip = await page.$eval(".sh-tooltip", (e) => e.textContent).catch(() => null);
const described = await page.$eval("#help", (e) => !!e.getAttribute("aria-describedby"));
check("Tooltip shows on hover and is linked by aria-describedby", tip === "Help" && described, `text=${tip}`);
await page.mouse.move(600, 600); await wait(100);
check("Tooltip hides on leave", !(await page.$(".sh-tooltip")));
await page.focus("#help"); await wait(50);
check("Tooltip shows on keyboard focus", !!(await page.$(".sh-tooltip")));
await page.keyboard.press("Escape"); await wait(50);
check("Tooltip closes on Esc", !(await page.$(".sh-tooltip")));

// Menu
await page.click("#menu"); await wait(100);
check("Menu opens on click", !!(await page.$('.sh-menu[role="menu"]')));
await page.screenshot({ path: shots + "menu.png", clip: { x: 760, y: 60, width: 520, height: 360 } });
await page.keyboard.press("ArrowDown"); await wait(30);
await page.keyboard.press("ArrowDown"); await wait(30);
const a1 = await active();
await page.keyboard.press("ArrowDown"); await wait(30);
const a2 = await active();
check("Menu arrow keys move focus and skip disabled items", a1.startsWith("Import") && a2.startsWith("Delete"), `${a1} -> ${a2}`);
await page.keyboard.press("Escape"); await wait(80);
check("Menu Esc closes and returns focus to trigger", !(await page.$(".sh-menu")) && (await active()) === "More actions");
await page.keyboard.press("Enter"); await wait(100);
const first = await active();
await page.keyboard.press("Enter"); await wait(80);
check("Menu: Enter opens with first item focused, Enter selects", first.startsWith("Export") && (await events()).includes("export") && !(await page.$(".sh-menu")), first);
await page.click("#menu"); await wait(80);
await page.keyboard.type("d"); await wait(80);
check("Menu typeahead jumps to matching item", (await active()).startsWith("Delete"), await active());
await page.mouse.click(20, 800); await wait(80);
check("Menu closes on outside click", !(await page.$(".sh-menu")));

// Combobox
await page.click("#city"); await wait(80);
const all = await page.$$eval(".sh-listbox__option", (o) => o.length);
await page.type("#city", "no"); await wait(80);
const filtered = await page.$$eval(".sh-listbox__option", (o) => o.map((x) => x.textContent));
await page.screenshot({ path: shots + "combo.png", clip: { x: 0, y: 330, width: 700, height: 360 } });
await page.keyboard.press("Enter"); await wait(80);
const val = await page.$eval("#city", (e) => e.value);
check("Combobox opens with all options, filters as you type", all === 6 && filtered.length === 1 && filtered[0] === "Nogales", `${all} -> ${filtered.join("|")}`);
check("Combobox Enter picks the highlighted option", val === "Nogales" && (await events()).includes("city:Nogales"), val);
check("Combobox has listbox roles", await page.$eval("#city", (e) => e.getAttribute("role") === "combobox"));
await page.click("#city"); await wait(80);
await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown"); await wait(30);
const activeDesc = await page.$eval("#city", (e) => e.getAttribute("aria-activedescendant"));
check("Combobox arrow keys set aria-activedescendant (focus stays in input)", !!activeDesc && (await active()) === "INPUT", activeDesc);
await page.keyboard.press("Escape"); await wait(50);
check("Combobox Esc closes and keeps the value", !(await page.$(".sh-listbox")) && (await page.$eval("#city", (e) => e.value)) === "Nogales");

// Rating
const stars = await page.$$('#root .sh-rating label');
await stars[4].click(); await wait(30);
await page.keyboard.press("ArrowLeft"); await wait(30);
const ev = await events();
check("Rating click and arrow keys", ev.includes("rating:5") && ev.includes("rating:4"), ev.filter((e) => e.startsWith("rating")).join(","));

// Chips
await page.click('.sh-chip__remove[aria-label="Remove Coffee"]'); await wait(30);
const chipText = await page.$$eval(".sh-chip", (c) => c.map((x) => x.textContent));
check("Chip remove", !chipText.includes("Coffee"), chipText.join("|"));
await page.click('button.sh-chip__main[aria-pressed]'); await wait(30);
check("Filter chip toggles aria-pressed", (await page.$eval("button.sh-chip__main[aria-pressed]", (b) => b.getAttribute("aria-pressed"))) === "false");

// Slider
await page.focus(".sh-slider"); await page.keyboard.press("ArrowRight"); await wait(30);
check("Slider keyboard updates shown value", (await page.$eval(".sh-slider__label output", (o) => o.textContent)) === "3");

// Toggle group
const tg = await page.$$(".sh-toggle-group__item");
await tg[1].click(); await wait(30);
check("ToggleGroup single select", (await page.$$eval(".sh-toggle-group__item", (b) => b.map((x) => x.getAttribute("aria-pressed")).join())) === "false,true");

// Tabs (existing component)
const tabs = await page.$$('[role="tab"]');
await tabs[0].click(); await page.keyboard.press("ArrowRight"); await wait(30);
const sel = await page.$eval('[role="tab"][aria-selected="true"]', (t) => t.textContent);
const panel = await page.$eval('[role="tabpanel"]:not([hidden])', (p) => p.textContent);
await page.keyboard.press("End"); await wait(30);
const end = await page.$eval('[role="tab"][aria-selected="true"]', (t) => t.textContent);
check("Tabs arrow keys and End", sel === "Week" && panel.includes("84") && end === "Month", `${sel}/${end}`);

// Pagination
await page.click('.sh-pagination__item[aria-label="Next page"]'); await wait(30);
check("Pagination next", (await page.$eval('.sh-pagination__item[aria-current="page"]', (b) => b.textContent)) === "7");

// Accordion single
await page.click(".sh-accordion__item:nth-child(2) summary"); await wait(50);
const openState = await page.$$eval(".sh-accordion__item", (d) => d.map((x) => x.open).join());
check("Accordion single keeps one open", openState === "false,true", openState);

// Dialog (existing component)
await page.click("#open-dialog"); await wait(100);
check("Dialog opens as modal", await page.$eval(".sh-dialog", (d) => d.open && d.matches(":modal")));
await page.screenshot({ path: shots + "dialog.png" });
await page.keyboard.press("Escape"); await wait(80);
check("Dialog Esc closes", !(await page.$eval(".sh-dialog", (d) => d.open)));
await page.click("#open-dialog"); await wait(100);
await page.mouse.click(10, 10); await wait(80);
check("Dialog backdrop click closes", !(await page.$eval(".sh-dialog", (d) => d.open)));
await page.click("#open-dialog"); await wait(100);
await page.mouse.click(640, 450); await wait(80);
check("Dialog click inside stays open", await page.$eval(".sh-dialog", (d) => d.open));
await page.keyboard.press("Escape"); await wait(80);

// Drawer
await page.click("#open-drawer"); await wait(300);
check("Drawer opens", await page.$eval(".sh-drawer", (d) => d.open));
await page.screenshot({ path: shots + "drawer.png" });
await page.mouse.click(1200, 400); await wait(80);
check("Drawer backdrop click closes", !(await page.$eval(".sh-drawer", (d) => d.open)));

// Toast (existing component)
await page.click("#toast"); await wait(80);
check("Toast appears", (await page.$eval(".sh-toast", (t) => t.textContent).catch(() => "")) === "Stamp added");

// Popover
await page.click("#pop"); await wait(120);
const inPop = await page.evaluate(() => !!document.activeElement?.closest(".sh-popover"));
check("Popover opens and moves focus inside", !!(await page.$(".sh-popover")) && inPop);
await page.keyboard.press("Escape"); await wait(80);
check("Popover Esc closes", !(await page.$(".sh-popover")));

// List row click
await center(".sh-list__item:nth-child(2) button");
await page.click(".sh-list__item:nth-child(2) button"); await wait(30);
check("ListItem onClick", (await events()).includes("luis"));

await wait(4200);
check("Toast auto-dismisses after 4s", !(await page.$(".sh-toast")));

// ---------- v0.3 components (inside #more) ----------
const M = "#more ";
const text = (sel) => page.$eval(sel, (e) => e.textContent.trim()).catch(() => null);

// Combobox multiple
await center("#tags"); await page.click("#tags"); await page.type("#tags", "bak"); await wait(60);
await page.keyboard.press("Enter"); await wait(60);
const tagsNow = await page.$$eval(M + ".sh-combobox__tag", (t) => t.map((x) => x.textContent));
const stillOpen = !!(await page.$(".sh-listbox[aria-multiselectable]"));
await page.keyboard.press("Backspace"); await wait(40);
const afterBack = await page.$$eval(M + ".sh-combobox__tag", (t) => t.map((x) => x.textContent));
await page.keyboard.press("Escape"); await wait(40);
check("Combobox multiple: Enter adds a chip and stays open, Backspace removes the last", tagsNow.join() === "Coffee,Bakery" && stillOpen && afterBack.join() === "Coffee", `${tagsNow} -> ${afterBack}`);

// NumberInput
await center("#qty"); await page.focus("#qty");
for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowUp");
await wait(30);
check("NumberInput arrow keys step and clamp to max", (await page.$eval("#qty", (e) => e.value)) === "5" && (await page.$eval('#more button[aria-label="Increase"]', (b) => b.disabled)));

// CheckboxGroup select all
const mixed = await page.$eval(M + "fieldset:nth-of-type(2) input", (i) => i.indeterminate).catch(() => null);
const selAll = await page.$$(M + ".sh-fieldset input[type=checkbox]");
await selAll[0].click(); await wait(30);
const allOn = await page.$$eval(M + ".sh-fieldset input[type=checkbox]", (i) => i.every((x) => x.checked));
check("CheckboxGroup select-all is mixed, then checks everything", mixed === true && allOn, `mixed=${mixed}`);

// Textarea autoResize
const h0 = await page.$eval("#auto", (e) => e.offsetHeight);
await page.type("#auto", "one\ntwo\nthree\nfour"); await wait(30);
const h1 = await page.$eval("#auto", (e) => e.offsetHeight);
check("Textarea autoResize grows with content", h1 > h0 + 40, `${h0} -> ${h1}`);

// Loading button
await page.click("#save"); await wait(30);
check("Button loading is busy and disabled", await page.$eval("#save", (b) => b.disabled && b.getAttribute("aria-busy") === "true" && !!b.querySelector(".sh-spinner")));

// DatePicker
await center("#date"); await page.click("#date"); await wait(120);
const dayFocused = await page.evaluate(() => document.activeElement?.classList.contains("sh-calendar__day"));
await page.keyboard.press("ArrowRight"); await wait(30);
if (await page.evaluate(() => document.activeElement.disabled)) { await page.keyboard.press("ArrowRight"); await wait(30); }
const focusedLabel = await page.evaluate(() => document.activeElement.getAttribute("aria-label"));
await page.keyboard.press("Enter"); await wait(80);
const dateText = await text("#date");
check("DatePicker opens with a day focused, arrows move, Enter picks and closes", dayFocused && !(await page.$(".sh-date-popover")) && dateText !== "Pick a date" && (await events()).some((e) => e.startsWith("date:")), `${focusedLabel} -> ${dateText}`);
check("DatePicker returns focus to the field", (await page.evaluate(() => document.activeElement?.id)) === "date");
await page.click("#date"); await wait(100);
await page.keyboard.press("PageDown"); await wait(40);
const month2 = await text(".sh-date-popover .sh-calendar__title");
const sundayDisabled = await page.$$eval(".sh-date-popover .sh-calendar__grid tbody tr", (rows) => rows.every((r) => r.children[0].querySelector("button").disabled));
await page.keyboard.press("Escape"); await wait(60);
check("Calendar PageDown changes month; Sundays disabled; Esc closes", !!month2 && sundayDisabled && !(await page.$(".sh-date-popover")), month2);

// DateRangePicker preset
await page.click("#range"); await wait(100);
await page.$$eval(".sh-date-range__presets button", (b) => b[0].click()); await wait(60);
check("DateRangePicker preset fills a range", /–|-/.test(await text("#range")) && !(await page.$(".sh-date-popover")), await text("#range"));

// TimePicker
await center("#time"); await page.click("#time"); await page.type("#time", "8:30"); await wait(60);
await page.keyboard.press("Enter"); await wait(40);
check("TimePicker filters and picks", /8:30/.test(await page.$eval("#time", (e) => e.value)), await page.$eval("#time", (e) => e.value));

// DataGrid
const grid = M + ".sh-grid-table ";
const bodyRows = () => page.$$eval(grid + "tbody tr", (r) => r.length);
await center(grid);
await page.type(grid + ".sh-grid-table__search input", "nog"); await wait(60);
const nogRows = await bodyRows();
await page.$eval(grid + ".sh-grid-table__search input", (i) => { i.select(); });
await page.keyboard.press("Backspace"); await wait(60);
check("DataGrid search filters rows", nogRows === 3, `${nogRows} rows`);
const sortBtn = await page.$$(grid + "th .sh-grid-table__sort");
await sortBtn[2].click(); await wait(40);
const asc = await page.$$eval(grid + "tbody tr td:nth-child(4)", (c) => c.map((x) => +x.textContent));
await sortBtn[2].click(); await wait(40);
const desc = await page.$$eval(grid + "tbody tr td:nth-child(4)", (c) => c.map((x) => +x.textContent));
const ariaSort = await page.$eval(grid + "th:nth-child(4)", (t) => t.getAttribute("aria-sort"));
check("DataGrid sorts asc then desc with aria-sort", asc[0] <= asc[asc.length - 1] && desc[0] >= desc[desc.length - 1] && ariaSort === "descending", `${asc} / ${desc}`);
await page.click(grid + "thead .sh-grid-table__check input"); await wait(40);
check("DataGrid select-all selects the page", (await text(grid + ".sh-grid-table__selected")) === "5 selected" && (await events()).includes("sel:5"));
const pg1 = await text(grid + ".sh-grid-table__range");
await page.click(grid + '.sh-pagination__item[aria-label="Next page"]'); await wait(40);
check("DataGrid paginates", pg1 === "1–5 of 12" && (await text(grid + ".sh-grid-table__range")) === "6–10 of 12", pg1);
await page.$$eval(grid + ".sh-grid-table__actions button", (b) => b.find((x) => x.textContent === "Columns").click()); await wait(120);
await page.$$eval(".sh-popover .sh-check", (l) => l.find((x) => x.textContent === "City").querySelector("input").click()); await wait(40);
const headers = await page.$$eval(grid + "thead th", (t) => t.map((x) => x.textContent.trim()).filter(Boolean));
await page.keyboard.press("Escape"); await wait(60);
check("DataGrid Columns hides a column", !headers.includes("City") && headers.includes("Name"), headers.join("|"));

// TreeView keyboard
await center(M + '[role="tree"]');
await page.focus(M + '[role="treeitem"][tabindex="0"]');
await page.keyboard.press("ArrowDown"); await wait(20);
const t1 = await page.evaluate(() => document.activeElement.querySelector(".sh-tree__label").textContent);
await page.keyboard.press("ArrowRight"); await wait(20);
const expandedNow = await page.evaluate(() => document.activeElement.getAttribute("aria-expanded"));
await page.keyboard.press("ArrowDown"); await wait(20);
const t2 = await page.evaluate(() => document.activeElement.querySelector(".sh-tree__label").textContent);
await page.keyboard.press("ArrowLeft"); await wait(20);
const t3 = await page.evaluate(() => document.activeElement.querySelector(".sh-tree__label").textContent);
await page.keyboard.press(" "); await wait(20);
check("TreeView arrows move, Right expands, Left goes to parent, Space selects", t1 === "Hermosillo" && expandedNow === "true" && t2 === "Centro" && t3 === "Hermosillo" && (await events()).includes("tree:hmo"), `${t1} ${expandedNow} ${t2} ${t3}`);

// TransferList
const panes = () => page.$$eval(M + ".sh-transfer__list", (l) => l.map((x) => x.children.length).join("/"));
const p0 = await panes();
await page.$$eval(M + ".sh-transfer__list:first-of-type .sh-check", (l) => l.find((x) => x.textContent === "Mocha").querySelector("input").click());
await page.click('#more button[aria-label="Move selected right"]'); await wait(40);
check("TransferList moves checked items", p0 === "3/1" && (await panes()) === "2/2", `${p0} -> ${await panes()}`);

// Alerts, snackbar, backdrop, modal
await center("#closable"); await page.click("#closable .sh-alert__close"); await wait(40);
check("Alert onClose removes it", !(await page.$("#closable")));
await page.click("#snack"); await wait(80);
const snackText = await text(".sh-toast .sh-toast__body");
await page.click(".sh-toast__action"); await wait(60);
check("Snackbar shows; its action runs and closes it", snackText === "Customer archived" && (await events()).includes("undo") && !(await page.$(".sh-toast")), snackText);
await page.click("#busy"); await wait(80);
const busyOpen = await page.$eval(".sh-backdrop", (d) => d.open && d.matches(":modal"));
await page.screenshot({ path: shots + "backdrop.png" });
await wait(700);
check("Backdrop blocks the page, then closes", busyOpen && !(await page.$eval(".sh-backdrop", (d) => d.open)));
await page.click("#modal"); await wait(80);
const modalOpen = await page.$eval(".sh-modal", (d) => d.open);
await page.keyboard.press("Escape"); await wait(60);
check("Modal opens and Esc closes", modalOpen && !(await page.$eval(".sh-modal", (d) => d.open)));

// SpeedDial
await center(M + ".sh-speed-dial__main");
await page.click(M + ".sh-speed-dial__main"); await wait(60);
const dialOpen = await page.$eval(M + ".sh-speed-dial__main", (b) => b.getAttribute("aria-expanded"));
const dialVisible = await page.$eval(M + ".sh-speed-dial__actions", (u) => !u.hidden);
await page.screenshot({ path: shots + "speeddial.png", clip: await page.$eval(M + ".sh-speed-dial", (e) => { const r = e.getBoundingClientRect(); return { x: r.x - 160, y: r.y - 10, width: 240, height: r.height + 20 }; }) });
await page.keyboard.press("Escape"); await wait(40);
const dialFocus = await active();
await page.click(M + ".sh-speed-dial__main"); await wait(60);
await page.click('#more .sh-speed-dial__actions button[aria-label="Schedule"]'); await wait(40);
check("SpeedDial opens, Esc closes with focus back, action runs", dialOpen === "true" && dialVisible && dialFocus === "Quick actions" && (await events()).includes("dial:schedule"), dialFocus);

// BottomNav, MobileStepper, Tabs variants, Collapse, CountBadge
await page.$$eval(M + ".sh-bottom-nav__item", (b) => b[2].click()); await wait(30);
check("BottomNav marks the active item", (await page.$eval(M + '.sh-bottom-nav__item[aria-current="page"]', (b) => b.textContent)).includes("Rewards"));
await page.click("#next"); await wait(30);
check("MobileStepper advances", (await page.$$eval(M + ".sh-mobile-stepper__dot", (d) => d.findIndex((x) => x.classList.contains("sh-mobile-stepper__dot--on")))) === 2);
await page.focus(M + '.sh-tabs--pills [role="tab"][aria-selected="true"]'); await page.keyboard.press("End"); await wait(30);
check("Tabs skip disabled tabs", (await page.$eval(M + '.sh-tabs--pills [role="tab"][aria-selected="true"]', (t) => t.textContent)) === "Week");
await page.focus(M + '.sh-tabs--vertical [role="tab"][aria-selected="true"]'); await page.keyboard.press("ArrowDown"); await wait(30);
check("Vertical tabs use Up/Down", (await page.$eval(M + '.sh-tabs--vertical [role="tab"][aria-selected="true"]', (t) => t.textContent)) === "Cards");
await center("#collapse"); await page.click("#collapse"); await wait(350);
const collH = await page.$eval("#collapsed-text", (e) => e.closest(".sh-transition").getBoundingClientRect().height);
check("Collapse expands to its content height", collH > 30, `${collH}px`);
check("CountBadge caps at 99+", (await page.$$eval(M + ".sh-count-badge__badge", (b) => b.map((x) => x.textContent))).includes("99+"));

// Charts
await center(M + ".sh-chart");
const band = await page.$eval(M + ".sh-chart .sh-chart__canvas", (c) => { const r = c.getBoundingClientRect(); return { x: r.x + 90, y: r.y + 120 }; });
await page.mouse.move(band.x, band.y); await wait(60);
const tipText = await text(M + ".sh-chart__tooltip");
await page.screenshot({ path: shots + "charts.png", clip: await page.$eval(M + ".sh-chart", (e) => { const r = e.closest(".sh-card").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }) });
check("BarChart hover shows a tooltip with both series", !!tipText && tipText.includes("New") && tipText.includes("Returning"), tipText);
await page.mouse.move(5, 5);
await page.$eval(M + ".sh-chart .sh-chart__toggle", (b) => b.click()); await wait(40);
check("Chart 'Show as table' shows the data", (await page.$$eval(M + ".sh-chart .sh-chart__table tbody tr", (r) => r.length)) === 7);
await page.$eval(M + ".sh-chart .sh-chart__toggle", (b) => b.click()); await wait(40);
await center(M + ".sh-pie");
await page.hover(M + ".sh-pie .sh-chart__legend li:nth-child(2)"); await wait(40);
check("PieChart legend hover highlights the slice", /26%/.test(await text(M + ".sh-pie__center")), await text(M + ".sh-pie__center"));

// Dark mode + mobile screenshots
await page.evaluate(() => window.scrollTo(0, 0)); await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]); await wait(400);
await page.screenshot({ path: shots + "dark.png", fullPage: true });
await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
await page.setViewport({ width: 390, height: 844 });
await wait(100);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check("No horizontal scroll at 390px", overflow <= 0, `overflow ${overflow}px`);
await page.screenshot({ path: shots + "mobile.png", fullPage: true });

console.log(results.join("\n"));
console.log(`\n${results.filter((r) => r.startsWith("PASS")).length}/${results.length} passed`);
console.log(errors.length ? "Console:\n" + errors.join("\n") : "No console errors or warnings.");
await browser.close();
if (results.some((r) => r.startsWith("FAIL")) || errors.length) process.exit(1);
