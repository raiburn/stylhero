// A few Lucide icons (ISC license) inlined so the package has no icon dependency.
// GitHubIcon and LinkedInIcon are brand marks (trademarks of their owners), used only to link to profiles.
// See THIRD_PARTY_NOTICES.md for the Lucide license and trademark notes.
import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const InfoIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
);
export const CheckCircleIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);
export const WarningIcon = () => (
  <svg {...base}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
);
export const AlertCircleIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
);
export const XIcon = () => (
  <svg {...base}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

export const toneIcons = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  danger: AlertCircleIcon,
};

export const CheckIcon = () => (
  <svg {...base}><path d="M20 6 9 17l-5-5" /></svg>
);
export const ChevronDownIcon = () => (
  <svg {...base}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronLeftIcon = () => (
  <svg {...base}><path d="m15 18-6-6 6-6" /></svg>
);
export const ChevronRightIcon = () => (
  <svg {...base}><path d="m9 18 6-6-6-6" /></svg>
);
export const StarIcon = () => (
  <svg {...base}><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
);
export const TrendUpIcon = () => (
  <svg {...base}><path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" /></svg>
);
export const TrendDownIcon = () => (
  <svg {...base}><path d="M16 17h6v-6" /><path d="m22 17-8.5-8.5-5 5L2 7" /></svg>
);
export const PlusIcon = () => (
  <svg {...base}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);
export const MinusIcon = () => (
  <svg {...base}><path d="M5 12h14" /></svg>
);
export const CalendarIcon = () => (
  <svg {...base}><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
);
export const ClockIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
export const ArrowUpIcon = () => (
  <svg {...base}><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
);
export const ArrowDownIcon = () => (
  <svg {...base}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
);
export const ArrowUpDownIcon = () => (
  <svg {...base}><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
);
export const SearchIcon = () => (
  <svg {...base}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

type IconProps = SVGProps<SVGSVGElement>;
export const ArrowUpRightIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

// Brand marks (filled), which Lucide no longer ships.
const brand: SVGProps<SVGSVGElement> = { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };
export const GitHubIcon = (p: IconProps) => (
  <svg {...brand} {...p}><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" /></svg>
);
export const LinkedInIcon = (p: IconProps) => (
  <svg {...brand} {...p}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
);
