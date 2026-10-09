import type { DangerLevel } from "@/data/speciesTypes";
import type { HubClusterCard } from "@/lib/clusterGuides";
import type { GroupHubId } from "@/lib/groupHubs";
import type { LocaleSpeciesHref } from "@/lib/localeSwitch";

export type HubFeaturedGuide = {
  card: string;
  imageSpeciesId: string;
  rows: readonly string[];
};

export const HUB_FEATURED_GUIDE: Partial<Record<GroupHubId, HubFeaturedGuide>> =
  {
    snakes: {
      card: "venomous",
      imageSpeciesId: "macrovipera-lebetina",
      rows: ["identify", "bite", "gyurzaBite"],
    },
    spiders: {
      card: "spiderVenomous",
      imageSpeciesId: "latrodectus-tredecimguttatus",
      rows: ["spiderBite", "spiderIndex", "dangerousAnimals"],
    },
  };

export const HUB_EMERGENCY_GUIDES: Partial<
  Record<GroupHubId, readonly string[]>
> = {
  snakes: ["bite", "gyurzaBite", "yard"],
  spiders: ["spiderBite", "spiderVenomous"],
};

export const EMERGENCY_GUIDE_KEYS: ReadonlySet<string> = new Set([
  "bite",
  "spiderBite",
]);

export const HUB_QUIZ: Partial<
  Record<GroupHubId, { id: "lizard" | "snake"; namespace: string }>
> = {
  lizards: { id: "lizard", namespace: "lizardQuiz" },
  snakes: { id: "snake", namespace: "snakeQuiz" },
};

export const HUB_CATALOG_INITIAL = { desktop: 16, mobile: 8 } as const;

export const HUB_DISPLAY_ORDER: readonly GroupHubId[] = [
  "snakes",
  "lizards",
  "turtles",
  "amphibians",
  "birds",
  "mammals",
  "spiders",
  "scorpions",
  "insects",
];

export type HubCatalogItem = {
  alt: string;
  href: LocaleSpeciesHref;
  id: string;
  image: string;
  mobileImage?: string;
  name: string;
  risk: DangerLevel | null;
  scientificName: string;
};

export type HubRiskFilter = "all" | "unrated" | DangerLevel;

export function hubGuideCards(cards: readonly HubClusterCard[]) {
  return cards.filter(
    (card): card is Exclude<HubClusterCard, { kind: "quiz" }> =>
      card.kind !== "quiz",
  );
}

export function matchesHubCatalog(
  item: Pick<HubCatalogItem, "name" | "risk" | "scientificName">,
  filter: HubRiskFilter,
  query: string,
) {
  if (filter !== "all" && riskFilterOf(item) !== filter) return false;
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return (
    item.name.toLocaleLowerCase().includes(needle) ||
    item.scientificName.toLocaleLowerCase().includes(needle)
  );
}

export function riskFilterOf(item: Pick<HubCatalogItem, "risk">) {
  return item.risk ?? "unrated";
}
