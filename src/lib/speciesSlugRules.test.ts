import { describe, expect, it } from "vitest";

import { buildPublishedSlugMaps } from "@/lib/speciesSlugRules";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

describe("species slug rules", () => {
  it("takes published slugs and aliases as given", () => {
    const maps = buildPublishedSlugMaps([
      {
        hub: "snakes",
        id: "macrovipera-lebetina",
        slug: "giurza-axali",
        slugAliases: ["giurza"],
      },
    ]);
    expect(maps.kaSlugById["macrovipera-lebetina"]).toBe("giurza-axali");
    expect(maps.hubById["macrovipera-lebetina"]).toBe("snakes");
    expect(maps.idByAnySlug["giurza-axali"]).toBe("macrovipera-lebetina");
    expect(maps.idByAnySlug.giurza).toBe("macrovipera-lebetina");
    expect(maps.idByAnySlug["macrovipera-lebetina"]).toBe(
      "macrovipera-lebetina",
    );
  });

  it("reads the former slugs from the catalog", () => {
    const catalog = speciesCatalogFixture("ka");
    const aliases = (id: string) =>
      catalog.find((item) => item.id === id)?.slugAliases;
    expect(aliases("accipiter-nisus")).toContain("korisebri-mimino");
    expect(aliases("natrix-tessellata")).toContain("tsqlis-ankara");
    expect(aliases("steatoda-paykulliana")).toContain("yalanci-karakurt");
    for (const item of catalog) {
      expect(item.slugAliases, item.id).not.toContain(item.id);
      expect(item.slugAliases, item.id).not.toContain(item.slug);
      for (const slug of item.slugAliases)
        expect(slug, slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
