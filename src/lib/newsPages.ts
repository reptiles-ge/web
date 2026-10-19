import type { AppLocale } from "@/i18n/routing";

import {
  getPublishedNewsArticles,
  type NewsArticle,
  newsLocalizedTitle,
} from "@/data/news";
import { routing } from "@/i18n/routing";
import {
  newestNewsDateTime,
  newsArticleUrl,
  newsDateTime,
  newsIndexHref,
} from "@/lib/news";
import { absoluteUrl, localePath, siteEntityId } from "@/lib/site";

export type NewsPage = {
  articles: NewsArticle[];
  first: number;
  last: number;
  page: number;
  pageCount: number;
  total: number;
};

type NewsListingJsonLdInput = {
  articles: readonly NewsArticle[];
  breadcrumbs: ReadonlyArray<{ name: string; url: string }>;
  dates: { dateModified?: string; datePublished?: string };
  description: string;
  locale: AppLocale;
  name: string;
  url: string;
};

export const NEWS_PAGE_SIZE = 24;

export function getNewsPage(locale: AppLocale, page: number): NewsPage | null {
  const all = getPublishedNewsArticles(locale);
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

export function newsArchiveAlternates(locale: AppLocale, page: number) {
  const languages: Record<string, string> = {};
  if (newsPageCount("ka") >= page) {
    languages["x-default"] = newsPageUrl("ka", page);
  }
  for (const loc of routing.locales) {
    if (newsPageCount(loc) >= page) languages[loc] = newsPageUrl(loc, page);
  }
  return { canonical: newsPageUrl(locale, page), languages };
}

export function newsArchiveHref(page: number) {
  return {
    params: { page: String(page) },
    pathname: "/news/page/[page]" as const,
  };
}

export function newsArchivePages(locale: AppLocale) {
  return Array.from(
    { length: newsPageCount(locale) - 1 },
    (_, index) => index + 2,
  );
}

export function newsArchiveStaticParams() {
  return routing.locales.flatMap((locale) =>
    newsArchivePages(locale).map((page) => ({ locale, page: String(page) })),
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
        name: newsLocalizedTitle(article, locale),
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

export function newsPageDateModified(
  locale: AppLocale,
  articles: readonly NewsArticle[],
) {
  const newest = getPublishedNewsArticles(locale)[0];
  const shifted = newest ? newsDateTime(newest.publishedAt) : null;
  const edited = newestNewsDateTime(articles);
  if (!shifted) return edited;
  if (!edited) return shifted;
  return Date.parse(edited) > Date.parse(shifted) ? edited : shifted;
}

export function newsPageHref(page: number) {
  return page <= 1 ? newsIndexHref() : newsArchiveHref(page);
}

export function newsPageUrl(locale: AppLocale, page: number) {
  return absoluteUrl(localePath(locale, newsPageHref(page)));
}

export function newsPaginationPages(current: number, pageCount: number) {
  const pages: Array<null | number> = [];
  for (let page = 1; page <= pageCount; page += 1) {
    const edge = page === 1 || page === pageCount;
    const near = Math.abs(page - current) <= 1;
    if (edge || near) {
      pages.push(page);
    } else if (pages.at(-1) !== null) {
      pages.push(null);
    }
  }
  return pages;
}

export function parseNewsArchivePage(value: string) {
  if (!/^[1-9]\d{0,5}$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 ? page : null;
}

function pageCountFor(total: number) {
  return Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
}
