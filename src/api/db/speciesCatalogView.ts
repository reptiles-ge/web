import type { AppLocale } from "@/i18n/routing";

import {
  type Species,
  SPECIES_CARD_KEYS,
  SPECIES_PHOTO_KEYS,
  SPECIES_QUIZ_KEYS,
} from "@/data/speciesTypes";
import { applySpeciesTranslation } from "@/i18n/speciesTranslation";

import type { CatalogIndexEntry } from "../lib/catalogFilter";
import type { ApiDatabase } from "./database";

import { hasCatalogPhoto, speciesRegionIds } from "../lib/catalogFilter";
import { readCreditPersonNames } from "./authors";
import { readSpeciesCatalog, type SpeciesCatalogData } from "./speciesCatalog";

export type CatalogView = "card" | "full" | "photos" | "quiz";

const VIEW_KEYS = {
  card: SPECIES_CARD_KEYS,
  photos: SPECIES_PHOTO_KEYS,
  quiz: SPECIES_QUIZ_KEYS,
} as const;

export async function readLocalizedCatalog(
  db: ApiDatabase,
  locale: AppLocale,
  view: CatalogView,
) {
  const [catalog, personNames] = await Promise.all([
    readSpeciesCatalog(db),
    readCreditPersonNames(db, locale),
  ]);
  const unpublished = new Set(catalog.unpublishedIds);
  const reverse = new Map<string, string[]>();
  for (const [id, peers] of Object.entries(catalog.lookalikes)) {
    for (const peer of peers)
      reverse.set(peer, [...(reverse.get(peer) ?? []), id]);
  }
  const searchTexts = catalogSearchTexts(catalog);
  return catalog.species
    .filter((base) => !unpublished.has(base.id))
    .map((base) => {
      const translation =
        locale === "ka" ? undefined : catalog.translations[locale][base.id];
      const species = translation
        ? applySpeciesTranslation(base, translation, locale, personNames)
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
      const index: CatalogIndexEntry = {
        commonName: species.commonName,
        group: meta.group,
        habitats: meta.habitats,
        hasPhoto: hasCatalogPhoto(species),
        id: base.id,
        photoCount: species.gallery.length,
        regionIds: speciesRegionIds(base.id),
        searchText: searchTexts.get(base.id) ?? "",
        ...(species.danger ? { danger: species.danger } : {}),
        ...(species.updatedAt ? { updatedAt: species.updatedAt } : {}),
      };
      const entry = {
        ...(view === "full" ? species : pickKeys(species, VIEW_KEYS[view])),
        ...(view === "card" ? { photoCount: species.gallery.length } : {}),
        group: meta.group,
        habitats: meta.habitats,
        lookalikes,
        slug:
          locale === "ka" ? (catalog.kaSlugById[base.id] ?? base.id) : base.id,
      };
      return { entry, index };
    });
}

function catalogSearchTexts(catalog: SpeciesCatalogData) {
  const texts = new Map<string, string>();
  for (const base of catalog.species) {
    const parts: Array<string | undefined> = [
      base.scientificName,
      base.genus,
      base.family,
      base.commonName,
      base.location,
    ];
    for (const translations of Object.values(catalog.translations)) {
      const translation = translations[base.id];
      if (translation) parts.push(translation.commonName, translation.location);
    }
    texts.set(base.id, parts.filter(Boolean).join(" ").toLowerCase());
  }
  return texts;
}

function pickKeys(species: Species, keys: ReadonlyArray<keyof Species>) {
  const picked: Partial<Record<keyof Species, unknown>> = {};
  for (const key of keys) {
    if (species[key] !== undefined) picked[key] = species[key];
  }
  return picked;
}
