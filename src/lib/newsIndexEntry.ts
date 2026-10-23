import type { NewsIndexEntry } from "@/components/NewsIndexCards";
import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

import {
  newsLocalizedDek,
  newsLocalizedTitle,
  newsSourceName,
} from "@/data/news";
import { formatContentDate } from "@/lib/formatDate";
import { GROUP_HUB_ILLUSTRATIONS, type GroupHubId } from "@/lib/groupHubs";
import { newsReadMinutes } from "@/lib/news";
import {
  getNewsVisual,
  newsCategoryHub,
  type NewsSpecies,
} from "@/lib/newsVisual";

export type NewsIndexEntryLabels = {
  readLabel: (minutes: number) => string;
  topicLabel: (hub: GroupHubId) => string;
};

export function toNewsIndexEntry(
  article: NewsArticle,
  locale: AppLocale,
  labels: NewsIndexEntryLabels,
  catalog: readonly NewsSpecies[],
): NewsIndexEntry {
  const hub = newsCategoryHub(article);
  const visual = getNewsVisual(article, locale, catalog);
  const minutes = newsReadMinutes(article, locale);
  return {
    alt: visual?.alt ?? "",
    dateLabel: formatContentDate(article.publishedAt, locale),
    dek: newsLocalizedDek(article, locale),
    illustrated: !visual,
    publishedAt: article.publishedAt,
    readLabel: labels.readLabel(minutes),
    slug: article.slug,
    source: article.sources[0]
      ? newsSourceName(article.sources[0], locale)
      : null,
    sourceMore: Math.max(0, article.sources.length - 1),
    src: visual?.src ?? GROUP_HUB_ILLUSTRATIONS[hub ?? "snakes"],
    title: newsLocalizedTitle(article, locale),
    topicLabel: hub ? labels.topicLabel(hub) : null,
  };
}
