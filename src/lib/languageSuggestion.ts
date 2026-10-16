import { type AppLocale, routing } from "@/i18n/routing";

export const LANGUAGE_SUGGESTION_KEY = "reptiles-language-suggestion";

export const LANGUAGE_SUGGESTION_COPY: Record<
  AppLocale,
  { action: string; close: string; text: string }
> = {
  en: {
    action: "Switch to English",
    close: "Close",
    text: "This page is also available in English.",
  },
  ka: {
    action: "ქართულზე გადასვლა",
    close: "დახურვა",
    text: "ეს გვერდი ქართულადაც არის.",
  },
  ru: {
    action: "Перейти на русский",
    close: "Закрыть",
    text: "Эта страница есть и на русском языке.",
  },
  tr: {
    action: "Türkçeye geç",
    close: "Kapat",
    text: "Bu sayfa Türkçe olarak da var.",
  },
};

const RUSSIAN_COUNTRIES = new Set(["BY", "KG", "KZ", "RU"]);
const UNKNOWN_COUNTRIES = new Set(["T1", "XX"]);
const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly/i;

const SUPPORTED_LOCALES = new Set<string>(routing.locales);

export function browserLocales(languages: readonly string[]): AppLocale[] {
  const locales = new Set<AppLocale>();
  for (const language of languages) {
    const code = language.toLowerCase().split("-")[0];
    if (SUPPORTED_LOCALES.has(code)) locales.add(code as AppLocale);
  }
  return [...locales];
}

export function isLikelyBot(userAgent: string, webdriver: boolean): boolean {
  return webdriver || BOT_USER_AGENT.test(userAgent);
}

export function needsCountry(
  current: AppLocale,
  languages: readonly string[],
): boolean {
  const locales = browserLocales(languages);
  if (locales.includes(current)) return false;
  return current === "ka" || locales.length === 0;
}

export function normalizeCountry(value: null | string): null | string {
  if (!value) return null;
  const country = value.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]$/.test(country)) return null;
  return UNKNOWN_COUNTRIES.has(country) ? null : country;
}

export function suggestLocale({
  country,
  current,
  languages,
}: {
  country: null | string;
  current: AppLocale;
  languages: readonly string[];
}): AppLocale | null {
  const locales = browserLocales(languages);
  if (locales.includes(current)) return null;
  if (current === "ka" && country === "GE") return null;
  const candidate = locales[0] ?? countryLocale(country);
  return candidate && candidate !== current ? candidate : null;
}

function countryLocale(country: null | string): AppLocale | null {
  if (!country || country === "GE") return null;
  if (country === "TR") return "tr";
  if (RUSSIAN_COUNTRIES.has(country)) return "ru";
  return "en";
}
