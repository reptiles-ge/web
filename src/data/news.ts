import type {
  NewsArticle,
  NewsPhoto,
  NewsSource,
  NewsSummary,
} from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { getRegionById } from "@/data/regions";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { newsSourceNames } from "@/lib/newsAuthorMentions";

export type {
  NewsArticle,
  NewsPhoto,
  NewsSource,
  NewsSummary,
} from "@/data/newsTypes";

export function getNewsArticleLocales(article: Pick<NewsSummary, "copy">) {
  return Object.keys(article.copy) as AppLocale[];
}

export function getNewsCopy(article: NewsArticle, locale: AppLocale) {
  return article.copy[locale];
}

export function hasNewsCopy(
  article: Pick<NewsSummary, "copy">,
  locale: AppLocale,
) {
  return article.copy[locale] !== undefined;
}

export function newsArticlePhotos(article: NewsArticle) {
  const photos: NewsPhoto[] = [];
  if (article.image) photos.push(article.image);
  if (article.gallery) photos.push(...article.gallery);
  return photos;
}

export function newsLinkedSpeciesIds(article: NewsArticle, locale: AppLocale) {
  const ids = new Set<string>();
  if (!hasNewsCopy(article, locale)) return ids;
  for (const section of getNewsCopy(article, locale).sections) {
    for (const block of section.blocks) {
      if (block.type !== "p") continue;
      for (const part of block.parts) {
        if (typeof part !== "string" && part.type === "species") {
          ids.add(part.id);
        }
      }
    }
  }
  return ids;
}

export function newsLocalizedDek(
  article: Pick<NewsSummary, "copy">,
  locale: AppLocale,
) {
  return (article.copy[locale] ?? article.copy.ka).dek;
}

export function newsLocalizedTitle(
  article: Pick<NewsSummary, "copy">,
  locale: AppLocale,
) {
  return (article.copy[locale] ?? article.copy.ka).title;
}

export function newsPhotoBySrc(article: NewsArticle, src: string) {
  if (article.image?.src === src) return article.image;
  return article.gallery?.find((photo) => photo.src === src);
}

export function newsRelatedHubs(article: NewsArticle) {
  return article.relatedHubIds.map((id) => GROUP_HUBS[id]);
}

export function newsRelatedRegions(
  article: Pick<NewsArticle, "relatedRegionIds">,
) {
  return article.relatedRegionIds
    .map((id) => getRegionById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function newsRelatedSpecies<T extends { id: string }>(
  article: Pick<NewsArticle, "relatedSpeciesIds">,
  catalog: readonly T[],
) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return article.relatedSpeciesIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export function newsSearchKeywords(
  article: Pick<NewsSummary, "copy" | "slug" | "sources">,
) {
  return [
    article.slug,
    ...Object.values(article.copy).flatMap((copy) => [
      copy.title,
      copy.dek,
      copy.metaTitle,
    ]),
    ...article.sources.flatMap(newsSourceNames),
  ].filter((item): item is string => Boolean(item));
}

export function newsSourceName(source: NewsSource, locale: AppLocale) {
  return typeof source.name === "string" ? source.name : source.name[locale];
}

export function newsSourceOrg(article: NewsArticle, locale: AppLocale) {
  const source = article.sources[0];
  if (!source) return "";
  return newsSourceOrgName(newsSourceName(source, locale));
}

export function newsSourceOrgName(name: string) {
  return name.split(/\s[—-]\s/)[0]?.trim() || name;
}
