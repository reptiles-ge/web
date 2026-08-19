import type { AppLocale } from "@/i18n/routing";
import { SITE_TIME_ZONE } from "@/lib/siteTime";
import { tz } from "@date-fns/tz";
import { format, isValid, parseISO } from "date-fns";
import { enUS, ka } from "date-fns/locale";

export function formatContentDate(isoDate: string, locale: AppLocale): string {
  const date = isoDate.includes("T")
    ? parseISO(isoDate)
    : parseISO(`${isoDate}T00:00:00+04:00`);
  if (!isValid(date)) return isoDate;

  return format(date, "d MMMM yyyy", {
    in: tz(SITE_TIME_ZONE),
    locale: locale === "ka" ? ka : enUS,
  });
}

export function formatPhotoDate(value: string, locale: AppLocale): string {
  const trimmed = value.trim();
  const dateLocale = locale === "ka" ? ka : enUS;

  if (/^\d{4}$/.test(trimmed)) return trimmed;

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const date = parseISO(`${trimmed}-01T00:00:00+04:00`);
    if (!isValid(date)) return trimmed;
    return format(date, "LLLL yyyy", {
      in: tz(SITE_TIME_ZONE),
      locale: dateLocale,
    });
  }

  return formatContentDate(trimmed, locale);
}
