import { describe, expect, it } from "vitest";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { taxonIdentifiers } from "@/data/taxonIdentifiers";
import { speciesSameAs } from "@/lib/createSpeciesRoute";
import { taxonIdentifierUrls } from "@/lib/taxonIdentifiers";

const catalogIds = new Set(getCatalogSpecies().map((species) => species.id));
const entries = Object.entries(taxonIdentifiers);

describe("taxon identifiers", () => {
  it("keys every entry by a published catalog species id", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const [id] of entries) expect(catalogIds).toContain(id);
  });

  it("stores well-formed GBIF, iNaturalist and Wikidata ids", () => {
    for (const [, ids] of entries) {
      expect(Object.keys(ids).length).toBeGreaterThan(0);
      if (ids.gbif !== undefined) {
        expect(Number.isSafeInteger(ids.gbif) && ids.gbif > 0).toBe(true);
      }
      if (ids.inaturalist !== undefined) {
        expect(
          Number.isSafeInteger(ids.inaturalist) && ids.inaturalist > 0,
        ).toBe(true);
      }
      if (ids.wikidata !== undefined) {
        expect(ids.wikidata).toMatch(/^Q[1-9]\d*$/);
      }
    }
  });

  it("never gives two species the same identifier", () => {
    for (const source of ["gbif", "inaturalist", "wikidata"] as const) {
      const values = entries
        .map(([, ids]) => ids[source])
        .filter((value) => value !== undefined);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("keeps the Darevskia species apart", () => {
    const darevskia = entries.filter(([id]) => id.startsWith("darevskia-"));
    expect(darevskia.length).toBeGreaterThan(10);
    const wikidata = darevskia.map(([, ids]) => ids.wikidata).filter(Boolean);
    expect(new Set(wikidata).size).toBe(wikidata.length);
  });

  it("gives the nose-horned viper the ids of its profile name, Vipera ammodytes", () => {
    expect(getSpeciesById("vipera-transcaucasiana")?.scientificName).toBe(
      "Vipera ammodytes",
    );
    expect(taxonIdentifiers["vipera-transcaucasiana"]).toEqual({
      gbif: 2444308,
      inaturalist: 1701177,
      wikidata: "Q583923",
    });
  });

  it("builds canonical entity URLs", () => {
    expect(taxonIdentifierUrls("halyomorpha-halys")).toEqual([
      "https://www.wikidata.org/wiki/Q3270185",
      "https://www.gbif.org/species/4485843",
      "https://www.inaturalist.org/taxa/81923",
    ]);
    expect(taxonIdentifierUrls("not-a-species")).toEqual([]);
  });

  it.each([
    [
      "macrovipera-lebetina",
      [
        "https://www.wikidata.org/wiki/Q918123",
        "https://www.gbif.org/species/2444716",
        "https://www.inaturalist.org/taxa/105083",
      ],
    ],
    [
      "halyomorpha-halys",
      [
        "https://gd.eppo.int/taxon/HALYHA",
        "https://biodiversity.iliauni.edu.ge/ka/species/14072",
        "https://www.wikidata.org/wiki/Q3270185",
        "https://www.gbif.org/species/4485843",
        "https://www.inaturalist.org/taxa/81923",
      ],
    ],
    [
      "natrix-natrix",
      [
        "https://www.wikidata.org/wiki/Q170713",
        "https://www.gbif.org/species/6161347",
      ],
    ],
  ])("adds the verified ids of %s to the Taxon sameAs", (id, expected) => {
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    const sameAs = speciesSameAs(species!);
    for (const url of expected) expect(sameAs).toContain(url);
    expect(new Set(sameAs).size).toBe(sameAs.length);
  });

  it("takes GBIF ids only from the verified table, not from cited source links", () => {
    for (const species of getCatalogSpecies()) {
      const gbif = speciesSameAs(species).filter((url) =>
        url.startsWith("https://www.gbif.org/species/"),
      );
      const expected = taxonIdentifiers[species.id]?.gbif;
      expect(gbif).toEqual(
        expected === undefined
          ? []
          : [`https://www.gbif.org/species/${expected}`],
      );
    }
  });
});
