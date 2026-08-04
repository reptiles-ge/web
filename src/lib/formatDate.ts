import type { AppLocale } from "@/i18n/routing";

export function formatContentDate(isoDate: string, locale: AppLocale): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
