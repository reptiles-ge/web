import type { AuthorProfile } from "@/data/authors";
import type { NewsArticle, NewsPhoto, NewsSource } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { NEWS_ARTICLES } from "@/data/news.generated";
import { getRegionById } from "@/data/regions";
import { GROUP_HUBS } from "@/lib/groupHubs";
import {
  newsMentionsCreditAuthor,
  newsSourceNames,
} from "@/lib/newsAuthorMentions";

export type { NewsArticle, NewsPhoto, NewsSource } from "@/data/newsTypes";

const bySlug = new Map<string, NewsArticle>();

for (const article of NEWS_ARTICLES) {
  if (bySlug.has(article.slug)) {
    throw new Error(`Duplicate news slug: ${article.slug}`);
  }
  bySlug.set(article.slug, article);
}

export function getAllNewsArticles() {
  return NEWS_ARTICLES;
}

export function getNewsArticleLocales(article: NewsArticle) {
  return Object.keys(article.copy) as AppLocale[];
}

export function getNewsCopy(article: NewsArticle, locale: AppLocale) {
  return article.copy[locale];
}

export function getPublishedNewsArticleBySlug(slug: string) {
  const article = bySlug.get(slug);
  if (!article || article.status !== "published") return undefined;
  return article;
}

export function getPublishedNewsArticles(locale?: AppLocale) {
  const articles: NewsArticle[] = [];
  for (const article of NEWS_ARTICLES) {
    if (article.status !== "published") continue;
    if (locale && !article.copy[locale]) continue;
    articles.push(article);
  }

  return articles.sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt);
    if (byDate !== 0) return byDate;
    return NEWS_ARTICLES.indexOf(a) - NEWS_ARTICLES.indexOf(b);
  });
}

export function getPublishedNewsArticlesInSeries(
  article: NewsArticle,
  locale?: AppLocale,
) {
  if (!article.series) return [];
  return getPublishedNewsArticles(locale)
    .filter((item) => item.series === article.series)
    .reverse();
}

export function getPublishedNewsForCreditAuthor(
  author: Pick<AuthorProfile, "aliases" | "id">,
  locale?: AppLocale,
) {
  return getPublishedNewsArticles(locale).filter((article) =>
    newsMentionsCreditAuthor(article, author),
  );
}

export function getPublishedNewsForHub(hubId: GroupHubId, locale?: AppLocale) {
  return getPublishedNewsArticles(locale).filter((article) =>
    article.relatedHubIds.includes(hubId),
  );
}

export function getPublishedNewsForRegion(
  regionId: string,
  locale?: AppLocale,
) {
  return getPublishedNewsArticles(locale).filter((article) =>
    article.relatedRegionIds.includes(regionId),
  );
}

export function getPublishedNewsForSpecies(
  speciesId: string,
  locale?: AppLocale,
) {
  return getPublishedNewsArticles(locale).filter(
    (article) =>
      article.relatedSpeciesIds.includes(speciesId) ||
      newsLinkedSpeciesIds(article, locale ?? "ka").has(speciesId),
  );
}

export function newsArticlePhotos(article: NewsArticle) {
  const photos: NewsPhoto[] = [];
  if (article.image) photos.push(article.image);
  if (article.gallery) photos.push(...article.gallery);
  return photos;
}

export function newsLinkedSpeciesIds(article: NewsArticle, locale: AppLocale) {
  const ids = new Set<string>();
  for (const section of getNewsCopy(article, locale)?.sections ?? []) {
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

export function newsLocalizedDek(article: NewsArticle, locale: AppLocale) {
  return getNewsCopy(article, locale)?.dek ?? article.copy.ka.dek;
}

export function newsLocalizedTitle(article: NewsArticle, locale: AppLocale) {
  return getNewsCopy(article, locale)?.title ?? article.copy.ka.title;
}

export function newsPhotoBySrc(article: NewsArticle, src: string) {
  if (article.image?.src === src) return article.image;
  return article.gallery?.find((photo) => photo.src === src);
}

export function newsRelatedHubs(article: NewsArticle) {
  return article.relatedHubIds.map((id) => GROUP_HUBS[id]);
}

export function newsRelatedRegions(article: NewsArticle) {
  return article.relatedRegionIds
    .map((id) => getRegionById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function newsRelatedSpecies<T extends { id: string }>(
  article: NewsArticle,
  catalog: readonly T[],
) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return article.relatedSpeciesIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export function newsSearchKeywords(article: NewsArticle) {
  return [
    article.slug,
    ...Object.values(article.copy).flatMap((copy) => [
      copy?.title,
      copy?.dek,
      copy?.metaTitle,
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
