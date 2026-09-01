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

export function atlasDatasetName(locale: string) {
  return pickLocalized(
    {
      ka: "საქართველოს ცხოველთა ატლასი",
      en: "Atlas of animals of Georgia",
      ru: "Атлас животных Грузии",
      tr: "Gürcistan hayvanları atlası",
    },
    locale,
  );
}

export function atlasVariableName(
  key: "speciesProfiles" | "regions" | "venomousSpecies",
  locale: string,
) {
  const copy = {
    speciesProfiles: {
      ka: "სახეობების პროფილები",
      en: "Species profiles",
      ru: "Профили видов",
      tr: "Tür profilleri",
    },
    regions: {
      ka: "რეგიონები",
      en: "Regions",
      ru: "Регионы",
      tr: "Bölgeler",
    },
    venomousSpecies: {
      ka: "შხამიანი სახეობები",
      en: "Venomous species",
      ru: "Ядовитые виды",
      tr: "Zehirli türler",
    },
  } as const;
  return pickLocalized(copy[key], locale);
}

export function allRightsReservedLabel(locale: string) {
  return pickLocalized(
    {
      ka: "ყველა უფლება დაცულია",
      en: "All rights reserved",
      ru: "Все права защищены",
      tr: "Tüm hakları saklıdır",
    },
    locale,
  );
}

export function georgiaReptilesLabel(locale: string) {
  return pickLocalized(
    {
      ka: "საქართველოს ქვეწარმავლები",
      en: "Georgia reptiles",
      ru: "Рептилии Грузии",
      tr: "Gürcistan sürüngenleri",
    },
    locale,
  );
}

