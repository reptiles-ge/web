import { describe, expect, it } from "vitest";

import { buildSpeciesSlugMaps } from "@/lib/speciesSlugRules";

describe("species slug rules", () => {
  it("uses KA slug overrides", () => {
    const maps = buildSpeciesSlugMaps([
      {
        commonName: "ignored",
        hub: "snakes",
        id: "macrovipera-lebetina",
      },
    ]);
    expect(maps.kaSlugById["macrovipera-lebetina"]).toBe("giurza");
    expect(maps.idByAnySlug.giurza).toBe("macrovipera-lebetina");
    expect(maps.hubById["macrovipera-lebetina"]).toBe("snakes");
  });

  it("keeps the former sparrowhawk slug as an alias", () => {
    const maps = buildSpeciesSlugMaps([
      {
        commonName: "მიმინო",
        hub: "birds",
        id: "accipiter-nisus",
      },
    ]);
    expect(maps.kaSlugById["accipiter-nisus"]).toBe("mimino");
    expect(maps.idByAnySlug["korisebri-mimino"]).toBe("accipiter-nisus");
  });

  it("keeps the former water snake slug as an alias", () => {
    const maps = buildSpeciesSlugMaps([
      {
        commonName: "წყლის ანკარა",
        hub: "snakes",
        id: "natrix-tessellata",
      },
    ]);
    expect(maps.kaSlugById["natrix-tessellata"]).toBe("tsklis-ankara");
    expect(maps.idByAnySlug["tsqlis-ankara"]).toBe("natrix-tessellata");
  });

  it("does not collide with reserved hub slugs", () => {
    const maps = buildSpeciesSlugMaps([
      {
        commonName: "species",
        hub: "snakes",
        id: "fake-reserved",
      },
    ]);
    expect(maps.kaSlugById["fake-reserved"]).toBe("species-reserved");
  });
});
