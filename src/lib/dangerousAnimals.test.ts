import { describe, expect, it } from "vitest";

import { dangerousAnimalRows } from "@/lib/dangerousAnimals";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

describe("dangerous animal rows", () => {
  it("lists every High and Moderate species, High first", async () => {
    const catalog = await getSpeciesCatalog("en");
    const rows = dangerousAnimalRows(catalog);
    const expected = catalog
      .filter((item) => item.danger === "High" || item.danger === "Moderate")
      .map((item) => item.id);

    expect(rows.map((row) => row.id).sort()).toEqual(expected.sort());
    const firstModerate = rows.findIndex((row) => row.danger === "Moderate");
    expect(
      rows.slice(0, firstModerate).every((row) => row.danger === "High"),
    ).toBe(true);
    expect(
      rows.slice(firstModerate).every((row) => row.danger === "Moderate"),
    ).toBe(true);
  });

  it("uses the profile location and the matching bite guide", async () => {
    const catalog = await getSpeciesCatalog("en");
    const byId = new Map(
      dangerousAnimalRows(catalog).map((row) => [row.id, row]),
    );

    expect(byId.get("macrovipera-lebetina")?.guide.key).toBe("gyurzaBite");
    expect(byId.get("vipera-kaznakovi")?.guide.key).toBe("snakeBite");
    expect(byId.get("latrodectus-tredecimguttatus")?.guide.key).toBe(
      "spiderBite",
    );
    expect(byId.get("mesobuthus-eupeus")?.guide.key).toBe("scorpionSting");
    for (const row of byId.values()) {
      expect(row.location).toBe(
        catalog.find((item) => item.id === row.id)?.location,
      );
    }
  });
});
