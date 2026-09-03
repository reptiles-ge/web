import type { AppLocale } from "@/i18n/routing";

export const PREFIXED_LOCALES = ["en", "ru", "tr"] as const;

export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];

const OPEN_GRAPH_LOCALE: Record<AppLocale, string> = {
  en: "en_US",
  ka: "ka_GE",
  ru: "ru_RU",
  tr: "tr_TR",
};

const GEORGIA_NAME: Record<AppLocale, string> = {
  en: "Georgia",
  ka: "საქართველო",
  ru: "Грузия",
  tr: "Gürcistan",
};

const CAUCASUS_NAME: Record<AppLocale, string> = {
  en: "Caucasus",
  ka: "კავკასია",
  ru: "Кавказ",
  tr: "Kafkasya",
};

export function allRightsReservedLabel(locale: string) {
  return pickLocalized(
    {
      en: "All rights reserved",
      ka: "ყველა უფლება დაცულია",
      ru: "Все права защищены",
      tr: "Tüm hakları saklıdır",
    },
    locale,
  );
}

export function atlasDatasetName(locale: string) {
  return pickLocalized(
    {
      en: "Atlas of animals of Georgia",
      ka: "საქართველოს ცხოველთა ატლასი",
      ru: "Атлас животных Грузии",
      tr: "Gürcistan hayvanları atlası",
    },
    locale,
  );
}

export function atlasVariableName(
  key: "regions" | "speciesProfiles" | "venomousSpecies",
  locale: string,
) {
  const copy = {
    regions: {
      en: "Regions",
      ka: "რეგიონები",
      ru: "Регионы",
      tr: "Bölgeler",
    },
    speciesProfiles: {
      en: "Species profiles",
      ka: "სახეობების პროფილები",
      ru: "Профили видов",
      tr: "Tür profilleri",
    },
    venomousSpecies: {
      en: "Venomous species",
      ka: "შხამიანი სახეობები",
      ru: "Ядовитые виды",
      tr: "Zehirli türler",
    },
  } as const;
  return pickLocalized(copy[key], locale);
}

export function caucasusPlaceName(locale: string) {
  if (locale in CAUCASUS_NAME) {
    return CAUCASUS_NAME[locale as AppLocale];
  }
  return CAUCASUS_NAME.ka;
}

export function georgiaPlaceName(locale: string) {
  if (locale in GEORGIA_NAME) {
    return GEORGIA_NAME[locale as AppLocale];
  }
  return GEORGIA_NAME.ka;
}

export function georgiaReptilesLabel(locale: string) {
  return pickLocalized(
    {
      en: "Georgia reptiles",
      ka: "საქართველოს ქვეწარმავლები",
      ru: "Рептилии Грузии",
      tr: "Gürcistan sürüngenleri",
    },
    locale,
  );
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (PREFIXED_LOCALES as readonly string[]).includes(value);
}

export function openGraphLocale(locale: string) {
  if (locale in OPEN_GRAPH_LOCALE) {
    return OPEN_GRAPH_LOCALE[locale as AppLocale];
  }
  return OPEN_GRAPH_LOCALE.ka;
}

export function pickLocalized(
  text: { en: string; ka: string; ru?: string; tr?: string },
  locale: string,
) {
  if (locale === "ka") return text.ka;
  if (locale === "ru" && text.ru) return text.ru;
  if (locale === "tr" && text.tr) return text.tr;
  return text.en;
}
