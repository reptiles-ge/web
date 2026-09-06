import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getAtlasListItems } from "@/lib/atlasList";

describe("atlas list", () => {
  it("keeps published taxa and omits unpublished ones", () => {
    const items = getAtlasListItems("ka");
    expect(items.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
    expect(items.some((item) => item.id === "dolichophis-caspius")).toBe(false);
  });

  it("indexes names across locales without shipping full essays", () => {
    const giurza = getSpeciesById("macrovipera-lebetina");
    expect(giurza).toBeDefined();
    const item = getAtlasListItems("ka").find(
      (entry) => entry.id === "macrovipera-lebetina",
    );
    expect(item).toBeDefined();
    const en = localizeSpecies(giurza!, "en");
    expect(giurza!.overview.length).toBeGreaterThan(40);
    expect(item!.searchText).toContain(en.commonName.toLowerCase());
    expect(item!.searchText).not.toContain(giurza!.overview.toLowerCase());
  });
});
