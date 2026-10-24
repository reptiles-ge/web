import type { ApiDatabase } from "./database";

import { relinkSpeciesAuthors } from "./authors";
import { fieldRecordStatements, readFieldRecords } from "./fieldRecords";
import { readRangeMap } from "./rangeMaps";
import { readSpeciesCatalog } from "./speciesCatalog";
import {
  type SpeciesRecord,
  speciesRecordRows,
  type SpeciesStatus,
  TRANSLATION_LOCALES,
} from "./speciesRows";
import { SPECIES_TABLES } from "./speciesSchema";
import { renderBoundInserts } from "./sqlRender";

export type SpeciesRevision = {
  actor: string;
  source: "admin" | "ai" | "api";
  summary: string;
};

type Table = (typeof SPECIES_TABLES)[number];

const CHILD_TABLES: Table[] = SPECIES_TABLES.filter(
  (table) =>
    table.name !== "species" && table.name !== "species_media_overlays",
);

const INSERT_ORDER: Table[] = [
  ...CHILD_TABLES,
  ...SPECIES_TABLES.filter((table) => table.name === "species_media_overlays"),
];

export async function readSpeciesRecord(db: ApiDatabase, id: string) {
  const row = await db
    .prepare(
      "SELECT status, catalog_position, version FROM species WHERE id = ?",
    )
    .bind(id)
    .first<{
      catalog_position: number;
      status: SpeciesStatus;
      version: number;
    }>();
  if (!row) return null;
  const [catalog, fieldRecords, rangeMap] = await Promise.all([
    readSpeciesCatalog(db, id),
    readFieldRecords(db, id),
    readRangeMap(db, id),
  ]);
  const base = catalog.species[0];
  const meta = catalog.atlasMeta[id];
  if (!base || !meta) return null;
  const record: SpeciesRecord = {
    base,
    catalogPosition: row.catalog_position,
    fieldRecords,
    group: meta.group,
    habitats: meta.habitats,
    lookalikes: catalog.lookalikes[id] ?? [],
    rangeMap,
    slugKa: catalog.kaSlugById[id] ?? null,
    slugs: Object.keys(catalog.idByAnySlug).sort(),
    status: row.status,
    translations: Object.fromEntries(
      TRANSLATION_LOCALES.map((locale) => [
        locale,
        catalog.translations[locale][id]!,
      ]),
    ) as SpeciesRecord["translations"],
  };
  return { record, version: row.version };
}

export async function readSpeciesVersion(db: ApiDatabase, id: string) {
  const row = await db
    .prepare("SELECT version FROM species WHERE id = ?")
    .bind(id)
    .first<{ version: number }>();
  return row?.version ?? null;
}

export async function writeSpeciesRecord(
  db: ApiDatabase,
  record: SpeciesRecord,
  expectedVersion: number,
  revision: SpeciesRevision,
  alsoRun: Array<ReturnType<ApiDatabase["prepare"]>> = [],
) {
  const id = record.base.id;
  const rows = speciesRecordRows(record);
  const [speciesRow] = rows.get("species")!;
  const statements = [
    db
      .prepare(
        "INSERT INTO species_revisions (species_id, version, actor, source, summary) VALUES (?, (SELECT version + 1 FROM species WHERE id = ? AND version = ?), ?, ?, ?)",
      )
      .bind(
        id,
        id,
        expectedVersion,
        revision.actor,
        revision.source,
        revision.summary,
      ),
    db
      .prepare(
        "UPDATE species SET scientific_name = ?, genus = ?, family = ?, group_id = ?, danger_id = ?, status = ?, catalog_position = ?, slug_ka = ?, published_at = ?, version = version + 1 WHERE id = ?",
      )
      .bind(...speciesRow!.slice(1), id),
    ...[...CHILD_TABLES]
      .reverse()
      .map((table) =>
        db.prepare(`DELETE FROM ${table.name} WHERE species_id = ?`).bind(id),
      ),
    ...INSERT_ORDER.flatMap((table) =>
      renderBoundInserts(table.name, table.columns, rows.get(table.name)!).map(
        ({ sql, values }) => db.prepare(sql).bind(...values),
      ),
    ),
    ...fieldRecordStatements(db, id, record.fieldRecords),
    ...relinkSpeciesAuthors(db, id),
    ...alsoRun,
  ];
  await db.batch(statements);
  return expectedVersion + 1;
}
