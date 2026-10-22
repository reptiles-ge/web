import type { GalleryImage, PhotoCredit } from "@/data/speciesTypes";
import type {
  SpeciesCatalogData,
  TranslationLocale,
} from "@/lib/speciesImportSource";

import { SPECIES_TABLES } from "./speciesSchema";

type Row = unknown[];

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

const MAX_ROWS_PER_INSERT = 40;
const MAX_STATEMENT_BYTES = 90_000;
const encoder = new TextEncoder();
const TRANSLATION_LOCALES: TranslationLocale[] = ["en", "ru", "tr"];

export function buildSpeciesImport(source: SpeciesCatalogData) {
  const rows = new Map<string, Row[]>(
    SPECIES_TABLES.map((table) => [table.name, []]),
  );
  const add = (table: string, row: Row) => rows.get(table)!.push(row);
  const unpublished = new Set(source.unpublishedIds);
  const position = new Map(source.catalogIds.map((id, index) => [id, index]));
  let mediaId = 0;

  for (const item of source.species) {
    const meta = source.atlasMeta[item.id];
    if (!meta) throw new Error(`Missing atlas meta for ${item.id}`);
    const catalogPosition = position.get(item.id);
    if (catalogPosition === undefined) {
      throw new Error(`${item.id} is not in the catalog order`);
    }
    add("species", [
      item.id,
      item.scientificName,
      item.genus,
      item.family,
      meta.group,
      item.danger ?? null,
      unpublished.has(item.id) ? "unpublished" : "published",
      catalogPosition,
      source.kaSlugById[item.id] ?? null,
      item.publishedAt,
    ]);
    addTexts(add, item.id, "ka", item);
    for (const locale of TRANSLATION_LOCALES) {
      const translation = source.translations[locale][item.id];
      if (!translation) throw new Error(`Missing ${locale} for ${item.id}`);
      addTexts(add, item.id, locale, translation);
    }
    (item.identification?.colors ?? []).forEach((color, index) =>
      add("species_identification_colors", [item.id, index, color]),
    );
    item.sources.forEach((entry, index) =>
      add("species_sources", [item.id, index, entry.name, entry.url ?? null]),
    );
    meta.habitats.forEach((habitat, index) =>
      add("species_habitats", [item.id, habitat, index]),
    );

    const mediaIds = new Map<string, number>();
    const addMedia = (
      role: string,
      index: number,
      src: string,
      credit: PhotoCredit | undefined,
      photoConfidence?: string,
      person = credit?.photographer,
    ) => {
      mediaId += 1;
      mediaIds.set(`${role}:${role === "gallery" ? src : ""}`, mediaId);
      add("species_media", [
        mediaId,
        item.id,
        role,
        index,
        src,
        photoConfidence ?? null,
        ...creditColumns(credit, person),
      ]);
    };
    addMedia("hero", 0, item.image, item.imageCredit);
    if (item.mobileImage) {
      addMedia("mobile", 0, item.mobileImage, item.mobileImageCredit);
    }
    item.gallery.forEach((image, index) =>
      addMedia(
        "gallery",
        index,
        image.src,
        image.credit,
        image.photoConfidence,
      ),
    );
    if (item.audio) {
      const { recordist, src, ...credit } = item.audio;
      addMedia("audio", 0, src, credit, undefined, recordist);
    }

    for (const locale of TRANSLATION_LOCALES) {
      const translation = source.translations[locale][item.id]!;
      const overlay = (
        key: string,
        index: number,
        credit: PhotoCredit | undefined,
        photoConfidence?: string,
      ) => {
        const id = mediaIds.get(key);
        if (!id) throw new Error(`${locale} overlay ${key} has no media`);
        add("species_media_overlays", [
          id,
          locale,
          index,
          photoConfidence ?? null,
          ...creditColumns(credit, credit?.photographer),
        ]);
      };
      if (translation.imageCredit) {
        overlay("hero:", 0, translation.imageCredit);
      }
      if (translation.mobileImageCredit) {
        overlay("mobile:", 0, translation.mobileImageCredit);
      }
      (translation.gallery ?? []).forEach((image: GalleryImage, index) =>
        overlay(
          `gallery:${image.src}`,
          index,
          image.credit,
          image.photoConfidence,
        ),
      );
    }
  }

  for (const [id, peers] of Object.entries(source.lookalikes)) {
    peers.forEach((peer, index) =>
      add("species_lookalikes", [id, peer, index]),
    );
  }
  for (const [slug, id] of Object.entries(source.idByAnySlug)) {
    add("species_slugs", [slug, id]);
  }

  return [
    ...[...SPECIES_TABLES]
      .reverse()
      .map((table) => `DELETE FROM ${table.name};`),
    ...SPECIES_TABLES.flatMap((table) =>
      insertStatements(table.name, table.columns, rows.get(table.name)!),
    ),
  ];
}

function addTexts(
  add: (table: string, row: Row) => void,
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

function creditColumns(credit: PhotoCredit | undefined, person?: string) {
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

function insertStatements(
  table: string,
  columns: readonly string[],
  rows: Row[],
) {
  const statements: string[] = [];
  const head = `INSERT INTO ${table} (${columns.join(", ")}) VALUES `;
  let batch: string[] = [];
  let size = encoder.encode(head).length;
  for (const row of rows) {
    if (row.length !== columns.length) {
      throw new Error(`${table} row has ${row.length} values`);
    }
    const values = `(${row.map(literal).join(", ")})`;
    const bytes = encoder.encode(values).length;
    if (
      batch.length > 0 &&
      (batch.length >= MAX_ROWS_PER_INSERT ||
        size + bytes > MAX_STATEMENT_BYTES)
    ) {
      statements.push(`${head}${batch.join(", ")};`);
      batch = [];
      size = encoder.encode(head).length;
    }
    batch.push(values);
    size += bytes + 2;
  }
  if (batch.length > 0) statements.push(`${head}${batch.join(", ")};`);
  return statements;
}

function literal(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`Bad number ${value}`);
    return String(value);
  }
  if (typeof value !== "string") throw new Error(`Bad value ${String(value)}`);
  return `'${value.replaceAll("'", "''")}'`;
}
