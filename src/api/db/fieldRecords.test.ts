import { describe, expect, it } from "vitest";

import { fieldRecordsFixture } from "../../../tests/fixtures/speciesCatalog";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { readFieldRecords } from "./fieldRecords";

describe("field records in D1", () => {
  it("reads each species' records in position order", async () => {
    const { db, sqlite } = createSpeciesTestDatabase();
    const [id, records] = Object.entries(fieldRecordsFixture())[0]!;
    expect(await readFieldRecords(db, id)).toStrictEqual(records);
    const total = sqlite
      .prepare("SELECT COUNT(*) AS n FROM species_field_records")
      .get() as { n: number };
    expect(total.n).toBe(Object.values(fieldRecordsFixture()).flat().length);
    expect(await readFieldRecords(db, "no-such-species")).toEqual([]);
  });

  it("enforces coordinates, evidence and the species link", () => {
    const { sqlite } = createSpeciesTestDatabase();
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
});
