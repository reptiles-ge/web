import type { AppLocale } from "@/i18n/routing";

import { SITE_TIME_ZONE } from "@/lib/siteTime";

const DATE_PARTS = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
});

const MONTHS: Record<AppLocale, string[]> = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ka: [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  tr: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
};

const MONTHS_STANDALONE: Record<AppLocale, string[]> = {
  ...MONTHS,
  ru: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ],
};

const MONTHS_SHORT: Record<AppLocale, string[]> = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  ka: [
    "იან",
    "თებ",
    "მარ",
    "აპრ",
    "მაი",
    "ივნ",
    "ივლ",
    "აგვ",
    "სექ",
    "ოქტ",
    "ნოე",
    "დეკ",
  ],
  ru: [
    "янв.",
    "февр.",
    "мар.",
    "апр.",
    "мая",
    "июн.",
    "июл.",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек.",
  ],
  tr: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
};

export function formatContentDate(isoDate: string, locale: AppLocale): string {
  const parts = dateParts(isoDate);
  if (!parts) return isoDate;
  return `${parts.day} ${MONTHS[locale][parts.monthIndex]} ${parts.year}`;
}

export function formatContentDateShort(
  isoDate: string,
  locale: AppLocale,
  {
    now,
    omitCurrentYear = false,
  }: { now?: Date; omitCurrentYear?: boolean } = {},
): string {
  const parts = dateParts(isoDate);
  if (!parts) return isoDate;
  const dayMonth = `${parts.day} ${MONTHS_SHORT[locale][parts.monthIndex]}`;
  if (omitCurrentYear) {
    const current = dateParts((now ?? new Date()).toISOString());
    if (current?.year === parts.year) return dayMonth;
  }
  return `${dayMonth} ${parts.year}`;
}

export function formatContentMonth(isoDate: string, locale: AppLocale): string {
  const parts = dateParts(isoDate);
  if (!parts) return isoDate;
  return `${MONTHS_STANDALONE[locale][parts.monthIndex]} ${parts.year}`;
}

export function formatPhotoDate(value: string, locale: AppLocale): string {
  const trimmed = value.trim();

  if (/^\d{4}$/.test(trimmed)) return trimmed;

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const parts = dateParts(`${trimmed}-01`);
    if (!parts) return trimmed;
    return `${MONTHS_STANDALONE[locale][parts.monthIndex]} ${parts.year}`;
  }

  return formatContentDate(trimmed, locale);
}

function dateParts(
  raw: string,
): null | { day: number; monthIndex: number; year: string } {
  const parsed = raw.includes("T")
    ? new Date(raw)
    : new Date(`${raw}T00:00:00+04:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  const parts = DATE_PARTS.formatToParts(parsed);
  const year = parts.find((item) => item.type === "year")?.value;
  const month = parts.find((item) => item.type === "month")?.value;
  const day = parts.find((item) => item.type === "day")?.value;
  if (!year || !month || !day) return null;

  return {
    day: Number(day),
    monthIndex: Number(month) - 1,
    year,
  };
}
