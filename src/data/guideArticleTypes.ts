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
  relatedGuideIds?: readonly string[];
  relatedSpeciesIds?: readonly string[];
  search: GuideArticleSearch;
  sources: readonly GuideArticleSource[];
};

export type GuideArticleCopy<ImageKey extends string = string> = {
  description: string;
  faq: GuideArticleFaq[];
  intro?: string;
  metaTitle: string;
  notice?: string;
  quickActions?: {
    heading: string;
    items: string[];
    links?: { heading: string; label: string }[];
    warning: string;
  };
  quickSteps?: { heading: string; items: string[] };
  sections: GuideArticleSection<ImageKey>[];
  summary: string;
  title: string;
};

export type GuideArticleImage = {
  alt: Record<AppLocale, string>;
  credit?: Record<AppLocale, string>;
  creditUrl?: string;
  height: number;
  license?: { name: string; url: string };
  src: `/images/guides/${string}` | `https://cdn.reptiles.ge/${string}`;
  width: number;
};

export type GuideArticleMessageKey =
  | "antsInHouse"
  | "batInHouse"
  | "bedBugsAtHome"
  | "bite"
  | "clothesMoth"
  | "cockroachesInHouse"
  | "fleasInHouse"
  | "gyurzaBite"
  | "mosquitoesAtHome"
  | "mouseInHouse"
  | "scorpionInHouse"
  | "scorpionSting"
  | "stinkBugInHouse"
  | "tickBite"
  | "waspNest";

export type GuideArticleSection<ImageKey extends string = string> = {
  heading: string;
  image?: ImageKey;
  list?: { items: string[]; ordered?: boolean };
  paragraphs: string[];
  table?: {
    headers: [string, string, string];
    rows: [string, string, string][];
  };
};

export type GuideArticleSource = {
  name: string;
  supports: Record<AppLocale, string>;
  url: string;
};

type GuideArticleFaq = { answer: string; question: string };

type GuideArticleOgImage =
  | `/og/images/guides/${string}.jpg`
  | `https://cdn.reptiles.ge/og/images/guides/${string}.jpg`
  | `https://cdn.reptiles.ge/v2/og/images/guides/${string}.jpg`;

type GuideArticleSearch = {
  icon: SearchIcon;
  keywords: string[];
  rank?: number;
  subtitle: Record<AppLocale, string>;
  title: Record<AppLocale, string>;
};

export function defineGuideArticle<ImageKey extends string = never>(
  article: GuideArticle<ImageKey>,
): GuideArticle<ImageKey> {
  return article;
}
