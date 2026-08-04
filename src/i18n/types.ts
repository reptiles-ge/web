export const locales = ["ka", "en"] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "ka";

export const LOCALE_STORAGE_KEY = "reptiles-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
