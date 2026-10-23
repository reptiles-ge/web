import { describe, expect, it } from "vitest";

import { fieldRecordsFixture } from "../../../tests/fixtures/speciesCatalog";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import {
  buildFieldRecordsImport,
  FIELD_RECORDS_IMPORT_GUARD,
  readFieldRecords,
} from "./fieldRecords";

const recordsById = fieldRecordsFixture();

const statements = buildFieldRecordsImport(recordsById);

const load = createSpeciesTestDatabase;

describe("field records in D1", () => {
  it("round-trips every field record of every species 1:1", async () => {
    const { db, sqlite } = load();
    sqlite.exec("DELETE FROM species_field_records");
    for (const statement of statements) sqlite.exec(statement);
    for (const [id, records] of Object.entries(recordsById)) {
      expect(await readFieldRecords(db, id), id).toStrictEqual(records);
    }
    expect(await readFieldRecords(db, "no-such-species")).toEqual([]);
  });

  it("refuses a second import once records exist", () => {
    const { sqlite } = load();
    expect(() => sqlite.exec(FIELD_RECORDS_IMPORT_GUARD)).toThrow();
  });

  it("enforces coordinates, evidence and the species link", () => {
    const { sqlite } = load();
    const insert =
      (species: string, lat: number, evidence: null | string) => () =>
        sqlite
          .prepare(
            "INSERT INTO species_field_records (species_id, position, locality, lat, lng, evidence) VALUES (?, 99999, 'x', ?, 44, ?)",
          )
          .run(species, lat, evidence);
    expect(insert("testudo-graeca", 95, null)).toThrow();
    expect(insert("testudo-graeca", 41, "rumour")).toThrow();
    expect(insert("no-such-species", 41, null)).toThrow();
  });

  it("keeps every statement under D1's size limit", () => {
    const encoder = new TextEncoder();
    expect(
      Math.max(
        ...statements.map((statement) => encoder.encode(statement).length),
      ),
    ).toBeLessThan(100_000);
    expect(statements[0]).toBe(FIELD_RECORDS_IMPORT_GUARD);
  });
});
