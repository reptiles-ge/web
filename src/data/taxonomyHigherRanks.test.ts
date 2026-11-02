import { describe, expect, it } from "vitest";

import {
  familyHigherRanks,
  MAPPED_FAMILIES,
  MAPPED_ORDERS,
  unmappedFamilies,
} from "@/data/taxonomyHigherRanks";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

describe("familyHigherRanks", () => {
  it("maps every family in the catalog to an order and a class", () => {
    expect(
      unmappedFamilies(speciesCatalogFixture("ka").map((item) => item.family)),
    ).toEqual([]);
  });

  it("gives every mapped order a class", () => {
    for (const family of MAPPED_FAMILIES) {
      const ranks = familyHigherRanks(family);
      expect(MAPPED_ORDERS, family).toContain(ranks?.order);
      expect(ranks?.className, family).toBeTruthy();
    }
  });

  it("places vipers in Squamata, Reptilia", () => {
    expect(familyHigherRanks("Viperidae")).toEqual({
      className: "Reptilia",
      order: "Squamata",
    });
  });

  it("leaves an unknown family without higher ranks", () => {
    expect(familyHigherRanks("Unknownidae")).toBeUndefined();
    expect(
      unmappedFamilies(["Viperidae", "Unknownidae", "Unknownidae"]),
    ).toEqual(["Unknownidae"]);
  });
});
