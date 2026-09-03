import { getRegionSpecies, regions } from "@/data/regions";
import { getCatalogSpecies } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { routing, type AppLocale } from "@/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  quizAlternates,
  quizPageUrl,
  speciesAlternates,
  speciesPageUrl,
} from "@/lib/site";
import { liveQuizzes } from "@/lib/quizzes";
import { regionHref } from "@/lib/speciesRoutes";
import { getPublishedNewsArticles, newsLatestModified } from "@/data/news";
import {
  newsArticleAlternates,
  newsArticleUrl,
  newsDateTime,
} from "@/lib/news";
import type { MetadataRoute } from "next";

const FALLBACK_LASTMOD = "2026-01-01T00:00:00+04:00";

function toLastModified(isoDate: string | null | undefined): string {
  if (!isoDate) return FALLBACK_LASTMOD;
  if (Number.isNaN(Date.parse(isoDate))) return FALLBACK_LASTMOD;
  return isoDate;
}

function maxUpdatedAt(dates: Array<string | null | undefined>): string {
  let latest: string | null = null;
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
    url: absoluteUrl(localePath(locale, href)),
    lastModified,
    alternates: { languages },
  };
}

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
        url: quizPageUrl(locale, quiz.id),
        lastModified: atlasLastModified,
        alternates: { languages },
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
      push({
        url: speciesPageUrl(locale, item.id),
        lastModified: toLastModified(item.updatedAt),
        alternates: { languages },
      });
    }

    for (const article of newsArticles) {
      const { languages } = newsArticleAlternates(locale, article.slug);
      push({
        url: newsArticleUrl(locale, article.slug),
        lastModified: toLastModified(
          newsDateTime(article.updatedAt ?? article.publishedAt),
        ),
        alternates: { languages },
      });
    }
  }

  return entries;
}
