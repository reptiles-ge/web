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
import { creditPersonNames, creditPersonNamesStatement } from "./authors";
import {
  type SpeciesCatalogData,
  type SpeciesCatalogParts,
  speciesCatalogQuery,
} from "./speciesCatalog";

export type CatalogView = "card" | "full" | "photos" | "quiz";

type SearchRow = {
  common_name: string;
  locale: string;
  location: string;
  species_id: string;
};

const VIEW_KEYS = {
  card: SPECIES_CARD_KEYS,
  photos: SPECIES_PHOTO_KEYS,
  quiz: SPECIES_QUIZ_KEYS,
} as const;

const VIEW_PARTS: Record<CatalogView, SpeciesCatalogParts> = {
  card: {
    facts: false,
    faq: false,
    identification: false,
    longTexts: false,
    sources: false,
  },
  full: {
    facts: true,
    faq: true,
    identification: true,
    longTexts: true,
    sources: true,
  },
  photos: {
    facts: false,
    faq: false,
    identification: false,
    longTexts: false,
    sources: false,
  },
  quiz: {
    facts: true,
    faq: false,
    identification: true,
    longTexts: false,
    sources: false,
  },
};

const SEARCH_LOCALES = ["en", "ru", "tr"] as const;

export async function readLocalizedCatalog(
  db: ApiDatabase,
  locale: AppLocale,
  view: CatalogView,
  parts: SpeciesCatalogParts = VIEW_PARTS[view],
) {
  const query = speciesCatalogQuery(db, {
    locales: locale === "ka" ? [] : [locale],
    parts,
    published: true,
  });
  const results = (
    await db.batch([
      ...query.statements,
      db.prepare(
        "SELECT species_id, locale, common_name, location FROM species_texts WHERE locale != 'ka' AND species_id IN (SELECT id FROM species WHERE status = 'published')",
      ),
      ...(locale === "ka" ? [] : [creditPersonNamesStatement(db, locale)]),
    ])
  ).map((result) => result.results);
  const catalog = query.build(results.slice(0, query.statements.length));
  const [searchRows, nameRows] = results.slice(query.statements.length) as [
    SearchRow[],
    Array<{ alias: string; name: string }> | undefined,
  ];
  const personNames = nameRows ? creditPersonNames(nameRows) : () => undefined;
  const searchTexts = catalogSearchTexts(catalog, searchRows);
  const published = new Set(catalog.catalogIds);
  const reverse = new Map<string, string[]>();
  for (const [id, peers] of Object.entries(catalog.lookalikes)) {
    for (const peer of peers)
      reverse.set(peer, [...(reverse.get(peer) ?? []), id]);
  }
  return catalog.species
    .filter((base) => published.has(base.id))
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
      ].filter((peer) => published.has(peer));
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
        checklistStatus: meta.checklistStatus,
        class: meta.class,
        featured: meta.featured,
        group: meta.group,
        habitats: meta.habitats,
        lookalikes,
        order: meta.order,
        slug:
          locale === "ka" ? (catalog.kaSlugById[base.id] ?? base.id) : base.id,
        ...(view === "card"
          ? {
              slugAliases: (catalog.slugsById[base.id] ?? []).filter(
                (slug) =>
                  slug !== base.id && slug !== catalog.kaSlugById[base.id],
              ),
            }
          : {}),
      };
      return { entry, index };
    });
}

function catalogSearchTexts(catalog: SpeciesCatalogData, rows: SearchRow[]) {
  const translated = new Map(
    rows.map((row) => [`${row.species_id}:${row.locale}`, row]),
  );
  const texts = new Map<string, string>();
  for (const base of catalog.species) {
    const parts: Array<string | undefined> = [
      base.scientificName,
      base.genus,
      base.family,
      base.commonName,
      base.location,
    ];
    for (const locale of SEARCH_LOCALES) {
      const row = translated.get(`${base.id}:${locale}`);
      if (row) parts.push(row.common_name, row.location);
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
