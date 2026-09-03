import type { AnimalGroup } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";
import type { PageType } from "@/lib/analytics";

import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import { resolveQuizBySlug } from "@/lib/quizzes";
import { resolveSpeciesInHub } from "@/lib/speciesRoutes";

const SPECIES_PATH_TO_HUB: Record<string, GroupHubId> = {
  "/amphibians/[slug]": "amphibians",
  "/birds/[slug]": "birds",
  "/lizards/[slug]": "lizards",
  "/mammals/[slug]": "mammals",
  "/snakes/[slug]": "snakes",
  "/spiders/[slug]": "spiders",
  "/turtles/[slug]": "turtles",
};

const HUB_BY_PATH = Object.fromEntries(
  GROUP_HUB_LIST.map((hub) => [hub.path, hub]),
);

const GUIDE_BY_PATH = Object.fromEntries(
  CLUSTER_GUIDE_LIST.map((guide) => [guide.pathname, guide]),
);

const STANDALONE_GUIDES = new Set([
  "/risk-to-humans",
  "/snakes-in-the-yard",
  "/venomous-snakes",
]);

export type ResolvedPageContext = {
  entity_id?: string;
  group?: AnimalGroup;
  page_type: PageType;
};

export function resolvePageContext(
  pathname: string,
  locale: AppLocale,
  params: { id?: string; slug?: string },
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
    return { entity_id: params.slug, page_type: "news_article" };
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
    return { entity_id: params.id, page_type: "region" };
  }
  if (pathname === "/quiz/[slug]" && params.slug) {
    const quiz = resolveQuizBySlug(locale, params.slug);
    return {
      entity_id: quiz?.id,
      group: quiz?.group,
      page_type: "quiz",
    };
  }

  const speciesHub = SPECIES_PATH_TO_HUB[pathname];
  if (speciesHub && params.slug) {
    const species = resolveSpeciesInHub(speciesHub, params.slug);
    if (species) {
      return {
        entity_id: species.id,
        group: getSpeciesAtlasMeta(species.id).group,
        page_type: "species",
      };
    }
    return { page_type: "other" };
  }

  const hub = HUB_BY_PATH[pathname];
  if (hub) {
    return {
      entity_id: hub.id,
      group: hub.group,
      page_type: "hub",
    };
  }

  const guide = GUIDE_BY_PATH[pathname];
  if (guide) {
    return {
      entity_id: guide.id,
      group: GROUP_HUB_LIST.find((item) => item.id === guide.parentHub)?.group,
      page_type: "guide",
    };
  }

  if (STANDALONE_GUIDES.has(pathname)) {
    return {
      entity_id: pathname.replace(/^\//, ""),
      group: "snake",
      page_type: "guide",
    };
  }

  return { page_type: "other" };
}
