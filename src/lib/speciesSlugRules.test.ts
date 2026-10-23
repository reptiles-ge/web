import { describe, expect, it } from "vitest";

import {
  buildPublishedSlugMaps,
  buildSpeciesSlugMaps,
} from "@/lib/speciesSlugRules";

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

  it("keeps every alias URL-safe ASCII", () => {
    const { idByAnySlug } = buildSpeciesSlugMaps([]);
    expect(idByAnySlug["yalanci-karakurt"]).toBe("steatoda-paykulliana");
    for (const slug of Object.keys(idByAnySlug))
      expect(slug, slug).toMatch(/^[a-z0-9-]+$/);
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

  it("takes published slugs as given and adds the aliases", () => {
    const maps = buildPublishedSlugMaps([
      { hub: "snakes", id: "macrovipera-lebetina", slug: "giurza-axali" },
    ]);
    expect(maps.kaSlugById["macrovipera-lebetina"]).toBe("giurza-axali");
    expect(maps.hubById["macrovipera-lebetina"]).toBe("snakes");
    expect(maps.idByAnySlug["giurza-axali"]).toBe("macrovipera-lebetina");
    expect(maps.idByAnySlug["macrovipera-lebetina"]).toBe(
      "macrovipera-lebetina",
    );
    expect(maps.idByAnySlug.raccoon).toBe("procyon-lotor");
  });
});
