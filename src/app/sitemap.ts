import type { MetadataRoute } from "next";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import { GUIDE_ARTICLE_PATHS } from "@/data/guideArticlePaths";
import { getPublishedNewsArticles } from "@/data/news";
import {
  sitemapAuthorDatePublished,
  sitemapAuthorLastModified,
  sitemapPathDatePublished,
  sitemapPathLastModified,
  sitemapQuizDatePublished,
  sitemapQuizLastModified,
  sitemapRegionDatePublished,
  sitemapRegionLastModified,
} from "@/data/pageLastModified";
import { regions } from "@/data/regions";
import { getCatalogSpecies } from "@/data/species";
import { type AppLocale, routing } from "@/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import {
  creditAuthorAlternates,
  creditAuthorUrl,
  getCreditAuthorPhotos,
} from "@/lib/creditAuthors";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import {
  newsArticleAlternates,
  newsArticleUrl,
  newsDateTime,
} from "@/lib/news";
import { liveQuizzes } from "@/lib/quizzes";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  quizAlternates,
  quizPageUrl,
  speciesAlternates,
  speciesPageUrl,
} from "@/lib/site";
import {
  creditAuthorPageImageUrls,
  speciesPageImageUrls,
} from "@/lib/sitemapImages";
import { regionHref } from "@/lib/speciesRoutes";

const FALLBACK_LASTMOD = "2026-01-01T00:00:00+04:00";

type SitemapEntry = MetadataRoute.Sitemap[number] & {
  datePublished?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalogSpecies();
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();

  function push(entry: SitemapEntry) {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    entries.push(entry);
  }

  for (const locale of routing.locales) {
    push(pageEntry(locale, "/"));
    push(pageEntry(locale, "/contact"));
    push(pageEntry(locale, "/about"));
    push(pageEntry(locale, "/terms-and-conditions"));
    push(pageEntry(locale, "/privacy"));
    push(pageEntry(locale, "/news"));
    for (const path of GUIDE_ARTICLE_PATHS) {
      push(pageEntry(locale, path));
    }
    push(pageEntry(locale, "/authors"));
    push(pageEntry(locale, "/species"));
    push(pageEntry(locale, "/venomous-snakes"));
    push(pageEntry(locale, "/snakes-in-the-yard"));
    push(pageEntry(locale, "/risk-to-humans"));
    push(pageEntry(locale, "/quiz"));
    for (const quiz of liveQuizzes()) {
      const { languages } = quizAlternates(locale, quiz.id);
      push({
        alternates: { languages },
        datePublished: sitemapQuizDatePublished(quiz.id),
        lastModified: sitemapQuizLastModified(quiz.id),
        url: quizPageUrl(locale, quiz.id),
      });
    }

    for (const guide of CLUSTER_GUIDE_LIST) {
      push(pageEntry(locale, guide.pathname));
    }

    for (const hub of GROUP_HUB_LIST) {
      push(pageEntry(locale, hub.path));
    }

    push(pageEntry(locale, "/regions"));

    for (const region of regions) {
      push(
        pageEntry(
          locale,
          regionHref(region.id),
          sitemapRegionLastModified(region.id),
          sitemapRegionDatePublished(region.id),
        ),
      );
    }

    for (const item of catalog) {
      const { languages } = speciesAlternates(locale, item.id);
      const images = speciesPageImageUrls(item);
      push({
        alternates: { languages },
        datePublished: item.publishedAt,
        lastModified: toLastModified(item.updatedAt),
        url: speciesPageUrl(locale, item.id),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const author of getPublishedCreditAuthors()) {
      const photos = getCreditAuthorPhotos(author);
      const { languages } = creditAuthorAlternates(locale, author.slug);
      const images = creditAuthorPageImageUrls(author.portraitSrc, photos);
      push({
        alternates: { languages },
        datePublished: sitemapAuthorDatePublished(author.slug),
        lastModified: sitemapAuthorLastModified(author.slug),
        url: creditAuthorUrl(locale, author.slug),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const article of getPublishedNewsArticles(locale)) {
      const { languages } = newsArticleAlternates(locale, article.slug);
      push({
        alternates: { languages },
        datePublished: newsDateTime(article.publishedAt),
        lastModified: toLastModified(
          newsDateTime(article.updatedAt ?? article.publishedAt),
        ),
        url: newsArticleUrl(locale, article.slug),
      });
    }
  }

  return entries;
}

function pageEntry(
  locale: AppLocale,
  href: Parameters<typeof localePath>[1],
  lastModified = sitemapPathLastModified(String(href)),
  datePublished = sitemapPathDatePublished(String(href)),
): SitemapEntry {
  const { languages } = localeAlternates(locale, href);
  return {
    alternates: { languages },
    datePublished,
    lastModified,
    url: absoluteUrl(localePath(locale, href)),
  };
}

function toLastModified(isoDate: null | string | undefined): string {
  if (!isoDate) return FALLBACK_LASTMOD;
  if (Number.isNaN(Date.parse(isoDate))) return FALLBACK_LASTMOD;
  return isoDate;
}
