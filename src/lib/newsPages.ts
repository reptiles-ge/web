import type { NewsListArticle } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { getPublishedNewsArticles, type NewsArticle } from "@/data/news";
import { routing } from "@/i18n/routing";
import {
  newestNewsDateTime,
  newsArticleUrl,
  newsDateTime,
  newsIndexHref,
} from "@/lib/news";
import { getNewsListArticles } from "@/lib/newsApi";
import { absoluteUrl, localePath, siteEntityId } from "@/lib/site";

export type NewsPage<T = NewsArticle> = {
  articles: T[];
  first: number;
  last: number;
  page: number;
  pageCount: number;
  total: number;
};

type NewsDates = Pick<NewsArticle, "publishedAt" | "updatedAt">;

type NewsListingJsonLdInput = {
  articles: readonly Pick<NewsListArticle, "slug" | "title">[];
  breadcrumbs: ReadonlyArray<{ name: string; url: string }>;
  dates: { dateModified?: string; datePublished?: string };
  description: string;
  locale: AppLocale;
  name: string;
  url: string;
};

export const NEWS_PAGE_SIZE = 24;

type NewsPageCounts = Record<AppLocale, number>;

export async function getNewsListPage(locale: AppLocale, page: number) {
  return newsPageOf(await getNewsListArticles(locale), page);
}

export async function getNewsListPageCounts() {
  const counts = await Promise.all(
    routing.locales.map(
      async (locale) =>
        [
          locale,
          pageCountFor((await getNewsListArticles(locale)).length),
        ] as const,
    ),
  );
  return Object.fromEntries(counts) as NewsPageCounts;
}

export function getNewsPage(locale: AppLocale, page: number) {
  return newsPageOf(getPublishedNewsArticles(locale), page);
}

export function newsArchiveAlternates(
  locale: AppLocale,
  page: number,
  pageCounts: NewsPageCounts,
) {
  const languages: Record<string, string> = {};
  if (pageCounts.ka >= page) {
    languages["x-default"] = newsPageUrl("ka", page);
  }
  for (const loc of routing.locales) {
    if (pageCounts[loc] >= page) languages[loc] = newsPageUrl(loc, page);
  }
  return { canonical: newsPageUrl(locale, page), languages };
}

export function newsArchiveHref(page: number) {
  return {
    params: { page: String(page) },
    pathname: "/news/page/[page]" as const,
  };
}

export function newsArchivePages(
  locale: AppLocale,
  pageCounts: NewsPageCounts,
) {
  return Array.from(
    { length: pageCounts[locale] - 1 },
    (_, index) => index + 2,
  );
}

export function newsArchiveStaticParams(pageCounts: NewsPageCounts) {
  return routing.locales.flatMap((locale) =>
    newsArchivePages(locale, pageCounts).map((page) => ({
      locale,
      page: String(page),
    })),
  );
}

export function newsListingJsonLd({
  articles,
  breadcrumbs,
  dates,
  description,
  locale,
  name,
  url,
}: NewsListingJsonLdInput) {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      item: crumb.url,
      name: crumb.name,
      position: index + 1,
    })),
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    ...dates,
    description,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        name: article.title,
        position: index + 1,
        url: newsArticleUrl(locale, article.slug),
      })),
      numberOfItems: articles.length,
    },
    name,
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return [breadcrumbLd, collectionLd];
}

export function newsPageCount(locale: AppLocale) {
  return pageCountFor(getPublishedNewsArticles(locale).length);
}

export function newsPageCounts(): NewsPageCounts {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, newsPageCount(locale)]),
  ) as NewsPageCounts;
}

export function newsPageDateModified(
  newest: NewsDates | undefined,
  articles: readonly NewsDates[],
) {
  const shifted = newest ? newsDateTime(newest.publishedAt) : null;
  const edited = newestNewsDateTime(articles);
  if (!shifted) return edited;
  if (!edited) return shifted;
  return Date.parse(edited) > Date.parse(shifted) ? edited : shifted;
}

export function newsPageHref(page: number) {
  return page <= 1 ? newsIndexHref() : newsArchiveHref(page);
}

export function newsPageOf<T>(
  all: readonly T[],
  page: number,
): NewsPage<T> | null {
  const pageCount = pageCountFor(all.length);
  if (!Number.isSafeInteger(page) || page < 1 || page > pageCount) return null;
  const start = (page - 1) * NEWS_PAGE_SIZE;
  const articles = all.slice(start, start + NEWS_PAGE_SIZE);
  return {
    articles,
    first: articles.length > 0 ? start + 1 : 0,
    last: start + articles.length,
    page,
    pageCount,
    total: all.length,
  };
}

export function newsPageUrl(locale: AppLocale, page: number) {
  return absoluteUrl(localePath(locale, newsPageHref(page)));
}

export function parseNewsArchivePage(value: string) {
  if (!/^[1-9]\d{0,5}$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 ? page : null;
}

function pageCountFor(total: number) {
  return Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
}
