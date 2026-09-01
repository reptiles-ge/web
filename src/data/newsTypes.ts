import type { GroupHubId } from "@/lib/groupHubs";
import type { AppLocale } from "@/i18n/routing";

export type NewsArticleStatus = "published" | "draft";

export type NewsMark =
  | string
  | { type: "species"; id: string; label: string }
  | { type: "region"; id: string; label: string }
  | { type: "hub"; id: GroupHubId; label: string }
  | { type: "news-index"; label: string }
  | { type: "external"; href: string; label: string }
  | { type: "sci"; name: string };

export type NewsSection = {
  heading: string;
  paragraphs: NewsMark[][];
};

export type NewsLocaleCopy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  dek: string;
  lead: string;
  sections: NewsSection[];
};

export type NewsSource = {
  name: string;
  url: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  status: NewsArticleStatus;
  publishedAt: string;
  updatedAt?: string;
  relatedSpeciesIds: readonly string[];
  relatedRegionIds: readonly string[];
  relatedHubIds: readonly GroupHubId[];
  sources: readonly NewsSource[];
  copy: Record<AppLocale, NewsLocaleCopy>;
};
