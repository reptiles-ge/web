import type { SpeciesCatalogData } from "@/lib/speciesImportSource";

import {
  type SpeciesRecord,
  speciesRecordRows,
  TRANSLATION_LOCALES,
} from "./speciesRows";
import { SPECIES_TABLES } from "./speciesSchema";
import { renderLiteralInserts } from "./sqlRender";

export const IMPORT_GUARD =
  "INSERT INTO species_import_runs (ran_at) SELECT CASE WHEN EXISTS (SELECT 1 FROM species_revisions) THEN NULL ELSE strftime('%Y-%m-%dT%H:%M:%fZ', 'now') END;";

export function buildSpeciesImport(source: SpeciesCatalogData) {
  const merged = new Map(
    SPECIES_TABLES.map((table) => [table.name, [] as unknown[][]]),
  );
  for (const record of recordsFromCatalog(source)) {
    for (const [table, rows] of speciesRecordRows(record)) {
      merged.get(table)!.push(...rows);
    }
  }
  return [
    IMPORT_GUARD,
    ...[...SPECIES_TABLES]
      .reverse()
      .map((table) => `DELETE FROM ${table.name};`),
    ...SPECIES_TABLES.flatMap((table) =>
      renderLiteralInserts(table.name, table.columns, merged.get(table.name)!),
    ),
  ];
}

function recordsFromCatalog(source: SpeciesCatalogData): SpeciesRecord[] {
  const unpublished = new Set(source.unpublishedIds);
  const position = new Map(source.catalogIds.map((id, index) => [id, index]));
  const slugs = new Map<string, string[]>();
  for (const [slug, id] of Object.entries(source.idByAnySlug)) {
    slugs.set(id, [...(slugs.get(id) ?? []), slug]);
  }
  return source.species.map((base) => {
    const meta = source.atlasMeta[base.id];
    const catalogPosition = position.get(base.id);
    if (!meta) throw new Error(`Missing atlas meta for ${base.id}`);
    if (catalogPosition === undefined) {
      throw new Error(`${base.id} is not in the catalog order`);
    }
    return {
      base,
      catalogPosition,
      group: meta.group,
      habitats: meta.habitats,
      lookalikes: source.lookalikes[base.id] ?? [],
      slugKa: source.kaSlugById[base.id] ?? null,
      slugs: slugs.get(base.id) ?? [],
      status: unpublished.has(base.id) ? "unpublished" : "published",
      translations: Object.fromEntries(
        TRANSLATION_LOCALES.map((locale) => {
          const translation = source.translations[locale][base.id];
          if (!translation) throw new Error(`Missing ${locale} for ${base.id}`);
          return [locale, translation];
        }),
      ) as SpeciesRecord["translations"],
    };
  });
}
