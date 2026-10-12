import { describe, expect, it } from "vitest";

import { regions } from "@/data/regions";
import { routing } from "@/i18n/routing";
import { getRegionsIndexItems } from "@/lib/regionsIndex";

describe("getRegionsIndexItems", () => {
  const items = getRegionsIndexItems("ka");

  it("returns every region in map order with two-digit numbers", () => {
    expect(items.map((item) => item.id)).toEqual(
      regions.map((region) => region.id),
    );
    expect(items[0].n).toBe("01");
    expect(items.at(-1)?.n).toBe(String(regions.length).padStart(2, "0"));
  });

  it("splits each region's species into groups that add up to the total", () => {
    for (const item of items) {
      const sum = Object.values(item.mix).reduce((a, b) => a + b, 0);
      expect(sum).toBe(item.total);
      expect(item.total).toBeGreaterThan(0);
    }
  });

  it("pads the region bounding box for the thumbnail view box", () => {
    const abkhazia = items.find((item) => item.id === "abkhazia");
    expect(abkhazia?.thumbViewBox).toBe("22.0 -0.3 340.8 263.6");
    expect(abkhazia?.mix).toEqual({
      amphibians: 9,
      birds: 10,
      lizards: 3,
      other: 4,
      snakes: 5,
    });
  });

  it("uses the label override for Kakheti and generated points elsewhere", () => {
    expect(items.find((item) => item.id === "kakheti")?.label).toEqual([
      824, 337.6,
    ]);
    expect(items.find((item) => item.id === "abkhazia")?.label).toEqual([
      256.1, 135.1,
    ]);
  });

  it("lists only high or moderate risk species as venomous, with links", () => {
    const kakheti = items.find((item) => item.id === "kakheti");
    expect(kakheti?.venomous.length).toBeGreaterThan(0);
    for (const species of kakheti?.venomous ?? []) {
      expect(species.name.length).toBeGreaterThan(0);
      expect(species.href).toBeTruthy();
    }
  });

  it("localizes names, habitats, and neighbours in every live locale", () => {
    for (const locale of routing.locales) {
      const localized = getRegionsIndexItems(locale);
      for (const item of localized) {
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.nameIn.length).toBeGreaterThan(0);
        expect(item.biome.length).toBeGreaterThan(0);
        expect(item.habitats.length).toBeGreaterThan(0);
        expect(
          item.relatedIds.every((id) => localized.some((r) => r.id === id)),
        ).toBe(true);
      }
    }
  });
});
