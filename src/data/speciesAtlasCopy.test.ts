import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlasMeta";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const LOCALES = { en, ka, ru, tr } as const;

function atlasCopy(messages: (typeof LOCALES)[keyof typeof LOCALES]) {
  return JSON.stringify(messages.speciesAtlas);
}

describe("species atlas copy", () => {
  it.each(Object.entries(LOCALES))(
    "%s names the checklist the atlas follows",
    (_, messages) => {
      expect(messages.speciesAtlas.sourcesBody).toContain(
        "Tarkhnishvili et al. 2026",
      );
    },
  );

  it.each(Object.entries(LOCALES))(
    "%s makes no endemic claim on the atlas page",
    (_, messages) => {
      expect(atlasCopy(messages)).not.toMatch(/endemi|ენდემ|эндеми/i);
    },
  );

  it.each(Object.entries(LOCALES))(
    "%s spells the Levantine viper as its profile does",
    (_, messages) => {
      expect(atlasCopy(messages)).not.toMatch(/Macrovipera lebetina\b/);
    },
  );

  it.each(Object.entries(LOCALES))(
    "%s lists every venomous snake in the catalog by binomial or keeps it in the shared name set",
    (_, messages) => {
      const paragraph = messages.speciesAtlas.seo.venomousP1;
      const venomous = getCatalogSpecies().filter(
        (item) =>
          getSpeciesAtlasMeta(item.id).group === "snake" &&
          isVenomousDanger(item.danger),
      );
      expect(venomous.length).toBeGreaterThan(0);
      for (const item of venomous) {
        const binomial =
          item.id === "vipera-transcaucasiana"
            ? "Vipera transcaucasiana"
            : item.scientificName;
        expect(paragraph).toContain(binomial);
      }
    },
  );

  it.each(Object.entries(LOCALES))(
    "%s marks the checklist candidates named in the venomous paragraph",
    (_, messages) => {
      expect(messages.speciesAtlas.seo.venomousP1).toContain(
        "Tarkhnishvili et al. 2026",
      );
    },
  );
});
