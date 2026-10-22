import type { AppLocale } from "@/i18n/routing";

import {
  type Species,
  SPECIES_CARD_KEYS,
  SPECIES_QUIZ_KEYS,
} from "@/data/speciesTypes";
import { applySpeciesTranslation } from "@/i18n/speciesTranslation";

import type { ApiDatabase } from "./database";

import { readSpeciesCatalog } from "./speciesCatalog";

export type CatalogView = "card" | "full" | "quiz";

const VIEW_KEYS = {
  card: SPECIES_CARD_KEYS,
  quiz: SPECIES_QUIZ_KEYS,
} as const;

export async function readLocalizedCatalog(
  db: ApiDatabase,
  locale: AppLocale,
  view: CatalogView,
) {
  const catalog = await readSpeciesCatalog(db);
  const unpublished = new Set(catalog.unpublishedIds);
  const reverse = new Map<string, string[]>();
  for (const [id, peers] of Object.entries(catalog.lookalikes)) {
    for (const peer of peers)
      reverse.set(peer, [...(reverse.get(peer) ?? []), id]);
  }
  return catalog.species
    .filter((base) => !unpublished.has(base.id))
    .map((base) => {
      const translation =
        locale === "ka" ? undefined : catalog.translations[locale][base.id];
      const species = translation
        ? applySpeciesTranslation(base, translation, locale)
        : base;
      const meta = catalog.atlasMeta[base.id]!;
      const direct = catalog.lookalikes[base.id] ?? [];
      const directSet = new Set(direct);
      const lookalikes = [
        ...direct,
        ...(reverse.get(base.id) ?? [])
          .filter((peer) => !directSet.has(peer))
          .sort(),
      ].filter((peer) => !unpublished.has(peer));
      return {
        ...(view === "full" ? species : pickKeys(species, VIEW_KEYS[view])),
        ...(view === "card" ? { photoCount: species.gallery.length } : {}),
        group: meta.group,
        habitats: meta.habitats,
        lookalikes,
        slug:
          locale === "ka" ? (catalog.kaSlugById[base.id] ?? base.id) : base.id,
      };
    });
}

function pickKeys(species: Species, keys: ReadonlyArray<keyof Species>) {
  const picked: Partial<Record<keyof Species, unknown>> = {};
  for (const key of keys) {
    if (species[key] !== undefined) picked[key] = species[key];
  }
  return picked;
}
