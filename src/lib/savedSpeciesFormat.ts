import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

export const RISK_SWATCH: Record<
  DangerLevel,
  { dot: string; soft: string; text: string }
> = {
  Harmless: { dot: "#2f6b4f", soft: "#eef2ec", text: "#24543d" },
  High: { dot: "#b84336", soft: "#f8ebe7", text: "#7d2f25" },
  Moderate: { dot: "#7d6224", soft: "#f5efe1", text: "#5e4a1b" },
};

const AGO_UNITS = [
  ["agoYears", 365 * 24 * 3600],
  ["agoMonths", 30 * 24 * 3600],
  ["agoWeeks", 7 * 24 * 3600],
  ["agoDays", 24 * 3600],
  ["agoHours", 3600],
  ["agoMinutes", 60],
] as const;

export function isVenomousLevel(level: DangerLevel | null) {
  return level === "High" || level === "Moderate";
}

export function printDate(locale: AppLocale, date: Date) {
  const supported = Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0;
  return new Intl.DateTimeFormat(
    supported ? locale : "en-GB",
    supported
      ? { dateStyle: "long" }
      : { day: "2-digit", month: "2-digit", year: "numeric" },
  )
    .format(date)
    .replaceAll("/", ".");
}

export function savedAgoMessage(savedAt: number, now: number) {
  const seconds = Math.max(0, Math.round((now - savedAt) / 1000));
  for (const [key, size] of AGO_UNITS) {
    if (seconds >= size) return { count: Math.floor(seconds / size), key };
  }
  return { count: 0, key: "agoNow" as const };
}
