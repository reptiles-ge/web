import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { hasRealIdentification } from "@/lib/speciesContent";
import { getLookalikeSpecies } from "@/lib/speciesRelated";

import {
  catalogSpeciesFixture,
  localizedFixture,
  speciesFixture,
} from "../../tests/fixtures/speciesCatalog";

describe("catalog publish", () => {
  it("omits unpublished dolichophis-caspius", () => {
    expect(
      catalogSpeciesFixture().some((item) => item.id === "dolichophis-caspius"),
    ).toBe(false);
    expect(speciesFixture("dolichophis-caspius")).toBeUndefined();
  });

  it("includes published snakes used on live pages", () => {
    expect(speciesFixture("macrovipera-lebetina")?.id).toBe(
      "macrovipera-lebetina",
    );
  });

  it("keeps a stable publishedAt on compiled species", () => {
    const giurza = speciesFixture("macrovipera-lebetina");
    expect(giurza?.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(giurza?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(giurza!.publishedAt <= giurza!.updatedAt).toBe(true);
    expect(giurza?.publishedAt).not.toContain("Invalid");
  });
});

describe("lookalikes", () => {
  it("always have an identification section to be listed in", () => {
    for (const species of catalogSpeciesFixture()) {
      if (getLookalikeSpecies(species.id, catalogSpeciesFixture()).length === 0)
        continue;
      for (const locale of routing.locales) {
        expect(
          hasRealIdentification(
            localizedFixture(species, locale).identification,
          ),
          `${species.id} (${locale})`,
        ).toBe(true);
      }
    }
  });
});
