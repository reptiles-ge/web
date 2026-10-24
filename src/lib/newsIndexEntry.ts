import type { NewsIndexEntry } from "@/components/NewsIndexCards";
import type { NewsListArticle } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { newsSourceName } from "@/data/news";
import { formatContentDate } from "@/lib/formatDate";
import { GROUP_HUB_ILLUSTRATIONS, type GroupHubId } from "@/lib/groupHubs";
import { newsCategoryHub, type NewsVisual } from "@/lib/newsVisual";

export type NewsIndexEntryLabels = {
  readLabel: (minutes: number) => string;
  topicLabel: (hub: GroupHubId) => string;
};

export function toNewsIndexEntry(
  article: NewsListArticle,
  locale: AppLocale,
  labels: NewsIndexEntryLabels,
  visual: NewsVisual | null | undefined,
): NewsIndexEntry {
  const hub = newsCategoryHub(article);
  return {
    alt: visual?.alt ?? "",
    dateLabel: formatContentDate(article.publishedAt, locale),
    dek: article.dek,
    illustrated: !visual,
    publishedAt: article.publishedAt,
    readLabel: labels.readLabel(article.readMinutes),
    slug: article.slug,
    source: article.sources[0]
      ? newsSourceName(article.sources[0], locale)
      : null,
    sourceMore: Math.max(0, article.sources.length - 1),
    src: visual?.src ?? GROUP_HUB_ILLUSTRATIONS[hub ?? "snakes"],
    title: article.title,
    topicLabel: hub ? labels.topicLabel(hub) : null,
  };
}
