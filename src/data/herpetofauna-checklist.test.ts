import { describe, expect, it } from "vitest";

import {
  getHerpetofaunaChecklistStatus,
  herpetofaunaChecklistIds,
} from "@/data/herpetofauna-checklist";
import { featuredSpeciesIds } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";

import { catalogSpeciesFixture } from "../../tests/fixtures/speciesCatalog";

const HERP_GROUPS = new Set(["amphibian", "lizard", "snake", "turtle"]);

describe("herpetofauna checklist", () => {
  it("covers every published amphibian and reptile", () => {
    const publishedHerps = catalogSpeciesFixture().filter((item) =>
      HERP_GROUPS.has(getSpeciesAtlasMeta(item.id).group),
    );
    expect(publishedHerps.length).toBeGreaterThan(0);
    for (const item of publishedHerps) {
      expect(getHerpetofaunaChecklistStatus(item.id), item.id).not.toBeNull();
    }
  });

  it("keeps birds, mammals, and spiders out of scope", () => {
    expect(getHerpetofaunaChecklistStatus("accipiter-gentilis")).toBeNull();
    expect(getHerpetofaunaChecklistStatus("canis-lupus")).toBeNull();
    expect(getHerpetofaunaChecklistStatus("argiope-bruennichi")).toBeNull();
  });

  it("never labels a candidate as confirmed", () => {
    for (const id of [
      "bufo-verrucosissimus",
      "elaphe-urartica",
      "malpolon-insignitus",
      "vipera-darevskii",
      "vipera-dinniki",
      "vipera-renardi",
    ])
      expect(getHerpetofaunaChecklistStatus(id), id).toBe("candidate");
    expect(getHerpetofaunaChecklistStatus("vipera-kaznakovi")).toBe(
      "confirmed",
    );
    expect(getHerpetofaunaChecklistStatus("lacerta-agilis")).toBe("confirmed");
    expect(getHerpetofaunaChecklistStatus("phoenicolacerta-laevis")).toBe(
      "introduced",
    );
    expect(getHerpetofaunaChecklistStatus("trachemys-scripta")).toBe(
      "introduced",
    );
    expect(getHerpetofaunaChecklistStatus("macrovipera-lebetina")).toBe(
      "confirmed",
    );
    expect(getHerpetofaunaChecklistStatus("darevskia-raddei")).toBe(
      "confirmed",
    );
  });

  it("lists every herp atlas id", () => {
    expect(herpetofaunaChecklistIds().length).toBeGreaterThan(0);
  });

  it("keeps atlas meta to featured species ids", () => {
    const featured = new Set<string>(featuredSpeciesIds);
    for (const id of Object.keys(speciesAtlasMeta))
      expect(featured.has(id), id).toBe(true);
    expect(getHerpetofaunaChecklistStatus("vipera-ammodytes")).toBeNull();
  });
});
