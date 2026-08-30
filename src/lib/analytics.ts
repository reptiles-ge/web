import { getSpeciesAtlasMeta, type AnimalGroup } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";

export type AnalyticsValue = string | number | boolean;

export type PageType =
  | "home"
  | "species"
  | "hub"
  | "guide"
  | "atlas"
  | "region"
  | "region_index"
  | "quiz"
  | "quiz_index"
  | "about"
  | "contact"
  | "not_found"
  | "other";

export type SpeciesClickSource =
  | "related"
  | "identification"
  | "search"
  | "atlas"
  | "hub"
  | "index"
  | "carousel"
  | "home_spotlight"
  | "map_panel"
  | "region"
  | "guide"
  | "quiz_question"
  | "quiz_result"
  | "footer"
  | "other";

export type MapContext = "home" | "atlas" | "region_page" | "guide";

export type QuizCtaSource = "species" | "hub" | "quiz_index" | "other";

type DataLayerRecord = Record<string, AnalyticsValue | undefined> & {
  event?: string;
};

declare global {
  interface Window {
    dataLayer?: DataLayerRecord[];
  }
}

const SEARCH_TERM_MAX = 100;

export function truncateSearchTerm(term: string) {
  return term.trim().slice(0, SEARCH_TERM_MAX);
}

export function currentLanguage(): AppLocale {
  if (typeof document === "undefined") return "ka";
  return document.documentElement.lang === "en" ? "en" : "ka";
}

function compact(params: Record<string, AnalyticsValue | undefined>) {
  const next: Record<string, AnalyticsValue> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) next[key] = value;
  }
  return next;
}

function push(payload: DataLayerRecord) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function pushPageContext(params: {
  language: AppLocale;
  page_type: PageType;
  group?: AnimalGroup | string;
  entity_id?: string;
}) {
  push({
    event: "page_context",
    ...compact({
      language: params.language,
      page_type: params.page_type,
      group: params.group,
      entity_id: params.entity_id,
    }),
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, AnalyticsValue | undefined>,
) {
  push({
    event: name,
    language: currentLanguage(),
    ...compact(params ?? {}),
  });
}

export function trackSpeciesClick(params: {
  species_id: string;
  source: SpeciesClickSource;
  position?: number;
  group?: AnimalGroup | string;
}) {
  const group = params.group ?? getSpeciesAtlasMeta(params.species_id).group;
  trackEvent("species_click", {
    species_id: params.species_id,
    group,
    source: params.source,
    position: params.position,
  });
}
