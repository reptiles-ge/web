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
  slug: string;
  sources: readonly NewsSource[];
  status: NewsArticleStatus;
  updatedAt?: string;
};

export type NewsArticleStatus = "draft" | "published";

export type NewsLocaleCopy = {
  dek: string;
  lead: string;
  metaDescription: string;
  metaTitle: string;
  sections: NewsSection[];
  title: string;
};

export type NewsMark =
  | string
  | { href: string; label: string; type: "external"; }
  | { id: GroupHubId; label: string; type: "hub"; }
  | { id: string; label: string; type: "region"; }
  | { id: string; label: string; type: "species"; }
  | { label: string; type: "news-index"; }
  | { name: string; type: "sci"; };

export type NewsPhoto = {
  alt: Record<AppLocale, string>;
  credit?: PhotoCredit;
  fromAtlas?: boolean;
  plate?: boolean;
  src: string;
};

export type NewsSection = {
  blocks: NewsSectionBlock[];
  heading: string;
};

export type NewsSectionBlock =
  { parts: NewsMark[]; type: "p"; } | { src: string; type: "figure"; };

export type NewsSource = {
  name: string;
  url: string;
};
