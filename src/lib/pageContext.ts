import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import type { PageType } from "@/lib/analytics";
import { resolveQuizBySlug } from "@/lib/quizzes";
import { resolveSpeciesInHub } from "@/lib/speciesRoutes";
import type { AppLocale } from "@/i18n/routing";
import type { AnimalGroup } from "@/data/speciesAtlas";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";

const SPECIES_PATH_TO_HUB: Record<string, GroupHubId> = {
  "/snakes/[slug]": "snakes",
  "/lizards/[slug]": "lizards",
  "/turtles/[slug]": "turtles",
  "/amphibians/[slug]": "amphibians",
  "/birds/[slug]": "birds",
  "/mammals/[slug]": "mammals",
};

const HUB_BY_PATH = Object.fromEntries(
  GROUP_HUB_LIST.map((hub) => [hub.path, hub]),
);

const GUIDE_BY_PATH = Object.fromEntries(
  CLUSTER_GUIDE_LIST.map((guide) => [guide.pathname, guide]),
);

const STANDALONE_GUIDES = new Set([
  "/venomous-snakes",
  "/snakes-in-the-yard",
  "/risk-to-humans",
]);

export type ResolvedPageContext = {
  page_type: PageType;
  group?: AnimalGroup;
  entity_id?: string;
};

export function resolvePageContext(
  pathname: string,
  locale: AppLocale,
  params: { slug?: string; id?: string },
): ResolvedPageContext {
  if (pathname === "/") {
    return { page_type: "home" };
  }
  if (pathname === "/about") {
    return { page_type: "about" };
  }
  if (pathname === "/contact") {
    return { page_type: "contact" };
  }
  if (pathname === "/news") {
    return { page_type: "news" };
  }
  if (pathname === "/news/[slug]" && params.slug) {
    return { page_type: "news_article", entity_id: params.slug };
  }
  if (pathname === "/species") {
    return { page_type: "atlas" };
  }
  if (pathname === "/quiz") {
    return { page_type: "quiz_index" };
  }
  if (pathname === "/regions") {
    return { page_type: "region_index" };
  }
  if (pathname === "/regions/[id]" && params.id) {
    return { page_type: "region", entity_id: params.id };
  }
  if (pathname === "/quiz/[slug]" && params.slug) {
    const quiz = resolveQuizBySlug(locale, params.slug);
    return {
      page_type: "quiz",
      group: quiz?.group,
      entity_id: quiz?.id,
    };
  }

  const speciesHub = SPECIES_PATH_TO_HUB[pathname];
  if (speciesHub && params.slug) {
    const species = resolveSpeciesInHub(speciesHub, params.slug);
    if (species) {
      return {
        page_type: "species",
        group: getSpeciesAtlasMeta(species.id).group,
        entity_id: species.id,
      };
    }
    return { page_type: "other" };
  }

  const hub = HUB_BY_PATH[pathname];
  if (hub) {
    return {
      page_type: "hub",
      group: hub.group,
      entity_id: hub.id,
    };
  }

  const guide = GUIDE_BY_PATH[pathname];
  if (guide) {
    return {
      page_type: "guide",
      group: GROUP_HUB_LIST.find((item) => item.id === guide.parentHub)?.group,
      entity_id: guide.id,
    };
  }

  if (STANDALONE_GUIDES.has(pathname)) {
    return {
      page_type: "guide",
      group: "snake",
      entity_id: pathname.replace(/^\//, ""),
    };
  }

  return { page_type: "other" };
}
