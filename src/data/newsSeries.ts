import type { AppLocale } from "@/i18n/routing";

export const NEWS_SERIES = {
  "batumi-raptor-count-2026": {
    name: {
      en: "Batumi Raptor Count, autumn 2026",
      ka: "Batumi Raptor Count, შემოდგომა 2026",
      ru: "Batumi Raptor Count, осень 2026",
      tr: "Batumi Raptor Count, 2026 sonbaharı",
    },
  },
  "caucasus-leopards": {
    name: {
      en: "Caucasus leopards",
      ka: "კავკასიის ლეოპარდები",
      ru: "Кавказские леопарды",
      tr: "Kafkasya leoparları",
    },
  },
  "rioni-sturgeon": {
    name: {
      en: "Rioni sturgeon",
      ka: "რიონის ზუთხები",
      ru: "Осетры Риони",
      tr: "Rioni’nin mersin balıkları",
    },
  },
} as const satisfies Record<string, { name: Record<AppLocale, string> }>;

export type NewsSeriesId = keyof typeof NEWS_SERIES;

export const newsSeriesIds = Object.keys(NEWS_SERIES) as [
  NewsSeriesId,
  ...NewsSeriesId[],
];

export function newsSeriesName(id: NewsSeriesId, locale: AppLocale) {
  return NEWS_SERIES[id].name[locale];
}
