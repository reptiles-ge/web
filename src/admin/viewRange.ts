import { siteDay } from "@/lib/siteTime";

export type ViewRange = { from?: string; to?: string };

const VIEW_DAY = /^\d{4}-\d{2}-\d{2}$/;

export const VIEW_PRESET_DAYS = [
  { days: 1, label: "Today" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
] as const;

export const VIEW_RANGE_URL = { from: readViewDay, to: readViewDay };

export function lastDays(days: number, now = new Date()) {
  const to = siteDay(now);
  const first = new Date(`${to}T00:00:00Z`);
  first.setUTCDate(first.getUTCDate() - (days - 1));
  return { from: first.toISOString().slice(0, 10), to };
}

export function readViewDay(value: string) {
  if (!VIEW_DAY.test(value)) return undefined;
  const time = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(time)) return undefined;
  return new Date(time).toISOString().slice(0, 10) === value
    ? value
    : undefined;
}
