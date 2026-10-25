import type { NewsSeriesId } from "@/data/newsSeries";
import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

export type NewsArticle = {
  copy: Record<AppLocale, NewsLocaleCopy>;
  gallery?: readonly NewsPhoto[];
  id: string;
  image?: NewsPhoto;
  publishedAt: string;
  relatedHubIds: readonly GroupHubId[];
  relatedRegionIds: readonly string[];
  relatedSpeciesIds: readonly string[];
  series?: NewsSeriesId;
  slug: string;
  sources: readonly NewsSource[];
  status: NewsArticleStatus;
  updatedAt?: string;
  views?: number;
};

export type NewsListArticle = Pick<
  NewsArticle,
  | "id"
  | "image"
  | "publishedAt"
  | "relatedHubIds"
  | "relatedRegionIds"
  | "relatedSpeciesIds"
  | "series"
  | "slug"
  | "sources"
  | "updatedAt"
> & {
  dek: string;
  lead: string;
  readMinutes: number;
  title: string;
};

export type NewsMark =
  | string
  | { href: string; label: string; type: "external" }
  | { id: GroupHubId; label: string; type: "hub" }
  | { id: string; label: string; type: "region" }
  | { id: string; label: string; type: "species" }
  | { label: string; slug: string; type: "credit-author" }
  | { label: string; type: "news-index" }
  | { name: string; type: "sci" };

export type NewsPhoto = {
  alt: Partial<Record<AppLocale, string>> & {
    ka: string;
  };
  credit?: PhotoCredit;
  fromAtlas?: boolean;
  height?: number;
  plate?: boolean;
  src: string;
  width?: number;
};

export type NewsSection = {
  blocks: NewsSectionBlock[];
  heading: string;
};

export type NewsSectionBlock =
  { parts: NewsMark[]; type: "p" } | { src: string; type: "figure" };

export type NewsSource = {
  name: NewsSourceName;
  url: string;
};

export type NewsSummary = Pick<
  NewsArticle,
  "id" | "publishedAt" | "slug" | "sources" | "status" | "updatedAt"
> & {
  copy: Partial<Record<AppLocale, NewsSummaryCopy>> & { ka: NewsSummaryCopy };
};

type NewsArticleStatus = "draft" | "published";

type NewsLocaleCopy = {
  dek: string;
  lead: string;
  metaDescription: string;
  metaTitle: string;
  sections: NewsSection[];
  title: string;
};

type NewsSourceName = Record<AppLocale, string> | string;

type NewsSummaryCopy = Pick<NewsLocaleCopy, "dek" | "metaTitle" | "title">;
