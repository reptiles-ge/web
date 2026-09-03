import { getPublishedNewsArticles, type NewsArticle } from "@/data/news";
import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { getNewsImageSrc } from "@/lib/newsVisual";
import {
  absoluteUrl,
  localeAlternates,
  ogImageUrlFromSrc,
  SITE_OG_IMAGE_URL,
} from "@/lib/site";
import { parseToSiteDateTime } from "@/lib/siteTime";

export function newsArticleAlternates(locale: AppLocale, slug: string) {
  return localeAlternates(locale, newsArticleHref(slug));
}

export function newsArticleHref(slug: string) {
  return {
    params: { slug },
    pathname: "/news/[slug]" as const,
  };
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

export function newsIndexHref() {
  return "/news" as const;
}

export function newsIndexPath(locale: AppLocale) {
  return getPathname({ href: newsIndexHref(), locale });
}

export function newsIndexUrl(locale: AppLocale) {
  return absoluteUrl(newsIndexPath(locale));
}

export function newsOgImageUrl(article?: NewsArticle) {
  const src = article ? getNewsImageSrc(article) : null;
  if (src) {
    const fromPipeline = ogImageUrlFromSrc(src);
    if (fromPipeline) return fromPipeline;
    if (src.startsWith("/")) {
      return absoluteUrl(src);
    }
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
  }
  return SITE_OG_IMAGE_URL;
}

export function publishedNewsStaticParams() {
  return getPublishedNewsArticles().flatMap((article) =>
    routing.locales.map((locale) => ({
      locale,
      slug: article.slug,
    })),
  );
}
