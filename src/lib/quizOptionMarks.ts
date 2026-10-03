import type { AppLocale } from "@/i18n/routing";

export const OPTION_MARKS: Record<
  AppLocale,
  readonly [string, string, string, string]
> = {
  en: ["A", "B", "C", "D"],
  ka: ["ა", "ბ", "გ", "დ"],
  ru: ["А", "Б", "В", "Г"],
  tr: ["A", "B", "C", "D"],
};
