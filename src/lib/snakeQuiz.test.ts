import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { isDarevskiaSpecies } from "@/lib/clusterGuides";
import {
  getLizardQuizCatalog,
  getSnakeQuizCatalog,
  toSnakeQuizSpecies,
} from "@/lib/snakeQuiz";
import { generateLizardQuiz } from "@/lib/snakeQuizEngine";

describe("quiz catalogs", () => {
  it("keeps the glass lizard out of the snake pool and in the lizard pool", () => {
    const catalog = getCatalogSpecies();
    const snakes = getSnakeQuizCatalog(catalog);
    const lizards = getLizardQuizCatalog(catalog);
    expect(snakes.some((item) => item.id === "pseudopus-apodus")).toBe(false);
    expect(lizards.some((item) => item.id === "pseudopus-apodus")).toBe(true);
    expect(lizards.some((item) => item.id === "paralaudakia-caucasia")).toBe(
      true,
    );
  });

  it("does not collapse Darevskia into one option", () => {
    const lizards = getLizardQuizCatalog(getCatalogSpecies());
    const darevskia = lizards.filter((item) =>
      isDarevskiaSpecies(getSpeciesById(item.id)!),
    );
    expect(darevskia.length).toBeGreaterThan(1);
    expect(new Set(darevskia.map((item) => item.id)).size).toBe(
      darevskia.length,
    );
  });

  it("builds a lizard round from lizards only", () => {
    const lizards = getLizardQuizCatalog(getCatalogSpecies());
    const round = generateLizardQuiz(lizards, { rng: () => 0.2 });
    expect(round.length).toBe(10);
    const lizardIds = new Set(lizards.map((item) => item.id));
    for (const question of round) {
      expect(lizardIds.has(question.correctId)).toBe(true);
      for (const optionId of question.optionIds) {
        expect(lizardIds.has(optionId)).toBe(true);
      }
    }
  });
});

describe("quiz hint", () => {
  const base = getSpeciesById("natrix-natrix")!;
  const species = (overrides: Partial<typeof base>) => ({
    ...base,
    id: "hint-test",
    ...overrides,
  });

  it("skips to the habitat when every trait names the answer", () => {
    const hint = toSnakeQuizSpecies(
      species({
        identification: {
          ...base.identification!,
          traits: [`${base.commonName} has yellow patches`],
        },
        stats: [{ label: "Местообитание", value: "Wet meadows" }],
      }),
      getCatalogSpecies(),
    ).hint;
    expect(hint).toBe("Wet meadows");
  });

  it.each(["ჰაბიტატი", "Habitat", "Местообитание", "Yaşam alanı"])(
    "reads the %s habitat label",
    (label) => {
      const hint = toSnakeQuizSpecies(
        species({
          identification: { ...base.identification!, traits: [] },
          stats: [{ label, value: "Riverbanks" }],
        }),
        getCatalogSpecies(),
      ).hint;
      expect(hint).toBe("Riverbanks");
    },
  );
});
