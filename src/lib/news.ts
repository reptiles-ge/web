import type { AppLocale } from "@/i18n/routing";

import {
  getNewsArticleLocales,
  getNewsCopy,
  type NewsArticle,
  newsSourceName,
  newsSourceOrgName,
  type NewsSummary,
} from "@/data/news";
import { sitemapPathDatePublished } from "@/data/pageLastModified";
import { getPathname } from "@/i18n/navigation";
import { newsCopyReadMinutes } from "@/lib/newsReadTime";
import { getNewsImageSrc, type NewsSpecies } from "@/lib/newsVisual";
import {
  absoluteUrl,
  localeAlternates,
  ogImageDimensions,
  ogImageUrlFromSrc,
  SITE_OG_IMAGE_URL,
} from "@/lib/site";
import { parseToSiteDateTime } from "@/lib/siteTime";

export function newsArticleAlternates(
  locale: AppLocale,
  article: Pick<NewsSummary, "copy" | "slug">,
) {
  const languages: Record<string, string> = {
    "x-default": newsArticleUrl("ka", article.slug),
  };
  for (const loc of getNewsArticleLocales(article)) {
    languages[loc] = newsArticleUrl(loc, article.slug);
  }

  return {
    canonical: newsArticleUrl(locale, article.slug),
    languages,
  };
}

export function newsArticleHref(slug: string) {
  return {
    params: { slug },
    pathname: "/news/[slug]" as const,
  };
}

export function newsArticleModifiedDateTime(
  article: Pick<NewsArticle, "publishedAt" | "updatedAt">,
) {
  return newsDateTime(article.updatedAt ?? article.publishedAt);
}

export function newsArticlePath(locale: AppLocale, slug: string) {
  return getPathname({ href: newsArticleHref(slug), locale });
}

export function newsArticleUrl(locale: AppLocale, slug: string) {
  return absoluteUrl(newsArticlePath(locale, slug));
}

export function newsDateTime(isoDate: string) {
  return parseToSiteDateTime(isoDate) ?? `${isoDate}T00:00:00+04:00`;
}

export function newsIndexAlternates(locale: AppLocale) {
  return localeAlternates(locale, newsIndexHref());
}

export function newsIndexDateFields(
  articles: readonly Pick<NewsArticle, "publishedAt" | "updatedAt">[],
) {
  const datePublished = sitemapPathDatePublished(newsIndexHref());
  return {
    dateModified: newestNewsDateTime(articles) ?? datePublished,
    datePublished,
  };
}

export function newsIndexHref() {
  return "/news" as const;
}

export function newsIndexUrl(locale: AppLocale) {
  return absoluteUrl(newsIndexPath(locale));
}

export function newsOgImageDimensions(
  article: NewsArticle,
  catalog: readonly NewsSpecies[],
) {
  const url = newsOgImageUrl(article, catalog);
  const fromPipeline = ogImageDimensions(url);
  if (fromPipeline.width) return fromPipeline;
  const photo = article.image;
  if (photo?.width && photo.height && absoluteUrl(photo.src) === url) {
    return { height: photo.height, width: photo.width };
  }
  return {};
}

export function newsOgImageUrl(): string;
export function newsOgImageUrl(
  article: NewsArticle,
  catalog: readonly NewsSpecies[],
): string;
export function newsOgImageUrl(
  article?: NewsArticle,
  catalog: readonly NewsSpecies[] = [],
) {
  const src = article ? getNewsImageSrc(article, catalog) : null;
  if (src) {
    if (src.startsWith("/")) {
      return absoluteUrl(src);
    }
    const fromPipeline = ogImageUrlFromSrc(src);
    if (fromPipeline) return fromPipeline;
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
  }
  return SITE_OG_IMAGE_URL;
}

export function newsReadMinutes(article: NewsArticle, locale: AppLocale) {
  return newsCopyReadMinutes(getNewsCopy(article, locale) ?? article.copy.ka);
}

export function newsSourceBadges(
  articles: readonly Pick<NewsArticle, "sources">[],
  locale: AppLocale,
  limit = NEWS_SOURCE_BADGE_LIMIT,
) {
  const badges = new Map<
    string,
    { count: number; label: string; order: number }
  >();
  for (const article of articles) {
    const seen = new Set<string>();
    for (const source of article.sources) {
      const label = newsSourceOrgName(newsSourceName(source, locale));
      const key = label.toLocaleLowerCase(locale);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const badge = badges.get(key);
      if (badge) {
        badge.count += 1;
      } else {
        badges.set(key, { count: 1, label, order: badges.size });
      }
    }
  }
  return [...badges.values()]
    .sort((a, b) => b.count - a.count || a.order - b.order)
    .slice(0, limit)
    .map((badge) => badge.label);
}

const NEWS_SOURCE_BADGE_LIMIT = 4;

export function newestNewsDateTime(
  articles: readonly Pick<NewsArticle, "publishedAt" | "updatedAt">[],
) {
  let newest: null | string = null;
  let newestTime = Number.NEGATIVE_INFINITY;
  for (const article of articles) {
    const modified = newsArticleModifiedDateTime(article);
    const time = Date.parse(modified);
    if (Number.isNaN(time) || time <= newestTime) continue;
    newest = modified;
    newestTime = time;
  }
  return newest;
}

function newsIndexPath(locale: AppLocale) {
  return getPathname({ href: newsIndexHref(), locale });
}
