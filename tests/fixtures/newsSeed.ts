import type { AuthorProfile } from "@/data/authors";
import type { NewsArticle } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { hasNewsCopy, newsLinkedSpeciesIds } from "@/data/news";
import { newsMentionsCreditAuthor } from "@/lib/newsAuthorMentions";

import { NEWS_ARTICLES } from "./newsArticlesSnapshot";

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

export function getPublishedNewsArticleBySlug(slug: string) {
  const article = bySlug.get(slug);
  if (!article || article.status !== "published") return undefined;
  return article;
}

export function getPublishedNewsArticles(locale?: AppLocale) {
  const articles: NewsArticle[] = [];
  for (const article of NEWS_ARTICLES) {
    if (article.status !== "published") continue;
    if (locale && !hasNewsCopy(article, locale)) continue;
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
