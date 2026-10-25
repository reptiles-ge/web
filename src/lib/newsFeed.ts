import type { AppLocale } from "@/i18n/routing";

import {
  newsLocalizedDek,
  newsLocalizedTitle,
  type NewsSummary,
} from "@/data/news";
import {
  newsArticleModifiedDateTime,
  newsArticleUrl,
  newsDateTime,
  newsIndexDateFields,
  newsIndexUrl,
} from "@/lib/news";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const NEWS_FEED_HEADERS = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "application/atom+xml; charset=utf-8",
};

export function buildNewsFeedXml({
  articles,
  locale,
  subtitle,
  title,
}: {
  articles: readonly NewsSummary[];
  locale: AppLocale;
  subtitle: string;
  title: string;
}) {
  const indexUrl = newsIndexUrl(locale);
  const entries = uniqueBySlug(articles).filter((article) =>
    Boolean(article.copy[locale]),
  );
  const lines = [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">`,
    `  <id>${escapeXml(indexUrl)}</id>`,
    `  <title>${escapeXml(title)}</title>`,
    `  <subtitle>${escapeXml(subtitle)}</subtitle>`,
    `  <link href="${escapeXml(indexUrl)}" hreflang="${locale}" rel="alternate" type="text/html"/>`,
    `  <link href="${escapeXml(newsFeedUrl(locale))}" rel="self" type="application/atom+xml"/>`,
    `  <updated>${newsIndexDateFields(entries).dateModified}</updated>`,
    "  <author>",
    `    <name>${escapeXml(siteConfig.name)}</name>`,
    `    <uri>${escapeXml(absoluteUrl("/"))}</uri>`,
    "  </author>",
  ];

  for (const article of entries) {
    const url = newsArticleUrl(locale, article.slug);
    lines.push(
      "  <entry>",
      `    <id>${escapeXml(url)}</id>`,
      `    <title>${escapeXml(newsLocalizedTitle(article, locale))}</title>`,
      `    <link href="${escapeXml(url)}" hreflang="${locale}" rel="alternate" type="text/html"/>`,
      `    <published>${newsDateTime(article.publishedAt)}</published>`,
      `    <updated>${newsArticleModifiedDateTime(article)}</updated>`,
      `    <summary>${escapeXml(newsLocalizedDek(article, locale))}</summary>`,
      "  </entry>",
    );
  }

  lines.push("</feed>");
  return `${lines.join("\n")}\n`;
}

export function escapeXml(value: string) {
  return value
    .replace(INVALID_XML_CHARS, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function newsFeedPath(locale: AppLocale) {
  return locale === "ka" ? "/feed.xml" : `/${locale}/feed.xml`;
}

export function newsFeedUrl(locale: AppLocale) {
  return absoluteUrl(newsFeedPath(locale));
}

const INVALID_XML_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;

function uniqueBySlug(articles: readonly NewsSummary[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (article.status !== "published" || seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  });
}
