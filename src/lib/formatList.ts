import type { AppLocale } from "@/i18n/routing";

const LIST_PATTERNS: Record<AppLocale, { last: string; pair: string }> = {
  en: { last: ", and ", pair: " and " },
  ka: { last: " და ", pair: " და " },
  ru: { last: " и ", pair: " и " },
  tr: { last: " ve ", pair: " ve " },
};

export function formatList(items: readonly string[], locale: AppLocale) {
  if (items.length < 2) return items.join("");
  const { last, pair } = LIST_PATTERNS[locale];
  if (items.length === 2) return `${items[0]}${pair}${items[1]}`;
  return `${items.slice(0, -1).join(", ")}${last}${items.at(-1)}`;
}
