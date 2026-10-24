import type { NewsArticle, NewsPhoto, NewsSection } from "@/data/newsTypes";
import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { newsSeriesName } from "@/data/newsSeries";
import { newsMentionsCreditAuthor } from "@/lib/newsAuthorMentions";
import { newsCopyReadMinutes } from "@/lib/newsReadTime";
import { newsArticleLocales, newsBodyLinks } from "@/lib/newsRules";

import type { ApiDatabase } from "./database";

import { readAuthor } from "./authors";
import { readNewsRecords } from "./news";

export type NewsDetailView = NewsSummaryView & {
  gallery: NewsPhotoView[];
  metaDescription: string;
  metaTitle: string;
  sections: NewsSection[];
};

export type NewsFilters = {
  author?: string;
  hub?: string;
  region?: string;
  series?: string;
  species?: string;
};

export type NewsSummaryView = {
  dek: string;
  image?: NewsPhotoView;
  lead: string;
  locales: AppLocale[];
  publishedAt: string;
  readMinutes: number;
  relatedHubIds: string[];
  relatedRegionIds: string[];
  relatedSpeciesIds: string[];
  series?: { id: string; name: string };
  slug: string;
  sources: Array<{ name: string; url: string }>;
  title: string;
  updatedAt?: string;
};

type NewsPhotoView = {
  alt: string;
  credit?: PhotoCredit;
  fromAtlas?: boolean;
  height?: number;
  plate?: boolean;
  src: string;
  width?: number;
};

export async function getPublishedNews(
  db: ApiDatabase,
  slug: string,
  locale: AppLocale,
) {
  const [record] = await readNewsRecords(db, slug);
  if (!record || record.article.status !== "published") return null;
  const textLocale = record.article.copy[locale] ? locale : "ka";
  return {
    data: newsDetail(record.article, textLocale),
    locale: textLocale,
  };
}

export async function listPublishedNews(
  db: ApiDatabase,
  locale: AppLocale,
  filters: NewsFilters,
) {
  const [records, author] = await Promise.all([
    readNewsRecords(db),
    filters.author ? readAuthor(db, filters.author) : null,
  ]);
  if (filters.author && !author) return [];
  return records
    .filter(({ article }) => {
      if (article.status !== "published" || !article.copy[locale]) return false;
      if (
        filters.hub &&
        !article.relatedHubIds.some((id) => id === filters.hub)
      )
        return false;
      if (filters.region && !article.relatedRegionIds.includes(filters.region))
        return false;
      if (filters.series && article.series !== filters.series) return false;
      if (
        filters.species &&
        !article.relatedSpeciesIds.includes(filters.species) &&
        !localeLinksSpecies(article, locale, filters.species)
      )
        return false;
      return !author || newsMentionsCreditAuthor(article, author);
    })
    .sort(
      (a, b) =>
        b.article.publishedAt.localeCompare(a.article.publishedAt) ||
        a.position - b.position,
    )
    .map(({ article }) => newsSummary(article, locale));
}

function localeLinksSpecies(
  article: NewsArticle,
  locale: AppLocale,
  speciesId: string,
) {
  return newsBodyLinks({
    ...article,
    copy: { [locale]: article.copy[locale] } as NewsArticle["copy"],
  }).species.has(speciesId);
}

function localizePhoto(photo: NewsPhoto, locale: AppLocale): NewsPhotoView {
  const { alt, ...rest } = photo;
  return { ...rest, alt: alt[locale] ?? alt.ka };
}

function newsDetail(article: NewsArticle, locale: AppLocale): NewsDetailView {
  const copy = article.copy[locale];
  return {
    ...newsSummary(article, locale),
    gallery: (article.gallery ?? []).map((photo) =>
      localizePhoto(photo, locale),
    ),
    metaDescription: copy.metaDescription,
    metaTitle: copy.metaTitle,
    sections: copy.sections,
  };
}

function newsSummary(article: NewsArticle, locale: AppLocale): NewsSummaryView {
  const copy = article.copy[locale];
  return {
    dek: copy.dek,
    ...(article.image ? { image: localizePhoto(article.image, locale) } : {}),
    lead: copy.lead,
    locales: newsArticleLocales(article),
    publishedAt: article.publishedAt,
    readMinutes: newsCopyReadMinutes(copy),
    relatedHubIds: [...article.relatedHubIds],
    relatedRegionIds: [...article.relatedRegionIds],
    relatedSpeciesIds: [...article.relatedSpeciesIds],
    ...(article.series
      ? {
          series: {
            id: article.series,
            name: newsSeriesName(article.series, locale),
          },
        }
      : {}),
    slug: article.slug,
    sources: article.sources.map((source) => ({
      name: typeof source.name === "string" ? source.name : source.name[locale],
      url: source.url,
    })),
    title: copy.title,
    ...(article.updatedAt ? { updatedAt: article.updatedAt } : {}),
  };
}
