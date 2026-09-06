import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { AppLocale } from "@/i18n/routing";
import type { PageType } from "@/lib/analytics";

export type LocaleSpeciesHref = {
  params: { slug: string };
  pathname:
    | "/amphibians/[slug]"
    | "/birds/[slug]"
    | "/lizards/[slug]"
    | "/mammals/[slug]"
    | "/snakes/[slug]"
    | "/spiders/[slug]"
    | "/turtles/[slug]";
};

export type LocaleSwitchGuide = {
  group: AnimalGroup;
  id: string;
};

export type LocaleSwitchHubId =
  | "amphibians"
  | "birds"
  | "lizards"
  | "mammals"
  | "snakes"
  | "spiders"
  | "turtles";

export type LocaleSwitchIndex = {
  groupById: Record<string, AnimalGroup>;
  guides: Record<string, LocaleSwitchGuide>;
  hubById: Record<string, LocaleSwitchHubId>;
  idBySlug: Record<string, string>;
  kaSlugById: Record<string, string>;
  quizzes: LocaleSwitchQuiz[];
};

export type LocaleSwitchQuiz = {
  group: "lizard" | "snake";
  id: "lizard" | "snake";
  slugs: Record<AppLocale, string>;
};

export type ResolvedPageContext = {
  entity_id?: string;
  group?: AnimalGroup;
  page_type: PageType;
};

const SPECIES_PATH_TO_HUB: Record<string, LocaleSwitchHubId> = {
  "/amphibians/[slug]": "amphibians",
  "/birds/[slug]": "birds",
  "/lizards/[slug]": "lizards",
  "/mammals/[slug]": "mammals",
  "/snakes/[slug]": "snakes",
  "/spiders/[slug]": "spiders",
  "/turtles/[slug]": "turtles",
};

const HUB_BY_PATH: Record<
  string,
  { group: AnimalGroup; id: LocaleSwitchHubId }
> = {
  "/amphibians": { group: "amphibian", id: "amphibians" },
  "/birds": { group: "bird", id: "birds" },
  "/lizards": { group: "lizard", id: "lizards" },
  "/mammals": { group: "mammal", id: "mammals" },
  "/snakes": { group: "snake", id: "snakes" },
  "/spiders": { group: "spider", id: "spiders" },
  "/turtles": { group: "turtle", id: "turtles" },
};

const STANDALONE_GUIDES = new Set([
  "/risk-to-humans",
  "/snakes-in-the-yard",
  "/venomous-snakes",
]);

export function quizHrefFromIndex(
  index: LocaleSwitchIndex,
  id: string,
  locale: AppLocale,
) {
  const quiz = index.quizzes.find((item) => item.id === id);
  const slug = quiz?.slugs[locale];
  if (!slug) {
    return { params: { slug: "romeli-gvelia" }, pathname: "/quiz/[slug]" as const };
  }
  return { params: { slug }, pathname: "/quiz/[slug]" as const };
}

export function resolvePageContextFromIndex(
  index: LocaleSwitchIndex,
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
  if (pathname === "/authors/[slug]" && params.slug) {
    return { entity_id: params.slug, page_type: "author" };
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
    const quiz = index.quizzes.find((item) => item.slugs[locale] === params.slug);
    return {
      entity_id: quiz?.id,
      group: quiz?.group,
      page_type: "quiz",
    };
  }

  const speciesHub = SPECIES_PATH_TO_HUB[pathname];
  if (speciesHub && params.slug) {
    const id = resolveSpeciesIdFromIndex(index, params.slug);
    if (id && index.hubById[id] === speciesHub) {
      return {
        entity_id: id,
        group: index.groupById[id],
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

  const guide = index.guides[pathname];
  if (guide) {
    return {
      entity_id: guide.id,
      group: guide.group,
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

export function resolveSpeciesIdFromIndex(
  index: LocaleSwitchIndex,
  slug: string,
) {
  return index.idBySlug[slug];
}

export function speciesHrefFromIndex(
  index: LocaleSwitchIndex,
  id: string,
  locale: AppLocale,
): LocaleSpeciesHref {
  const hub = index.hubById[id];
  const slug = locale === "ka" ? (index.kaSlugById[id] ?? id) : id;
  switch (hub) {
    case "birds":
      return { params: { slug }, pathname: "/birds/[slug]" };
    case "lizards":
      return { params: { slug }, pathname: "/lizards/[slug]" };
    case "mammals":
      return { params: { slug }, pathname: "/mammals/[slug]" };
    case "snakes":
      return { params: { slug }, pathname: "/snakes/[slug]" };
    case "spiders":
      return { params: { slug }, pathname: "/spiders/[slug]" };
    case "turtles":
      return { params: { slug }, pathname: "/turtles/[slug]" };
    default:
      return { params: { slug }, pathname: "/amphibians/[slug]" };
  }
}
