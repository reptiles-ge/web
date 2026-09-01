import type { AppLocale } from "@/i18n/routing";

export const PREFIXED_LOCALES = ["en", "ru", "tr"] as const;

export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];

const OPEN_GRAPH_LOCALE: Record<AppLocale, string> = {
  ka: "ka_GE",
  en: "en_US",
  ru: "ru_RU",
  tr: "tr_TR",
};

const GEORGIA_NAME: Record<AppLocale, string> = {
  ka: "საქართველო",
  en: "Georgia",
  ru: "Грузия",
  tr: "Gürcistan",
};

const CAUCASUS_NAME: Record<AppLocale, string> = {
  ka: "კავკასია",
  en: "Caucasus",
  ru: "Кавказ",
  tr: "Kafkasya",
};

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (PREFIXED_LOCALES as readonly string[]).includes(value);
}

export function openGraphLocale(locale: string) {
  if (locale in OPEN_GRAPH_LOCALE) {
    return OPEN_GRAPH_LOCALE[locale as AppLocale];
  }
  return OPEN_GRAPH_LOCALE.ka;
}

export function georgiaPlaceName(locale: string) {
  if (locale in GEORGIA_NAME) {
    return GEORGIA_NAME[locale as AppLocale];
  }
  return GEORGIA_NAME.ka;
}

export function caucasusPlaceName(locale: string) {
  if (locale in CAUCASUS_NAME) {
    return CAUCASUS_NAME[locale as AppLocale];
  }
  return CAUCASUS_NAME.ka;
}

export function pickLocalized(
  text: { ka: string; en: string; ru?: string; tr?: string },
  locale: string,
) {
  if (locale === "ka") return text.ka;
  if (locale === "ru" && text.ru) return text.ru;
  if (locale === "tr" && text.tr) return text.tr;
  return text.en;
}
