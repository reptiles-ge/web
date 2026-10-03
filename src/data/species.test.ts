import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing } from "@/i18n/routing";
import { hasRealIdentification } from "@/lib/speciesContent";
import { getLookalikeSpecies } from "@/lib/speciesRelated";

describe("catalog publish", () => {
  it("omits unpublished dolichophis-caspius", () => {
    expect(
      getCatalogSpecies().some((item) => item.id === "dolichophis-caspius"),
    ).toBe(false);
    expect(getSpeciesById("dolichophis-caspius")).toBeUndefined();
  });

  it("includes published snakes used on live pages", () => {
    expect(getSpeciesById("macrovipera-lebetina")?.id).toBe(
      "macrovipera-lebetina",
    );
  });

  it("keeps a stable publishedAt on compiled species", () => {
    const giurza = getSpeciesById("macrovipera-lebetina");
    expect(giurza?.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(giurza?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(giurza!.publishedAt <= giurza!.updatedAt).toBe(true);
    expect(giurza?.publishedAt).not.toContain("Invalid");
  });
});

describe("lookalikes", () => {
  it("always have an identification section to be listed in", () => {
    for (const species of getCatalogSpecies()) {
      if (getLookalikeSpecies(species.id).length === 0) continue;
      for (const locale of routing.locales) {
        expect(
          hasRealIdentification(
            localizeSpecies(species, locale).identification,
          ),
          `${species.id} (${locale})`,
        ).toBe(true);
      }
    }
  });
});
