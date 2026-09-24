import { getGuideArticles } from "@/data/guideArticles";
import { getSpeciesById } from "@/data/species";
import {
  CLUSTER_GUIDE_LIST,
  getSpeciesGuideLinks,
  type HubClusterCard,
} from "@/lib/clusterGuides";
import { isPlaceholderMedia } from "@/lib/speciesContent";

export type SpeciesArticleLink = PageCard & { image: null | string };

export type SpeciesReading = {
  articles: SpeciesArticleLink[];
  featured: SpeciesArticleLink | undefined;
  shortcuts: PageCard[];
};

type PageCard = Extract<HubClusterCard, { kind: "page" }>;

const ARTICLE_PRIORITY: readonly PageCard["key"][] = [
  "bite",
  "spiderBite",
  "bearEncounter",
  "jackalYard",
  "stinkBugInHouse",
  "waspNest",
  "batInHouse",
  "identify",
  "lizardDarevskia",
  "glassLizard",
  "lizardHouse",
  "lizardIdentify",
  "turtleLand",
  "turtleWater",
  "turtleIdentify",
  "frogs",
  "newts",
  "spiderVenomous",
  "venomous",
  "yard",
  "largest",
  "range",
];

const ARTICLE_LIMIT = 4;
const SHORTCUT_LIMIT = 3;

const FIXED_ARTICLE_IMAGES: Partial<Record<PageCard["href"], string>> = {
  "/snakes-in-the-yard": "/images/guides/snakes-in-the-yard-cover.jpg",
};

const FIXED_ARTICLE_SPECIES: Partial<Record<PageCard["href"], string>> = {
  "/venomous-snakes": "macrovipera-lebetina",
};

export function getSpeciesReading(speciesId: string): SpeciesReading {
  const links = getSpeciesGuideLinks(speciesId);
  const candidates: PageCard[] = links.filter(isArticle);

  for (const article of getGuideArticles()) {
    if (!article.relatedSpeciesIds?.includes(speciesId)) continue;
    if (candidates.some((card) => card.href === article.pathname)) continue;
    candidates.push({
      href: article.pathname,
      key: article.messageKey,
      kind: "page",
    });
  }

  const ranked = candidates
    .sort(
      (a, b) =>
        ARTICLE_PRIORITY.indexOf(a.key) - ARTICLE_PRIORITY.indexOf(b.key),
    )
    .slice(0, ARTICLE_LIMIT)
    .map((card) => ({ ...card, image: articleImage(card.href) }));

  const shortcuts = links
    .filter(
      (card): card is PageCard => card.kind === "page" && !isArticle(card),
    )
    .slice(0, SHORTCUT_LIMIT);

  return {
    articles: ranked.length > 1 ? ranked.slice(1) : ranked,
    featured: ranked[0],
    shortcuts,
  };
}

function articleImage(href: PageCard["href"]) {
  const fixed = FIXED_ARTICLE_IMAGES[href];
  if (fixed) return fixed;
  const guideArticle = getGuideArticles().find(
    (article) => article.pathname === href,
  );
  if (guideArticle) return guideArticle.hero.src;
  const cluster = CLUSTER_GUIDE_LIST.find((guide) => guide.pathname === href);
  if (cluster?.heroImage) return cluster.heroImage;
  return speciesCover(cluster?.heroSpeciesId ?? FIXED_ARTICLE_SPECIES[href]);
}

function isArticle(card: HubClusterCard): card is PageCard {
  return card.kind === "page" && ARTICLE_PRIORITY.includes(card.key);
}

function speciesCover(id: string | undefined) {
  if (!id) return null;
  const species = getSpeciesById(id);
  if (!species) return null;
  if (species.mobileImage && !isPlaceholderMedia(species.mobileImage)) {
    return species.mobileImage;
  }
  return isPlaceholderMedia(species.image) ? null : species.image;
}
