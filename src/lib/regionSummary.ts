import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { getRegionContent } from "@/data/regionContent";
import {
  getRegionById,
  getRegionSpecies,
  localizeRegionText,
  type Region,
} from "@/data/regions";
import { type AnimalGroup, isVenomousDanger } from "@/data/speciesAtlasMeta";
import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";

const GROUP_ORDER = [
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "scorpion",
  "spider",
  "insect",
] as const satisfies readonly AnimalGroup[];

const REPTILE_GROUPS: readonly AnimalGroup[] = ["snake", "lizard", "turtle"];

export type RegionSummaryFacts = {
  amphibians: number;
  groups: { count: number; group: (typeof GROUP_ORDER)[number] }[];
  reptiles: number;
  total: number;
  venomous: CatalogCard[];
};

export async function getRegionSummary(
  region: Region,
  locale: AppLocale,
): Promise<string[]> {
  const [t, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "regions.summary" }),
    getSpeciesCatalog(locale),
  ]);
  const content = getRegionContent(region.id);
  const facts = regionSummaryFacts(region, catalog);
  const list = new Intl.ListFormat(locale, { type: "conjunction" });
  const nameIn = localizeRegionText(region.nameIn, locale);

  const landscape = [
    t("habitats", {
      biome: localizeRegionText(content.biome, locale),
      habitats: content.habitats
        .map((habitat) => withoutFinalStop(localizeRegionText(habitat, locale)))
        .join("; "),
      nameIn,
    }),
    t("counts", {
      count: facts.total,
      groups: list.format(
        facts.groups.map(({ count, group }) => t(`group.${group}`, { count })),
      ),
      nameIn,
    }),
    t("herps", { amphibians: facts.amphibians, reptiles: facts.reptiles }),
  ];

  const risk =
    facts.venomous.length > 0
      ? [
          t("venomous", {
            count: facts.venomous.length,
            species: list.format(
              facts.venomous.map(
                (item) => `${item.commonName} (${item.scientificName})`,
              ),
            ),
          }),
          t("safety"),
        ]
      : [t("venomousNone")];

  const related = content.relatedIds
    .map((id) => getRegionById(id))
    .filter((item): item is Region => Boolean(item))
    .map((item) => localizeRegionText(item.name, locale));

  const scope = [
    t("scope", { nameIn }),
    ...(related.length > 0
      ? [t("related", { regions: list.format(related) })]
      : []),
  ];

  return [landscape.join(" "), risk.join(" "), scope.join(" ")];
}

export function regionSummaryFacts(
  region: Region,
  catalog: readonly CatalogCard[],
): RegionSummaryFacts {
  const species = getRegionSpecies(region, catalog);
  const counts = new Map<AnimalGroup, number>();
  for (const { group } of species) {
    counts.set(group, (counts.get(group) ?? 0) + 1);
  }
  const groups = GROUP_ORDER.flatMap((group) => {
    const count = counts.get(group) ?? 0;
    return count > 0 ? [{ count, group }] : [];
  }).sort((a, b) => b.count - a.count);
  return {
    amphibians: counts.get("amphibian") ?? 0,
    groups,
    reptiles: REPTILE_GROUPS.reduce(
      (sum, group) => sum + (counts.get(group) ?? 0),
      0,
    ),
    total: species.length,
    venomous: species.filter((item) => isVenomousDanger(item.danger)),
  };
}

function withoutFinalStop(text: string) {
  return text.trim().replace(/\.$/, "");
}
