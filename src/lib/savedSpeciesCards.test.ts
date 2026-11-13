import { describe, expect, it } from "vitest";

import { buildSavedSpeciesCards } from "@/lib/savedSpeciesCards";
import { speciesPageUrl } from "@/lib/site";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

describe("buildSavedSpeciesCards", () => {
  it("builds localized cards with risk, regions, link and thumbnail", () => {
    const cards = buildSavedSpeciesCards(speciesCatalogFixture("ka"), "ka");
    const giurza = cards.find((card) => card.id === "macrovipera-lebetina");

    expect(giurza).toMatchObject({
      danger: "High",
      scientificName: "Macrovipera lebetinus",
    });
    expect(giurza?.publicUrl).toBe(
      speciesPageUrl("ka", "macrovipera-lebetina").replace(/^https?:\/\//, ""),
    );
    expect(giurza?.regions.length).toBeGreaterThan(0);
    expect(giurza?.thumb).toBeTruthy();
  });

  it("uses the English pathname on the English list", () => {
    const cards = buildSavedSpeciesCards(speciesCatalogFixture("en"), "en");
    const giurza = cards.find((card) => card.id === "macrovipera-lebetina");
    expect(giurza?.publicUrl).toBe(
      speciesPageUrl("en", "macrovipera-lebetina").replace(/^https?:\/\//, ""),
    );
    expect(giurza?.href).toEqual({
      params: { slug: "macrovipera-lebetina" },
      pathname: "/snakes/[slug]",
    });
  });

  it("leaves groups without a danger scale unrated", () => {
    const cards = buildSavedSpeciesCards(speciesCatalogFixture("ka"), "ka");
    const bird = speciesCatalogFixture("ka").find(
      (item) => item.group === "bird",
    );
    if (!bird) return;
    expect(cards.find((card) => card.id === bird.id)?.danger).toBeNull();
  });
});
