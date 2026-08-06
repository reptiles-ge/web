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
