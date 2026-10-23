import { describe, expect, it } from "vitest";

import {
  getSpeciesHubId,
  getSpeciesPublicSlug,
  publishedSpeciesSlugRows,
  resolveSpeciesId,
  resolveSpeciesIdInHub,
} from "@/lib/speciesSlugTable";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

describe("species slug table", () => {
  it("uses KA slug overrides for public URLs", () => {
    expect(getSpeciesPublicSlug("coturnix-coturnix", "ka")).toBe("mtskeri");
    expect(getSpeciesPublicSlug("macrovipera-lebetina", "ka")).toBe("giurza");
    expect(getSpeciesPublicSlug("paralaudakia-caucasia", "ka")).toBe("jojo");
    expect(getSpeciesPublicSlug("pseudopus-apodus", "ka")).toBe("gvelxokera");
  });

  it("keeps scientific folder ids for English", () => {
    expect(getSpeciesPublicSlug("macrovipera-lebetina", "en")).toBe(
      "macrovipera-lebetina",
    );
  });

  it("resolves KA aliases and ids to the same taxon", () => {
    expect(resolveSpeciesIdInHub("birds", "mtsqeri")).toBe("coturnix-coturnix");
    expect(resolveSpeciesId("giurza")).toBe("macrovipera-lebetina");
    expect(resolveSpeciesId("macrovipera-lebetina")).toBe(
      "macrovipera-lebetina",
    );
    expect(resolveSpeciesIdInHub("snakes", "giurza")).toBe(
      "macrovipera-lebetina",
    );
  });

  it("does not resolve a reserved hub slug as a species", () => {
    expect(resolveSpeciesIdInHub("snakes", "saxeoebebi")).toBeUndefined();
    expect(resolveSpeciesIdInHub("spiders", "saxeoebebi")).toBeUndefined();
  });

  it("rejects a slug from another hub", () => {
    expect(resolveSpeciesIdInHub("lizards", "giurza")).toBeUndefined();
  });

  it("maps published ids to hubs", () => {
    expect(getSpeciesHubId("macrovipera-lebetina")).toBe("snakes");
    expect(getSpeciesHubId("paralaudakia-caucasia")).toBe("lizards");
  });

  it("lists the KA slug and group of every published species", () => {
    const rows = new Map(
      publishedSpeciesSlugRows().map((row) => [row.id, row]),
    );
    for (const item of speciesCatalogFixture("ka")) {
      expect(rows.get(item.id), item.id).toEqual({
        group: item.group,
        id: item.id,
        slug: item.slug,
      });
    }
  });
});
