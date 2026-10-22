import { beforeAll, describe, expect, it } from "vitest";

import { speciesImportSource } from "@/lib/speciesImportSource";

import { createTestDatabase } from "../testing/sqliteDatabase";
import { readSpeciesCatalog } from "./speciesCatalog";
import { buildSpeciesImport } from "./speciesImport";

const source = speciesImportSource();
const statements = buildSpeciesImport(source);

function count(sqlite: ReturnType<typeof load>["sqlite"], table: string) {
  return (
    sqlite.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }
  ).n;
}

function load() {
  const database = createTestDatabase();
  for (const statement of statements) database.sqlite.exec(statement);
  return database;
}

describe("species in D1", () => {
  let database: ReturnType<typeof load>;

  beforeAll(() => {
    database = load();
  });

  it("round-trips every species, translation and catalog field 1:1", async () => {
    expect(await readSpeciesCatalog(database.db)).toStrictEqual(source);
  });

  it("keeps every row the source has", () => {
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

  it("re-imports cleanly over existing data", async () => {
    for (const statement of statements) database.sqlite.exec(statement);
    expect(count(database.sqlite, "species")).toBe(source.catalogIds.length);
    expect(await readSpeciesCatalog(database.db)).toStrictEqual(source);
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

  it("splits the import into statements D1 accepts", () => {
    const encoder = new TextEncoder();
    expect(
      Math.max(
        ...statements.map((statement) => encoder.encode(statement).length),
      ),
    ).toBeLessThan(100_000);
    expect(statements[0]).toBe("DELETE FROM species_slugs;");
  });
});
