import type { GuideArticlePath } from "@/data/guideArticlePaths";
import type { GuideArticle } from "@/data/guideArticleTypes";
import type { AppLocale } from "@/i18n/routing";

import { BAT_IN_HOUSE } from "@/content/guides/batInHouse";
import { STINK_BUG_IN_HOUSE } from "@/content/guides/stinkBugInHouse";
import { WASP_NEST } from "@/content/guides/waspNest";
import { slugify, transliterateKa } from "@/lib/slugify";

export type {
  GuideArticle,
  GuideArticleImage,
  GuideArticleSection,
} from "@/data/guideArticleTypes";

const GUIDE_ARTICLES: readonly GuideArticle[] = [
  BAT_IN_HOUSE,
  WASP_NEST,
  STINK_BUG_IN_HOUSE,
];

const byPath = new Map<GuideArticlePath, GuideArticle>();
const ids = new Set<string>();

for (const article of GUIDE_ARTICLES) {
  if (byPath.has(article.pathname)) {
    throw new Error(`Duplicate guide article pathname: ${article.pathname}`);
  }
  if (ids.has(article.id)) {
    throw new Error(`Duplicate guide article id: ${article.id}`);
  }
  byPath.set(article.pathname, article);
  ids.add(article.id);
}

export function getGuideArticleByPath(pathname: GuideArticlePath) {
  const article = byPath.get(pathname);
  if (!article) throw new Error(`Unknown guide article: ${pathname}`);
  return article;
}

export function getGuideArticles() {
  return GUIDE_ARTICLES;
}

export function guideArticleSectionAnchor(heading: string, locale: AppLocale) {
  return slugify(locale === "ka" ? transliterateKa(heading) : heading);
}
