import type { GuideArticlePath } from "@/data/guideArticlePaths";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";
import type { SearchIcon } from "@/lib/siteSearch";

export type GuideArticle<ImageKey extends string = string> = {
  copy: Record<AppLocale, GuideArticleCopy<ImageKey>>;
  hero: GuideArticleImage;
  id: string;
  images?: Record<ImageKey, GuideArticleImage>;
  messageKey: GuideArticleMessageKey;
  ogImage: GuideArticleOgImage;
  parentHub: GroupHubId;
  pathname: GuideArticlePath;
  relatedSpeciesIds?: readonly string[];
  search: GuideArticleSearch;
  sources: readonly GuideArticleSource[];
};

export type GuideArticleCopy<ImageKey extends string = string> = {
  description: string;
  faq: GuideArticleFaq[];
  metaTitle: string;
  sections: GuideArticleSection<ImageKey>[];
  summary: string;
  title: string;
};

export type GuideArticleFaq = { answer: string; question: string };

export type GuideArticleImage = {
  alt: Record<AppLocale, string>;
  height: number;
  src:
    | `/images/guides/${string}`
    | `https://cdn.reptiles.ge/images/guides/${string}`;
  width: number;
};

export type GuideArticleMessageKey =
  "batInHouse" | "mouseInHouse" | "stinkBugInHouse" | "waspNest";

export type GuideArticleOgImage =
  | `/og/images/guides/${string}.jpg`
  | `https://cdn.reptiles.ge/og/images/guides/${string}.jpg`;

export type GuideArticleSearch = {
  icon: SearchIcon;
  keywords: string[];
  rank?: number;
  subtitle: Record<AppLocale, string>;
  title: Record<AppLocale, string>;
};

export type GuideArticleSection<ImageKey extends string = string> = {
  heading: string;
  image?: ImageKey;
  list?: { items: string[]; ordered?: boolean };
  paragraphs: string[];
};

export type GuideArticleSource = {
  name: string;
  supports: Record<AppLocale, string>;
  url: string;
};

export function defineGuideArticle<ImageKey extends string = never>(
  article: GuideArticle<ImageKey>,
): GuideArticle<ImageKey> {
  return article;
}
