import type { AnimalGroup, HabitatTag } from "@/data/speciesAtlasMeta";
import type {
  GalleryImage,
  PhotoCredit,
  Species,
  SpeciesFieldRecord,
  SpeciesRangeMap,
  SpeciesTranslation,
} from "@/data/speciesTypes";

import {
  RANGE_MAP_TEXT_KEYS,
  SPECIES_TABLES,
  type SpeciesTable,
} from "./speciesSchema";

export type SpeciesRecord = {
  base: Species;
  catalogPosition: number;
  fieldRecords: SpeciesFieldRecord[];
  group: AnimalGroup;
  habitats: HabitatTag[];
  lookalikes: string[];
  rangeMap: null | SpeciesRangeMap;
  slugKa: null | string;
  slugs: string[];
  status: SpeciesStatus;
  translations: Record<TranslationLocale, SpeciesTranslation>;
};

export type SpeciesStatus = "draft" | "published" | "unpublished";

export type SqlExpression = { sql: string; values: SqlValue[] };

export type SqlValue = null | number | string;

export type TranslationLocale = "en" | "ru" | "tr";

type Cell = SqlExpression | SqlValue;

type TextSource = {
  behavior: string;
  commonName: string;
  conservation: string;
  description: string;
  diet: string;
  facts: string[];
  faq?: Array<{ answer: string; question: string }>;
  habitat: string;
  identification?: {
    coloration?: string;
    summary: string;
    traits: string[];
  };
  interaction?: string;
  location: string;
  overview: string;
  stats: Array<{ label: string; value: string }>;
  updatedAt?: string;
};

export const TRANSLATION_LOCALES: TranslationLocale[] = ["en", "ru", "tr"];

export const RECORD_LOCALES = ["ka", ...TRANSLATION_LOCALES] as const;

type MediaRole = "audio" | "gallery" | "hero" | "mobile";

export function speciesRecordRows(record: SpeciesRecord) {
  const rows = new Map<SpeciesTable, Cell[][]>(
    SPECIES_TABLES.map((table) => [table.name, []]),
  );
  const add = (table: SpeciesTable, row: Cell[]) => rows.get(table)!.push(row);
  const { base } = record;
  const id = base.id;

  add("species", [
    id,
    base.scientificName,
    base.genus,
    base.family,
    record.group,
    base.danger ?? null,
    record.status,
    record.catalogPosition,
    record.slugKa,
    base.publishedAt,
  ]);
  addTexts(add, id, "ka", base);
  for (const locale of TRANSLATION_LOCALES) {
    addTexts(add, id, locale, record.translations[locale]);
  }
  (base.identification?.colors ?? []).forEach((color, index) =>
    add("species_identification_colors", [id, index, color]),
  );
  base.sources.forEach((entry, index) =>
    add("species_sources", [id, index, entry.name, entry.url ?? null]),
  );
  record.habitats.forEach((habitat, index) =>
    add("species_habitats", [id, habitat, index]),
  );

  const galleryPositions = new Map(
    base.gallery.map((image, index) => [image.src, index]),
  );
  const addMedia = (
    role: MediaRole,
    position: number,
    src: string,
    credit: PhotoCredit | undefined,
    photoConfidence?: string,
    person = credit?.photographer,
  ) =>
    add("species_media", [
      id,
      role,
      position,
      src,
      photoConfidence ?? null,
      ...creditCells(credit, person),
    ]);
  addMedia("hero", 0, base.image, base.imageCredit);
  if (base.mobileImage) {
    addMedia("mobile", 0, base.mobileImage, base.mobileImageCredit);
  }
  base.gallery.forEach((image, index) =>
    addMedia("gallery", index, image.src, image.credit, image.photoConfidence),
  );
  if (base.audio) {
    const { recordist, src, ...credit } = base.audio;
    addMedia("audio", 0, src, credit, undefined, recordist);
  }

  for (const locale of TRANSLATION_LOCALES) {
    const translation = record.translations[locale];
    const overlay = (
      role: MediaRole,
      position: number,
      order: number,
      credit: PhotoCredit | undefined,
      photoConfidence?: string,
    ) =>
      add("species_media_overlays", [
        mediaRef(id, role, position),
        locale,
        order,
        photoConfidence ?? null,
        ...creditCells(credit, credit?.photographer),
      ]);
    if (translation.imageCredit) overlay("hero", 0, 0, translation.imageCredit);
    if (translation.mobileImageCredit) {
      overlay("mobile", 0, 0, translation.mobileImageCredit);
    }
    (translation.gallery ?? []).forEach((image: GalleryImage, order) => {
      const position = galleryPositions.get(image.src);
      if (position === undefined) {
        throw new Error(`${locale} gallery ${image.src} is not in ${id}`);
      }
      overlay("gallery", position, order, image.credit, image.photoConfidence);
    });
  }

  record.lookalikes.forEach((peer, index) =>
    add("species_lookalikes", [id, peer, index]),
  );
  for (const slug of record.slugs) add("species_slugs", [slug, id]);
  if (record.rangeMap) {
    const { copy, ...settings } = record.rangeMap;
    add("species_range_maps", [
      id,
      settings.iNaturalistTaxonId,
      settings.rangeSource ?? null,
      settings.confirmedThreshold ?? null,
    ]);
    for (const locale of RECORD_LOCALES) {
      const texts = RANGE_MAP_TEXT_KEYS.map((key) => copy[locale][key] ?? null);
      if (texts.some((text) => text !== null)) {
        add("species_range_map_texts", [id, locale, ...texts]);
      }
    }
  }
  return rows;
}

function addTexts(
  add: (table: SpeciesTable, row: Cell[]) => void,
  id: string,
  locale: string,
  text: TextSource,
) {
  add("species_texts", [
    id,
    locale,
    text.commonName,
    text.overview,
    text.description,
    text.habitat,
    text.diet,
    text.behavior,
    text.conservation,
    text.location,
    text.interaction ?? null,
    text.identification?.summary ?? null,
    text.identification?.coloration ?? null,
    text.updatedAt ?? null,
  ]);
  text.facts.forEach((fact, index) =>
    add("species_list_items", [id, locale, "fact", index, fact]),
  );
  (text.identification?.traits ?? []).forEach((trait, index) =>
    add("species_list_items", [
      id,
      locale,
      "identification_trait",
      index,
      trait,
    ]),
  );
  (text.faq ?? []).forEach((entry, index) =>
    add("species_faq", [id, locale, index, entry.question, entry.answer]),
  );
  text.stats.forEach((stat, index) =>
    add("species_stats", [id, locale, index, stat.label, stat.value]),
  );
}

function creditCells(credit: PhotoCredit | undefined, person?: string) {
  return [
    person ?? null,
    credit?.location ?? null,
    credit?.date ?? null,
    credit?.lat ?? null,
    credit?.lng ?? null,
    credit?.url ?? null,
    credit?.photoConfidence ?? null,
  ];
}

function mediaRef(
  speciesId: string,
  role: MediaRole,
  position: number,
): SqlExpression {
  return {
    sql: "(SELECT id FROM species_media WHERE species_id = ? AND role = ? AND position = ?)",
    values: [speciesId, role, position],
  };
}
