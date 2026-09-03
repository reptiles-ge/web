import { tz } from "@date-fns/tz";
import { format, isValid, parseISO } from "date-fns";
import { enUS, ka, ru, tr } from "date-fns/locale";

import type { AppLocale } from "@/i18n/routing";

import { SITE_TIME_ZONE } from "@/lib/siteTime";

const DATE_LOCALE = {
  en: enUS,
  ka,
  ru,
  tr,
} as const;

export function formatContentDate(isoDate: string, locale: AppLocale): string {
  const date = isoDate.includes("T")
    ? parseISO(isoDate)
    : parseISO(`${isoDate}T00:00:00+04:00`);
  if (!isValid(date)) return isoDate;

  return format(date, "d MMMM yyyy", {
    in: tz(SITE_TIME_ZONE),
    locale: dateFnsLocale(locale),
  });
}

export function formatPhotoDate(value: string, locale: AppLocale): string {
  const trimmed = value.trim();
  const dateLocale = dateFnsLocale(locale);

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

function dateFnsLocale(locale: AppLocale) {
  return DATE_LOCALE[locale];
}
