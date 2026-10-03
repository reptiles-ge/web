import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { routing } from "@/i18n/routing";
import { isLizardSpecies, isSnakeSpecies } from "@/lib/clusterGuides";
import {
  getQuizTeaserId,
  getSpeciesQuizTeaser,
  quizTeaserOptionIds,
} from "@/lib/quizTeaser";

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
      expect(getQuizTeaserId(species.id), species.id).toBe(expected);
    }
  });

  it("asks about another species and offers four distinct answers", () => {
    for (const species of quizSpecies) {
      const quizId = getQuizTeaserId(species.id);
      if (!quizId) throw new Error(`no quiz for ${species.id}`);
      const teaser = quizTeaserOptionIds(species.id, quizId);
      expect(teaser, species.id).not.toBeNull();
      if (!teaser) continue;

      expect(teaser.correctId, species.id).not.toBe(species.id);
      expect(new Set(teaser.options).size, species.id).toBe(4);
      expect(teaser.options, species.id).toContain(teaser.correctId);
    }
  });

  it("keeps every answer inside the same quiz pool", () => {
    for (const species of quizSpecies) {
      const quizId = getQuizTeaserId(species.id);
      if (!quizId) continue;
      const teaser = quizTeaserOptionIds(species.id, quizId);
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
      const quizId = getQuizTeaserId(species.id);
      if (!quizId || !species.image) continue;
      const teaser = quizTeaserOptionIds(species.id, quizId);
      expect(teaser?.options, species.id).toContain(species.id);
    }
  });

  it("is the same on every render and in every locale", () => {
    for (const species of quizSpecies) {
      const base = getSpeciesQuizTeaser(species.id, "ka");
      expect(base, species.id).not.toBeNull();
      for (const locale of routing.locales) {
        const teaser = getSpeciesQuizTeaser(species.id, locale);
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
});
