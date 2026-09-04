export const SITE_TIME_ZONE = "Asia/Tbilisi";

const SITE_DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  timeZone: SITE_TIME_ZONE,
  timeZoneName: "longOffset",
  year: "numeric",
});

export function parseToSiteDateTime(raw: string): null | string {
  const parsed = raw.includes("T")
    ? new Date(raw)
    : new Date(`${raw}T00:00:00+04:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return toSiteDateTime(parsed);
}

export function toSiteDateTime(value: Date): string {
  const parts = SITE_DATE_TIME_FORMAT.formatToParts(value);

  return `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}T${part(parts, "hour")}:${part(parts, "minute")}:${part(parts, "second")}${offsetFromParts(parts)}`;
}

function offsetFromParts(parts: Intl.DateTimeFormatPart[]): string {
  const raw = part(parts, "timeZoneName") || "GMT+04:00";
  const match = raw.match(/([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return "+04:00";
  const hours = match[2].padStart(2, "0");
  const minutes = (match[3] ?? "00").padStart(2, "0");
  return `${match[1]}${hours}:${minutes}`;
}

function part(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((item) => item.type === type)?.value ?? "";
}
