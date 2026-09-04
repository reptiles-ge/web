import type { AppLocale } from "@/i18n/routing";

import { SITE_TIME_ZONE } from "@/lib/siteTime";

const DATE_LOCALE = {
  en: "en-US",
  ka: "ka-GE",
  ru: "ru-RU",
  tr: "tr-TR",
} as const;

const CONTENT_DATE_FORMAT = {
  en: contentFormatter("en"),
  ka: contentFormatter("ka"),
  ru: contentFormatter("ru"),
  tr: contentFormatter("tr"),
} as const;

const PHOTO_MONTH_FORMAT = {
  en: monthFormatter("en"),
  ka: monthFormatter("ka"),
  ru: monthFormatter("ru"),
  tr: monthFormatter("tr"),
} as const;

export function formatContentDate(isoDate: string, locale: AppLocale): string {
  const date = parseDisplayDate(isoDate);
  if (!date) return isoDate;
  return CONTENT_DATE_FORMAT[locale].format(date);
}

export function formatPhotoDate(value: string, locale: AppLocale): string {
  const trimmed = value.trim();

  if (/^\d{4}$/.test(trimmed)) return trimmed;

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const date = parseDisplayDate(`${trimmed}-01`);
    if (!date) return trimmed;
    return PHOTO_MONTH_FORMAT[locale].format(date);
  }

  return formatContentDate(trimmed, locale);
}

function contentFormatter(locale: AppLocale) {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
  });
}

function monthFormatter(locale: AppLocale) {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    month: "long",
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
  });
}

function parseDisplayDate(raw: string): Date | null {
  const parsed = raw.includes("T")
    ? new Date(raw)
    : new Date(`${raw}T00:00:00+04:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}
