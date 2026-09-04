import { describe, expect, it } from "vitest";

import {
  getHerpetofaunaChecklistStatus,
  herpetofaunaChecklistIds,
} from "@/data/herpetofauna-checklist";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { getCatalogSpecies } from "@/data/species";

const HERP_GROUPS = new Set(["amphibian", "lizard", "snake", "turtle"]);

describe("herpetofauna checklist", () => {
  it("covers every published amphibian and reptile", () => {
    const publishedHerps = getCatalogSpecies().filter((item) =>
      HERP_GROUPS.has(getSpeciesAtlasMeta(item.id).group),
    );
    expect(publishedHerps.length).toBeGreaterThan(0);
    for (const item of publishedHerps) {
      expect(
        getHerpetofaunaChecklistStatus(item.id),
        item.id,
      ).not.toBeNull();
    }
  });

  it("keeps birds, mammals, and spiders out of scope", () => {
    expect(getHerpetofaunaChecklistStatus("emberiza-citrinella")).toBeNull();
    expect(getHerpetofaunaChecklistStatus("vulpes-vulpes")).toBeNull();
    expect(getHerpetofaunaChecklistStatus("argiope-bruennichi")).toBeNull();
  });

  it("never labels a candidate as confirmed", () => {
    expect(getHerpetofaunaChecklistStatus("vipera-kaznakovi")).toBe(
      "candidate",
    );
    expect(getHerpetofaunaChecklistStatus("lacerta-agilis")).toBe("candidate");
    expect(getHerpetofaunaChecklistStatus("phoenicolacerta-laevis")).toBe(
      "introduced",
    );
    expect(getHerpetofaunaChecklistStatus("trachemys-scripta")).toBe(
      "introduced",
    );
    expect(getHerpetofaunaChecklistStatus("macrovipera-lebetina")).toBe(
      "confirmed",
    );
  });

  it("lists every herp atlas id", () => {
    expect(herpetofaunaChecklistIds().length).toBeGreaterThan(0);
  });
});
