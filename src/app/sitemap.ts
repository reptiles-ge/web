import type { MetadataRoute } from "next";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import { getPublishedNewsArticles, newsLatestModified } from "@/data/news";
import { getRegionSpecies, regions } from "@/data/regions";
import { getCatalogSpecies } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
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
import { speciesPageImageUrls } from "@/lib/sitemapImages";
import { regionHref } from "@/lib/speciesRoutes";

const FALLBACK_LASTMOD = "2026-01-01T00:00:00+04:00";

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalogSpecies();
  const atlasLastModified = toLastModified(getAtlasStats(catalog).lastUpdated);
  const newsArticles = getPublishedNewsArticles();
  const newsModifiedRaw = newsLatestModified(newsArticles);
  const newsLastModified = toLastModified(
    newsModifiedRaw ? newsDateTime(newsModifiedRaw) : undefined,
  );
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  function push(entry: MetadataRoute.Sitemap[number]) {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    entries.push(entry);
  }

  for (const locale of routing.locales) {
    push(pageEntry(locale, "/", atlasLastModified));
    push(pageEntry(locale, "/contact", atlasLastModified));
    push(pageEntry(locale, "/about", atlasLastModified));
    push(pageEntry(locale, "/news", newsLastModified));
    push(pageEntry(locale, "/species", atlasLastModified));
    push(pageEntry(locale, "/venomous-snakes", atlasLastModified));
    push(pageEntry(locale, "/snakes-in-the-yard", atlasLastModified));
    push(pageEntry(locale, "/risk-to-humans", atlasLastModified));
    push(pageEntry(locale, "/quiz", atlasLastModified));
    for (const quiz of liveQuizzes()) {
      const { languages } = quizAlternates(locale, quiz.id);
      push({
        alternates: { languages },
        lastModified: atlasLastModified,
        url: quizPageUrl(locale, quiz.id),
      });
    }

    for (const guide of CLUSTER_GUIDE_LIST) {
      push(pageEntry(locale, guide.pathname, atlasLastModified));
    }

    for (const hub of GROUP_HUB_LIST) {
      push(pageEntry(locale, hub.path, atlasLastModified));
    }

    push(pageEntry(locale, "/regions", atlasLastModified));

    for (const region of regions) {
      push(
        pageEntry(
          locale,
          regionHref(region.id),
          maxUpdatedAt(getRegionSpecies(region).map((item) => item.updatedAt)),
        ),
      );
    }

    for (const item of catalog) {
      const { languages } = speciesAlternates(locale, item.id);
      const images = speciesPageImageUrls(item);
      push({
        alternates: { languages },
        lastModified: toLastModified(item.updatedAt),
        url: speciesPageUrl(locale, item.id),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const author of getPublishedCreditAuthors()) {
      const photos = getCreditAuthorPhotos(author);
      const { languages } = creditAuthorAlternates(locale, author.slug);
      push({
        alternates: { languages },
        lastModified: maxUpdatedAt(photos.map((photo) => photo.updatedAt)),
        url: creditAuthorUrl(locale, author.slug),
      });
    }

    for (const article of newsArticles) {
      const { languages } = newsArticleAlternates(locale, article.slug);
      push({
        alternates: { languages },
        lastModified: toLastModified(
          newsDateTime(article.updatedAt ?? article.publishedAt),
        ),
        url: newsArticleUrl(locale, article.slug),
      });
    }
  }

  return entries;
}

function maxUpdatedAt(dates: Array<null | string | undefined>): string {
  let latest: null | string = null;
  let latestTime = Number.NEGATIVE_INFINITY;
  for (const value of dates) {
    if (!value) continue;
    const time = Date.parse(value);
    if (Number.isNaN(time) || time < latestTime) continue;
    latestTime = time;
    latest = value;
  }
  return toLastModified(latest);
}

function pageEntry(
  locale: AppLocale,
  href: Parameters<typeof localePath>[1],
  lastModified: string,
): MetadataRoute.Sitemap[number] {
  const { languages } = localeAlternates(locale, href);
  return {
    alternates: { languages },
    lastModified,
    url: absoluteUrl(localePath(locale, href)),
  };
}

function toLastModified(isoDate: null | string | undefined): string {
  if (!isoDate) return FALLBACK_LASTMOD;
  if (Number.isNaN(Date.parse(isoDate))) return FALLBACK_LASTMOD;
  return isoDate;
}
