import { describe, expect, it, vi } from "vitest";

import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { findPublishedSpeciesId } from "./species";

describe("findPublishedSpeciesId", () => {
  it("finds a published species by its locale slug", async () => {
    const { db } = createSpeciesTestDatabase();
    expect(await findPublishedSpeciesId(db, "giurza", "ka")).toBe(
      "macrovipera-lebetina",
    );
    expect(await findPublishedSpeciesId(db, "macrovipera-lebetina", "en")).toBe(
      "macrovipera-lebetina",
    );
    expect(await findPublishedSpeciesId(db, "macrovipera-lebetina", "ka")).toBe(
      null,
    );
    expect(await findPublishedSpeciesId(db, "giurza", "en")).toBe(null);
    expect(await findPublishedSpeciesId(db, "dolichophis-caspius", "en")).toBe(
      null,
    );
  });

  it("looks the slug up through an index in every locale", async () => {
    const { db, sqlite } = createSpeciesTestDatabase();
    const prepare = vi.spyOn(db, "prepare");
    await findPublishedSpeciesId(db, "giurza", "ka");
    await findPublishedSpeciesId(db, "macrovipera-lebetina", "en");
    for (const [query] of prepare.mock.calls) {
      const plan = sqlite
        .prepare(`EXPLAIN QUERY PLAN ${query}`)
        .all("x") as Array<{ detail: string }>;
      expect(plan.map(({ detail }) => detail).join("\n"), query).toMatch(
        /^SEARCH species USING (?:INDEX|PRIMARY KEY)/,
      );
    }
  });
});
