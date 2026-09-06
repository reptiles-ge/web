import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
} from "@/data/speciesAtlasMeta";
import { type AppLocale, routing } from "@/i18n/routing";

export type AnalyticsValue = boolean | number | string;

export type MapContext = "atlas" | "guide" | "home" | "region_page";

export type PageType =
  | "about"
  | "atlas"
  | "author"
  | "author_index"
  | "contact"
  | "guide"
  | "home"
  | "hub"
  | "news"
  | "news_article"
  | "not_found"
  | "other"
  | "quiz"
  | "quiz_index"
  | "region"
  | "region_index"
  | "species";

export type QuizCtaSource = "hub" | "other" | "quiz_index" | "species";

export type SpeciesClickSource =
  | "atlas"
  | "author"
  | "carousel"
  | "footer"
  | "guide"
  | "home_contributors"
  | "home_featured"
  | "home_fresh"
  | "home_safety"
  | "home_spotlight"
  | "hub"
  | "identification"
  | "index"
  | "lookalike"
  | "map_panel"
  | "other"
  | "quiz_question"
  | "quiz_result"
  | "region"
  | "related"
  | "search";

type DataLayerRecord = Record<string, AnalyticsValue | undefined> & {
  event?: string;
};

declare global {
  interface Window {
    dataLayer?: DataLayerRecord[];
  }
}

const SEARCH_TERM_MAX = 100;

export function currentLanguage(): AppLocale {
  if (typeof document === "undefined") return "ka";
  const lang = document.documentElement.lang;
  if (routing.locales.includes(lang as AppLocale)) {
    return lang as AppLocale;
  }
  return "ka";
}

export function pushPageContext(params: {
  entity_id?: string;
  group?: AnimalGroup | string;
  language: AppLocale;
  page_type: PageType;
}) {
  push({
    event: "page_context",
    ...compact({
      entity_id: params.entity_id,
      group: params.group,
      language: params.language,
      page_type: params.page_type,
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
  group?: AnimalGroup | string;
  position?: number;
  source: SpeciesClickSource;
  species_id: string;
}) {
  const group =
    params.group ?? getSpeciesAtlasMeta(params.species_id).group;
  trackEvent("species_click", {
    group,
    position: params.position,
    source: params.source,
    species_id: params.species_id,
  });
}

export function truncateSearchTerm(term: string) {
  return term.trim().slice(0, SEARCH_TERM_MAX);
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
