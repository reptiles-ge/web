import { getPublishedNewsArticleBySlug, newsLocalizedTitle } from "@/data/news";
import { getRegionById } from "@/data/regions";
import { pathnames } from "@/i18n/pathnames";
import { type AppLocale, type AppPathnames } from "@/i18n/routing";
import { CLUSTER_GUIDE_LIST, type ClusterMessageKey } from "@/lib/clusterGuides";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import { resolveQuizBySlug } from "@/lib/quizzes";
import { resolveSpecies, resolveSpeciesInHub } from "@/lib/speciesRoutes";

import ka from "../../messages/ka.json";

const SPECIES_PATH_TO_HUB: Partial<Record<AppPathnames, GroupHubId>> = {
  "/amphibians/[slug]": "amphibians",
  "/birds/[slug]": "birds",
  "/lizards/[slug]": "lizards",
  "/mammals/[slug]": "mammals",
  "/snakes/[slug]": "snakes",
  "/spiders/[slug]": "spiders",
  "/turtles/[slug]": "turtles",
};

const CLUSTER_FOOTER_KEY: Record<
  ClusterMessageKey,
  keyof typeof ka.footer
> = {
  amphibianFrogs: "frogs",
  amphibianFrogsIndex: "frogsIndex",
  amphibianIndex: "amphibianIndex",
  amphibianNewts: "newts",
  birdIndex: "birdIndex",
  lizardCompare: "glassLizard",
  lizardDarevskia: "darevskia",
  lizardIdentify: "lizardIdentify",
  lizardIndex: "lizardIndex",
  mammalIndex: "mammalIndex",
  snakeBite: "snakeBite",
  snakeIdentify: "snakeIdentify",
  snakeIndex: "snakeIndex",
  snakeLargest: "snakeLargest",
  snakeRange: "snakeRange",
  turtleIdentify: "turtleIdentify",
  turtleIndex: "turtleIndex",
  turtleLand: "turtleLand",
  turtleWater: "turtleWater",
};

const STATIC_TITLES: Partial<Record<AppPathnames, string>> = {
  "/": "მთავარი",
  "/about": ka.footer.about,
  "/amphibians": ka.footer.amphibians,
  "/birds": ka.footer.birds,
  "/contact": ka.footer.contact,
  "/lizards": ka.footer.lizards,
  "/mammals": ka.footer.mammals,
  "/news": ka.footer.news,
  "/quiz": ka.footer.quizzes,
  "/regions": ka.footer.regions,
  "/risk-to-humans": ka.footer.riskLevels,
  "/snakes": ka.footer.snakes,
  "/snakes-in-the-yard": ka.footer.yard,
  "/species": ka.footer.species,
  "/spiders": ka.footer.spiders,
  "/turtles": ka.footer.turtles,
  "/venomous-snakes": ka.footer.venomous,
};

const GUIDE_BY_PATH = Object.fromEntries(
  CLUSTER_GUIDE_LIST.map((guide) => [guide.pathname, guide]),
);

const HUB_BY_PATH = Object.fromEntries(
  GROUP_HUB_LIST.map((hub) => [hub.path, hub]),
);

const TITLE_MAX = 80;

export function displayVisitPath(path: string) {
  const pathname = path.split("?")[0]?.trim() || "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function visitLocaleFromPath(pathname: string): AppLocale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  if (pathname === "/tr" || pathname.startsWith("/tr/")) return "tr";
  return "ka";
}

export function visitPageLabel(path: string) {
  const pathname = displayVisitPath(path);
  const locale = visitLocaleFromPath(pathname);
  const publicPath = stripLocalePrefix(pathname, locale);
  const match = matchPublicPath(publicPath, locale);
  if (!match) return undefined;
  const title = titleForMatch(match, locale);
  if (!title) return undefined;
  return title.length > TITLE_MAX ? `${title.slice(0, TITLE_MAX - 1)}…` : title;
}

function localizedPattern(internal: AppPathnames, locale: AppLocale) {
  const value = pathnames[internal];
  if (typeof value === "string") return value;
  return value[locale];
}

function matchPattern(pattern: string, path: string) {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    const value = pathParts[i];
    if (part.startsWith("[") && part.endsWith("]")) {
      params[part.slice(1, -1)] = value;
      continue;
    }
    if (part !== value) return null;
  }
  return params;
}

function matchPublicPath(publicPath: string, locale: AppLocale) {
  const entries = (Object.keys(pathnames) as AppPathnames[])
    .map((internal) => ({
      internal,
      pattern: localizedPattern(internal, locale),
    }))
    .sort(
      (a, b) => b.pattern.split("/").length - a.pattern.split("/").length,
    );

  for (const { internal, pattern } of entries) {
    const params = matchPattern(pattern, publicPath);
    if (params) return { internal, params };
  }
  return null;
}

function stripLocalePrefix(pathname: string, locale: AppLocale) {
  if (locale === "ka") return pathname;
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  return pathname.slice(prefix.length) || "/";
}

function titleForMatch(
  match: { internal: AppPathnames; params: Record<string, string> },
  locale: AppLocale,
) {
  const hub = SPECIES_PATH_TO_HUB[match.internal];
  if (hub && match.params.slug) {
    return resolveSpeciesInHub(hub, match.params.slug)?.commonName;
  }
  if (match.internal === "/species/[id]" && match.params.id) {
    return resolveSpecies(match.params.id)?.commonName;
  }
  if (match.internal === "/regions/[id]" && match.params.id) {
    return getRegionById(match.params.id)?.name.ka;
  }
  if (match.internal === "/news/[slug]" && match.params.slug) {
    const article = getPublishedNewsArticleBySlug(match.params.slug);
    return article ? newsLocalizedTitle(article, "ka") : undefined;
  }
  if (match.internal === "/quiz/[slug]" && match.params.slug) {
    const quiz = resolveQuizBySlug(locale, match.params.slug);
    if (quiz?.id === "snake") return ka.footer.snakeQuiz;
    if (quiz?.id === "lizard") return ka.footer.lizardQuiz;
  }
  const guide = GUIDE_BY_PATH[match.internal];
  if (guide) {
    return ka.footer[CLUSTER_FOOTER_KEY[guide.messageKey]];
  }
  const hubPage = HUB_BY_PATH[match.internal];
  if (hubPage) {
    return ka.footer[hubPage.messageKey];
  }
  return STATIC_TITLES[match.internal];
}
