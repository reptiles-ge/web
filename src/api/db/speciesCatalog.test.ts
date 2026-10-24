import { beforeAll, describe, expect, it } from "vitest";

import {
  createSpeciesTestDatabase,
  createTestDatabase,
} from "../testing/sqliteDatabase";
import { RELINK_MEDIA_AUTHORS } from "./authors";
import { readSpeciesCatalog, type SpeciesCatalogData } from "./speciesCatalog";
import { speciesRecordRows } from "./speciesRows";
import { SPECIES_TABLES } from "./speciesSchema";
import { readSpeciesRecord, writeSpeciesRecord } from "./speciesWrite";
import { renderLiteralInserts } from "./sqlRender";

type Database = ReturnType<typeof createTestDatabase>;

function count(sqlite: Database["sqlite"], table: string) {
  return (
    sqlite.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }
  ).n;
}

describe("species in D1", () => {
  let database: Database;
  let source: SpeciesCatalogData;

  beforeAll(async () => {
    database = createSpeciesTestDatabase();
    source = await readSpeciesCatalog(database.db);
  });

  it("writes every record back to the same rows it was read from", async () => {
    const merged = new Map(
      SPECIES_TABLES.map((table) => [table.name, [] as unknown[][]]),
    );
    for (const id of source.catalogIds) {
      const found = await readSpeciesRecord(database.db, id);
      for (const [table, rows] of speciesRecordRows(found!.record)) {
        merged.get(table)!.push(...rows);
      }
    }
    const fresh = createTestDatabase();
    for (const table of SPECIES_TABLES) {
      for (const statement of renderLiteralInserts(
        table.name,
        table.columns,
        merged.get(table.name)!,
      )) {
        fresh.sqlite.exec(statement);
      }
    }
    for (const statement of RELINK_MEDIA_AUTHORS) fresh.sqlite.exec(statement);
    expect(await readSpeciesCatalog(fresh.db)).toStrictEqual(source);
  });

  it("writes every full record back unchanged, field records and range map included", async () => {
    const { db, sqlite } = createSpeciesTestDatabase();
    let fieldRecords = 0;
    let rangeMaps = 0;
    for (const id of source.catalogIds) {
      const found = await readSpeciesRecord(db, id);
      fieldRecords += found!.record.fieldRecords.length;
      if (found!.record.rangeMap) rangeMaps += 1;
      await writeSpeciesRecord(db, found!.record, found!.version, {
        actor: "test",
        source: "admin",
        summary: "Round trip",
      });
      const again = await readSpeciesRecord(db, id);
      expect(again!.version).toBe(found!.version + 1);
      expect(again!.record).toStrictEqual(found!.record);
    }
    expect(fieldRecords).toBe(count(sqlite, "species_field_records"));
    expect(fieldRecords).toBeGreaterThan(0);
    expect(rangeMaps).toBe(count(sqlite, "species_range_maps"));
    expect(rangeMaps).toBeGreaterThan(0);
  });

  it("keeps one row per species, locale, slug and source", () => {
    const { sqlite } = database;
    expect(count(sqlite, "species")).toBe(source.catalogIds.length);
    expect(count(sqlite, "species_texts")).toBe(source.catalogIds.length * 4);
    expect(count(sqlite, "species_slugs")).toBe(
      Object.keys(source.idByAnySlug).length,
    );
    expect(count(sqlite, "species_sources")).toBe(
      source.species.reduce((sum, item) => sum + item.sources.length, 0),
    );
  });

  it("enforces lookups, foreign keys and checks", () => {
    const { sqlite } = database;
    const insertSpecies =
      (group: string, id = "test-species") =>
      () =>
        sqlite
          .prepare(
            "INSERT INTO species (id, scientific_name, genus, family, group_id, status, catalog_position, slug_ka, published_at) VALUES (?, 'Test', 'T', 'T', ?, 'published', 9999, 'test', '2026-01-01')",
          )
          .run(id, group);
    expect(insertSpecies("fish")).toThrow();
    expect(insertSpecies("snake", "Bad Id")).toThrow();
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO species_texts (species_id, locale, common_name, overview, description, habitat, diet, behavior, conservation, location) VALUES ('missing', 'ka', 'x', '', '', '', '', '', '', '')",
        )
        .run(),
    ).toThrow();
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO species_lookalikes (species_id, lookalike_id, position) VALUES ('macrovipera-lebetina', 'macrovipera-lebetina', 99)",
        )
        .run(),
    ).toThrow();
  });
});
