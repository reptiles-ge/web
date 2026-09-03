import { describe, expect, it } from "vitest";

import {
  getSpeciesPublicSlug,
  resolveSpeciesId,
  resolveSpeciesInHub,
  speciesHref,
} from "@/lib/speciesRoutes";

describe("species routes", () => {
  it("uses KA slug overrides for public URLs", () => {
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
    expect(resolveSpeciesId("giurza")).toBe("macrovipera-lebetina");
    expect(resolveSpeciesId("macrovipera-lebetina")).toBe(
      "macrovipera-lebetina",
    );
    expect(resolveSpeciesInHub("snakes", "giurza")?.id).toBe(
      "macrovipera-lebetina",
    );
  });

  it("does not resolve a reserved hub slug as a species", () => {
    expect(resolveSpeciesInHub("snakes", "saxeoebebi")).toBeUndefined();
  });

  it("builds hub-scoped hrefs", () => {
    expect(speciesHref("macrovipera-lebetina", "ka")).toEqual({
      params: { slug: "giurza" },
      pathname: "/snakes/[slug]",
    });
    expect(speciesHref("macrovipera-lebetina", "en")).toEqual({
      params: { slug: "macrovipera-lebetina" },
      pathname: "/snakes/[slug]",
    });
  });
});
