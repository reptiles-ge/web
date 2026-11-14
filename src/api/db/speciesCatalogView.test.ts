import { describe, expect, it } from "vitest";

import type { ApiDatabase } from "./database";

import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { type CatalogView, readLocalizedCatalog } from "./speciesCatalogView";

const LOCALES = ["ka", "en", "ru", "tr"] as const;
const VIEWS: CatalogView[] = ["card", "photos", "quiz", "full"];
const ALL_PARTS = {
  facts: true,
  faq: true,
  identification: true,
  longTexts: true,
  sources: true,
};

function recordingDatabase(db: ApiDatabase) {
  const queries: string[] = [];
  const recorded: ApiDatabase = {
    ...db,
    prepare: (query) => {
      queries.push(query);
      return db.prepare(query);
    },
  };
  return { db: recorded, queries };
}

describe("readLocalizedCatalog", () => {
  it("reads the same entries with only the parts a view needs", async () => {
    const { db } = createSpeciesTestDatabase();
    for (const locale of LOCALES) {
      for (const view of VIEWS) {
        expect(
          await readLocalizedCatalog(db, locale, view),
          `${locale} ${view}`,
        ).toStrictEqual(
          await readLocalizedCatalog(db, locale, view, ALL_PARTS),
        );
      }
    }
  });

  it("leaves out drafts and unpublished species, also as lookalikes", async () => {
    const { db, sqlite } = createSpeciesTestDatabase();
    sqlite.exec(
      "UPDATE species SET status = 'draft' WHERE id = 'vipera-kaznakovi'",
    );
    sqlite.exec(
      "UPDATE species SET status = 'unpublished' WHERE id = 'vipera-darevskii'",
    );
    const published = (
      sqlite
        .prepare("SELECT id FROM species WHERE status = 'published'")
        .all() as Array<{ id: string }>
    ).map((row) => row.id);
    for (const view of VIEWS) {
      const entries = await readLocalizedCatalog(db, "en", view);
      expect(entries.map(({ index }) => index.id).sort()).toStrictEqual(
        published.sort(),
      );
      const dinniki = entries.find(
        ({ index }) => index.id === "vipera-dinniki",
      );
      expect(dinniki?.entry.lookalikes).not.toContain("vipera-kaznakovi");
      expect(dinniki?.entry.lookalikes).not.toContain("vipera-darevskii");
      for (const { entry } of entries) {
        expect(entry.lookalikes).not.toContain("vipera-kaznakovi");
        expect(entry.lookalikes).not.toContain("vipera-darevskii");
      }
    }
  });

  it("searches every locale whatever the view locale", async () => {
    const { db } = createSpeciesTestDatabase();
    const [ka, en] = await Promise.all([
      readLocalizedCatalog(db, "ka", "card"),
      readLocalizedCatalog(db, "en", "card"),
    ]);
    expect(ka.map(({ index }) => index.searchText)).toStrictEqual(
      en.map(({ index }) => index.searchText),
    );
    const giurza = ka.find(({ index }) => index.id === "macrovipera-lebetina");
    expect(giurza?.index.searchText).toContain("გიურზა");
    expect(giurza?.index.searchText).toMatch(/[a-z]/);
    expect(giurza?.index.searchText).toMatch(/[а-я]/);
  });

  it("reads a card catalog in one batch without long texts, lists, faq or sources", async () => {
    const { db: base } = createSpeciesTestDatabase();
    let batches = 0;
    const { db, queries } = recordingDatabase({
      ...base,
      batch: (statements) => {
        batches += 1;
        return base.batch(statements);
      },
    });
    await readLocalizedCatalog(db, "en", "card");
    expect(batches).toBe(1);
    const sql = queries.join("\n");
    for (const table of [
      "species_faq",
      "species_list_items",
      "species_sources",
      "species_identification_colors",
    ]) {
      expect(sql).not.toContain(table);
    }
    expect(sql).toContain("'' AS overview");
    expect(sql).toContain("NULL AS identification_summary");
    expect(sql).toContain("status = 'published'");
    expect(sql).toMatch(/locale IN \(\?, \?\)/);
  });

  it("reads lists for a quiz catalog and everything for a full one", async () => {
    const { db: base } = createSpeciesTestDatabase();
    const quiz = recordingDatabase(base);
    await readLocalizedCatalog(quiz.db, "ka", "quiz");
    const quizSql = quiz.queries.join("\n");
    expect(quizSql).toContain("species_list_items");
    expect(quizSql).not.toContain("species_faq");
    expect(quizSql).not.toContain("species_sources");
    const full = recordingDatabase(base);
    await readLocalizedCatalog(full.db, "ka", "full");
    const fullSql = full.queries.join("\n");
    for (const table of [
      "species_faq",
      "species_list_items",
      "species_sources",
    ]) {
      expect(fullSql).toContain(table);
    }
  });
});
