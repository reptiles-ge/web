import type { GuideArticlePath } from "@/data/guideArticlePaths";
import type { GuideArticle } from "@/data/guideArticleTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { ANTS_IN_HOUSE } from "@/content/guides/antsInHouse";
import { BAT_IN_HOUSE } from "@/content/guides/batInHouse";
import { CLOTHES_MOTH } from "@/content/guides/clothesMoth";
import { COCKROACHES_IN_HOUSE } from "@/content/guides/cockroachesInHouse";
import { FLEAS_IN_HOUSE } from "@/content/guides/fleasInHouse";
import { GYURZA_BITE } from "@/content/guides/gyurzaBite";
import { MOSQUITOES_AT_HOME } from "@/content/guides/mosquitoesAtHome";
import { MOUSE_IN_HOUSE } from "@/content/guides/mouseInHouse";
import { SCORPION_IN_HOUSE } from "@/content/guides/scorpionInHouse";
import { SCORPION_STING } from "@/content/guides/scorpionSting";
import { SNAKE_BITE } from "@/content/guides/snakeBite";
import { STINK_BUG_IN_HOUSE } from "@/content/guides/stinkBugInHouse";
import { TICK_BITE } from "@/content/guides/tickBite";
import { WASP_NEST } from "@/content/guides/waspNest";
import { sitemapPathDatePublished } from "@/data/pageLastModified";
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
  MOUSE_IN_HOUSE,
  MOSQUITOES_AT_HOME,
  ANTS_IN_HOUSE,
  CLOTHES_MOTH,
  COCKROACHES_IN_HOUSE,
  FLEAS_IN_HOUSE,
  SCORPION_IN_HOUSE,
  SCORPION_STING,
  SNAKE_BITE,
  GYURZA_BITE,
  TICK_BITE,
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

export function getGuideArticlesForHub(hubId: GroupHubId) {
  return GUIDE_ARTICLES.filter((article) => article.parentHub === hubId).sort(
    (a, b) =>
      guideArticleDatePublished(b).localeCompare(guideArticleDatePublished(a)),
  );
}

export function guideArticleDatePublished(article: GuideArticle) {
  return sitemapPathDatePublished(article.pathname);
}

export function guideArticleSectionAnchor(heading: string, locale: AppLocale) {
  return slugify(locale === "ka" ? transliterateKa(heading) : heading);
}
