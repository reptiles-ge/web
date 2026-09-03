import { tz } from "@date-fns/tz";
import { format, isValid, parseISO } from "date-fns";

export const SITE_TIME_ZONE = "Asia/Tbilisi";

const siteTz = tz(SITE_TIME_ZONE);

export function parseToSiteDateTime(raw: string): null | string {
  const parsed = raw.includes("T")
    ? parseISO(raw)
    : parseISO(`${raw}T00:00:00+04:00`);
  if (!isValid(parsed)) return null;
  return toSiteDateTime(parsed);
}

export function toSiteDateTime(value: Date): string {
  return format(value, "yyyy-MM-dd'T'HH:mm:ssXXX", { in: siteTz });
}
