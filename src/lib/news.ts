import type { NewsMark } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import {
  getNewsArticleLocales,
  getNewsCopy,
  getPublishedNewsArticleBySlug,
  getPublishedNewsArticles,
  type NewsArticle,
} from "@/data/news";
import { getPathname } from "@/i18n/navigation";
import { getNewsImageSrc } from "@/lib/newsVisual";
import {
  absoluteUrl,
  localeAlternates,
  ogImageUrlFromSrc,
  SITE_OG_IMAGE_URL,
} from "@/lib/site";
import { parseToSiteDateTime } from "@/lib/siteTime";

export function newsArticleAlternates(locale: AppLocale, slug: string) {
  const article = getPublishedNewsArticleBySlug(slug);
  if (!article) return localeAlternates(locale, newsArticleHref(slug));

  const languages: Record<string, string> = {
    "x-default": newsArticleUrl("ka", slug),
  };
  for (const loc of getNewsArticleLocales(article)) {
    languages[loc] = newsArticleUrl(loc, slug);
  }

  return {
    canonical: newsArticleUrl(locale, slug),
    languages,
  };
}

export function newsArticleHref(slug: string) {
  return {
    params: { slug },
    pathname: "/news/[slug]" as const,
  };
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

export function newsIndexHref() {
  return "/news" as const;
}

export function newsIndexUrl(locale: AppLocale) {
  return absoluteUrl(newsIndexPath(locale));
}

export function newsOgImageUrl(article?: NewsArticle) {
  const src = article ? getNewsImageSrc(article) : null;
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
  const copy = getNewsCopy(article, locale) ?? article.copy.ka;
  const texts = [copy.title, copy.lead];
  for (const section of copy.sections) {
    texts.push(section.heading);
    for (const block of section.blocks) {
      if (block.type === "p") texts.push(...block.parts.map(newsMarkText));
    }
  }
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / NEWS_WORDS_PER_MINUTE));
}

export function publishedNewsStaticParams() {
  return getPublishedNewsArticles().flatMap((article) =>
    getNewsArticleLocales(article).map((locale) => ({
      locale,
      slug: article.slug,
    })),
  );
}

const NEWS_WORDS_PER_MINUTE = 150;

function newsArticlePath(locale: AppLocale, slug: string) {
  return getPathname({ href: newsArticleHref(slug), locale });
}

function newsIndexPath(locale: AppLocale) {
  return getPathname({ href: newsIndexHref(), locale });
}

function newsMarkText(mark: NewsMark) {
  if (typeof mark === "string") return mark;
  return "label" in mark ? mark.label : mark.name;
}
