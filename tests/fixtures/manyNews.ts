import type * as NewsModule from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

export const MANY_NEWS_TOTAL = 53;
export const MANY_NEWS_TR_TOTAL = 30;
export const MANY_NEWS_EDITED_INDEX = 30;
export const MANY_NEWS_EDITED_AT = "2026-10-05";

const DAY_MS = 86_400_000;
const NEWEST_MS = Date.parse("2026-10-01T00:00:00Z");

export function fakeGetPathname({
  href,
  locale,
}: {
  href: string | { params: Record<string, string>; pathname: string };
  locale: string;
}) {
  const path =
    typeof href === "string"
      ? href
      : href.pathname.replace(
          /\[(\w+)\]/g,
          (_, key: string) => href.params[key] ?? "",
        );
  if (locale === "ka") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function withManyNews(actual: typeof NewsModule): typeof NewsModule {
  const base = actual.getPublishedNewsArticles();
  const many = Array.from({ length: MANY_NEWS_TOTAL }, (_, index) => ({
    ...base[index % base.length],
    id: `archive-fixture-${index + 1}`,
    publishedAt: new Date(NEWEST_MS - index * DAY_MS)
      .toISOString()
      .slice(0, 10),
    slug: `archive-fixture-${index + 1}`,
    updatedAt:
      index === MANY_NEWS_EDITED_INDEX ? MANY_NEWS_EDITED_AT : undefined,
  }));
  return {
    ...actual,
    getPublishedNewsArticles: (locale?: AppLocale) =>
      locale === "tr" ? many.slice(0, MANY_NEWS_TR_TOTAL) : many,
  };
}
