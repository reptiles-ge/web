import { BATUMI_19300_RAPTORS_2026 } from "@/content/news/batumi-19300-raptors-2026";
import { DAREVSKIA_UZZELLI_ARMENIA_2026 } from "@/content/news/darevskia-uzzelli-armenia-2026";
import { GEORGIA_DOLPHIN_STRANDINGS_2026 } from "@/content/news/georgia-dolphin-strandings-2026";
import { GEORGIA_HERPETOFAUNA_CHECKLIST_2026 } from "@/content/news/georgia-herpetofauna-checklist-2026";
import { VIPERA_PONTICA_HYBRID_GEORGIA_2026 } from "@/content/news/vipera-pontica-hybrid-georgia-2026";
import type { GroupHubId } from "@/lib/groupHubs";
import type { AppLocale } from "@/i18n/routing";
import { getSpeciesById } from "@/data/species";
import { getRegionById } from "@/data/regions";
import { GROUP_HUBS } from "@/lib/groupHubs";
import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

export type {
  NewsArticle,
  NewsPhoto,
} from "@/data/newsTypes";

const NEWS_ARTICLES: readonly NewsArticle[] = [
  DAREVSKIA_UZZELLI_ARMENIA_2026,
  GEORGIA_HERPETOFAUNA_CHECKLIST_2026,
  GEORGIA_DOLPHIN_STRANDINGS_2026,
  VIPERA_PONTICA_HYBRID_GEORGIA_2026,
  BATUMI_19300_RAPTORS_2026,
];

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

export function getPublishedNewsArticles() {
  return NEWS_ARTICLES.filter((article) => article.status === "published")
    .slice()
    .sort((a, b) => {
      const byDate = b.publishedAt.localeCompare(a.publishedAt);
      if (byDate !== 0) return byDate;
      return NEWS_ARTICLES.indexOf(a) - NEWS_ARTICLES.indexOf(b);
    });
}

export function getPublishedNewsArticleBySlug(slug: string) {
  const article = bySlug.get(slug);
  if (!article || article.status !== "published") return undefined;
  return article;
}

export function getNewsCopy(article: NewsArticle, locale: AppLocale) {
  return article.copy[locale];
}

export function getPublishedNewsForSpecies(speciesId: string) {
  return getPublishedNewsArticles().filter((article) =>
    article.relatedSpeciesIds.includes(speciesId),
  );
}

export function getPublishedNewsForRegion(regionId: string) {
  return getPublishedNewsArticles().filter((article) =>
    article.relatedRegionIds.includes(regionId),
  );
}

export function getPublishedNewsForHub(hubId: GroupHubId) {
  return getPublishedNewsArticles().filter((article) =>
    article.relatedHubIds.includes(hubId),
  );
}

export function newsLatestModified(articles = getPublishedNewsArticles()) {
  let latest = "";
  for (const article of articles) {
    const value = article.updatedAt ?? article.publishedAt;
    if (value > latest) latest = value;
  }
  return latest || undefined;
}

export function newsRelatedSpecies(article: NewsArticle) {
  return article.relatedSpeciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function newsRelatedRegions(article: NewsArticle) {
  return article.relatedRegionIds
    .map((id) => getRegionById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function newsRelatedHubs(article: NewsArticle) {
  return article.relatedHubIds.map((id) => GROUP_HUBS[id]);
}

export function newsSearchKeywords(article: NewsArticle) {
  return [
    article.slug,
    ...Object.values(article.copy).flatMap((copy) => [
      copy.title,
      copy.dek,
      copy.metaTitle,
    ]),
    ...article.sources.map((source) => source.name),
  ];
}

export function newsLocalizedDek(article: NewsArticle, locale: AppLocale) {
  return getNewsCopy(article, locale).dek;
}

export function newsLocalizedTitle(article: NewsArticle, locale: AppLocale) {
  return getNewsCopy(article, locale).title;
}

export function newsSourceOrg(article: NewsArticle) {
  const name = article.sources[0]?.name ?? "";
  return name.split(" — ")[0]?.trim() || name;
}

export function newsArticlePhotos(article: NewsArticle) {
  const photos: NewsPhoto[] = [];
  if (article.image) photos.push(article.image);
  if (article.gallery) photos.push(...article.gallery);
  return photos;
}

export function newsPhotoBySrc(article: NewsArticle, src: string) {
  if (article.image?.src === src) return article.image;
  return article.gallery?.find((photo) => photo.src === src);
}
