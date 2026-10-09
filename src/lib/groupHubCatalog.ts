import type { DangerLevel } from "@/data/speciesTypes";
import type { HubClusterCard } from "@/lib/clusterGuides";
import type { LocaleSpeciesHref } from "@/lib/localeSwitch";

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

export type HubGuideCard = Exclude<HubClusterCard, { kind: "quiz" }>;

export type HubRiskFilter = "all" | "unrated" | DangerLevel;

export function hubGuideCards(cards: readonly HubClusterCard[]) {
  return cards.filter((card): card is HubGuideCard => card.kind !== "quiz");
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
