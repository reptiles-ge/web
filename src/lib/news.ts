import { getPublishedNewsArticles, type NewsArticle } from "@/data/news";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  SITE_OG_IMAGE_URL,
} from "@/lib/site";
import { parseToSiteDateTime } from "@/lib/siteTime";

export function newsIndexHref() {
  return "/news" as const;
}

export function newsArticleHref(slug: string) {
  return {
    pathname: "/news/[slug]" as const,
    params: { slug },
  };
}

export function newsIndexPath(locale: AppLocale) {
  return getPathname({ locale, href: newsIndexHref() });
}

export function newsArticlePath(locale: AppLocale, slug: string) {
  return getPathname({ locale, href: newsArticleHref(slug) });
}

export function newsIndexUrl(locale: AppLocale) {
  return absoluteUrl(newsIndexPath(locale));
}

export function newsArticleUrl(locale: AppLocale, slug: string) {
  return absoluteUrl(newsArticlePath(locale, slug));
}

export function newsIndexAlternates(locale: AppLocale) {
  return localeAlternates(locale, newsIndexHref());
}

export function newsArticleAlternates(locale: AppLocale, slug: string) {
  return localeAlternates(locale, newsArticleHref(slug));
}

export function newsDateTime(isoDate: string) {
  return parseToSiteDateTime(isoDate) ?? `${isoDate}T00:00:00+04:00`;
}

export function newsOgImageUrl(_article?: NewsArticle) {
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
