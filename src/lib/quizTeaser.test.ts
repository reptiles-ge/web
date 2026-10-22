import { describe, expect, it, vi } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { routing } from "@/i18n/routing";
import { isLizardSpecies, isSnakeSpecies } from "@/lib/clusterGuides";
import {
  getQuizTeaserId,
  getSpeciesQuizTeaser,
  quizTeaserOptionIds,
} from "@/lib/quizTeaser";

vi.mock("@/lib/speciesCatalogApi", async () => {
  const { speciesCatalogFixture } =
    await import("../../tests/fixtures/speciesCatalog");
  return {
    getCreditPhotoCatalog: async () => speciesCatalogFixture("ka"),
    getSpeciesCatalog: async (locale: "en" | "ka" | "ru" | "tr") =>
      speciesCatalogFixture(locale),
  };
});

const catalog = getCatalogSpecies();
const byId = new Map(catalog.map((item) => [item.id, item]));
const quizSpecies = catalog.filter(
  (item) => isSnakeSpecies(item) || isLizardSpecies(item),
);

describe("species quiz teaser", () => {
  it("only exists for snakes and lizards", () => {
    for (const species of catalog) {
      const expected = isSnakeSpecies(species)
        ? "snake"
        : isLizardSpecies(species)
          ? "lizard"
          : null;
      expect(getQuizTeaserId(species), species.id).toBe(expected);
    }
  });

  it("asks about another species and offers four distinct answers", () => {
    for (const species of quizSpecies) {
      const quizId = getQuizTeaserId(species);
      if (!quizId) throw new Error(`no quiz for ${species.id}`);
      const teaser = quizTeaserOptionIds(species.id, quizId, catalog);
      expect(teaser, species.id).not.toBeNull();
      if (!teaser) continue;

      expect(teaser.correctId, species.id).not.toBe(species.id);
      expect(new Set(teaser.options).size, species.id).toBe(4);
      expect(teaser.options, species.id).toContain(teaser.correctId);
    }
  });

  it("keeps every answer inside the same quiz pool", () => {
    for (const species of quizSpecies) {
      const quizId = getQuizTeaserId(species);
      if (!quizId) continue;
      const teaser = quizTeaserOptionIds(species.id, quizId, catalog);
      for (const id of teaser?.options ?? []) {
        const option = byId.get(id);
        expect(option, `${species.id} → ${id}`).toBeDefined();
        if (!option) continue;
        expect(
          quizId === "snake" ? isSnakeSpecies(option) : isLizardSpecies(option),
          `${species.id} → ${id}`,
        ).toBe(true);
      }
    }
  });

  it("offers the page's own species as one of the answers", () => {
    for (const species of quizSpecies) {
      const quizId = getQuizTeaserId(species);
      if (!quizId || !species.image) continue;
      const teaser = quizTeaserOptionIds(species.id, quizId, catalog);
      expect(teaser?.options, species.id).toContain(species.id);
    }
  });

  it("is the same on every render and in every locale", async () => {
    for (const species of quizSpecies) {
      const base = await getSpeciesQuizTeaser(species.id, "ka");
      expect(base, species.id).not.toBeNull();
      for (const locale of routing.locales) {
        const teaser = await getSpeciesQuizTeaser(species.id, locale);
        expect(teaser?.correctId, `${species.id} ${locale}`).toBe(
          base?.correctId,
        );
        expect(
          teaser?.options.map((option) => option.id),
          `${species.id} ${locale}`,
        ).toEqual(base?.options.map((option) => option.id));
        expect(teaser?.image, `${species.id} ${locale}`).toBeTruthy();
      }
    }
  });

  it("has no teaser for a species outside the quizzes or the catalog", async () => {
    expect(await getSpeciesQuizTeaser("aquila-chrysaetos", "en")).toBeNull();
    expect(await getSpeciesQuizTeaser("no-such-species", "en")).toBeNull();
  });
});
