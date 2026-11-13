import type { NewsArticle, NewsListArticle, NewsPhoto } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { hasNewsCopy } from "@/data/news";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { newsCopyReadMinutes } from "@/lib/newsReadTime";

import { getPublishedNewsArticles } from "./newsSeed";

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

export function manyNewsListArticles(locale: AppLocale) {
  return manyPublishedNews(locale).map((article) =>
    toNewsListArticle(article, locale),
  );
}

export function manyNewsListPage(
  locale: AppLocale,
  page: number,
  limit: number,
  hub?: GroupHubId,
) {
  const all = manyNewsListArticles(locale);
  const matches = hub
    ? all.filter((article) => article.relatedHubIds.includes(hub))
    : all;
  const counts = Object.fromEntries(
    (Object.keys(GROUP_HUBS) as GroupHubId[]).map((id) => [
      id,
      all.filter((article) => article.relatedHubIds.includes(id)).length,
    ]),
  ) as Record<GroupHubId, number>;
  return {
    articles: matches.slice((page - 1) * limit, page * limit),
    facets: { hub: { all: all.length, ...counts } },
    limit,
    locale,
    page,
    pageCount: Math.max(1, Math.ceil(matches.length / limit)),
    total: matches.length,
  };
}

export function manyPublishedNews(locale?: AppLocale) {
  return locale
    ? MANY_NEWS.filter((article) => hasNewsCopy(article, locale))
    : MANY_NEWS;
}

export function toNewsListArticle(
  article: NewsArticle,
  locale: AppLocale,
): NewsListArticle {
  const copy = article.copy[locale];
  return {
    dek: copy.dek,
    id: article.id,
    ...(article.image
      ? {
          image: {
            ...article.image,
            alt: {
              [locale]: article.image.alt[locale] ?? article.image.alt.ka,
            } as NewsPhoto["alt"],
          },
        }
      : {}),
    lead: copy.lead,
    publishedAt: article.publishedAt,
    readMinutes: newsCopyReadMinutes(copy),
    relatedHubIds: article.relatedHubIds,
    relatedRegionIds: article.relatedRegionIds,
    relatedSpeciesIds: article.relatedSpeciesIds,
    ...(article.series ? { series: article.series } : {}),
    slug: article.slug,
    sources: article.sources.map((source) => ({
      name: typeof source.name === "string" ? source.name : source.name[locale],
      url: source.url,
    })),
    title: copy.title,
    ...(article.updatedAt ? { updatedAt: article.updatedAt } : {}),
  };
}

const MANY_NEWS = Array.from({ length: MANY_NEWS_TOTAL }, (_, index) => {
  const base = getPublishedNewsArticles();
  const article = base[index % base.length]!;
  const { tr: _tr, ...withoutTr } = article.copy;
  return {
    ...article,
    copy: (index < MANY_NEWS_TR_TOTAL
      ? article.copy
      : withoutTr) as NewsArticle["copy"],
    id: `archive-fixture-${index + 1}`,
    publishedAt: new Date(NEWEST_MS - index * DAY_MS)
      .toISOString()
      .slice(0, 10),
    slug: `archive-fixture-${index + 1}`,
    updatedAt:
      index === MANY_NEWS_EDITED_INDEX ? MANY_NEWS_EDITED_AT : undefined,
  };
});
