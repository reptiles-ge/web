import { describe, expect, it } from "vitest";

import {
  getSpeciesLookalikes,
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
    expect(resolveSpeciesInHub("spiders", "saxeoebebi")).toBeUndefined();
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

  it("keeps giurza lookalikes to supported visual matches", () => {
    expect(getSpeciesLookalikes("macrovipera-lebetina")).toEqual([
      "elaphe-urartica",
      "hemorrhois-ravergieri",
    ]);
    for (const id of ["elaphe-urartica", "hemorrhois-ravergieri"]) {
      expect(getSpeciesLookalikes(id)).toContain("macrovipera-lebetina");
    }
    for (const id of [
      "malpolon-insignitus",
      "dolichophis-schmidti",
      "elaphe-dione",
    ]) {
      expect(getSpeciesLookalikes(id)).not.toContain("macrovipera-lebetina");
    }
  });

  it("keeps smooth snake lookalikes to supported visual comparisons", () => {
    expect(getSpeciesLookalikes("coronella-austriaca")).toEqual([
      "vipera-transcaucasiana",
      "zamenis-hohenackeri",
    ]);
  });

  it("limits Transcaucasian ratsnake lookalikes to visual confusion candidates", () => {
    expect(getSpeciesLookalikes("zamenis-hohenackeri")).toEqual([
      "elaphe-dione",
      "coronella-austriaca",
      "hemorrhois-ravergieri",
      "vipera-transcaucasiana",
    ]);
    expect(getSpeciesLookalikes("zamenis-longissimus")).not.toContain(
      "zamenis-hohenackeri",
    );
    expect(getSpeciesLookalikes("elaphe-urartica")).not.toContain(
      "zamenis-hohenackeri",
    );
  });

  it("keeps glass lizard lookalikes to supported visual comparisons", () => {
    expect(getSpeciesLookalikes("pseudopus-apodus")).toEqual([
      "anguis-colchica",
      "natrix-tessellata",
    ]);
    expect(getSpeciesLookalikes("natrix-natrix")).not.toContain(
      "pseudopus-apodus",
    );
  });
});
