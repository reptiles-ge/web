import { describe, expect, it } from "vitest";

import { assertSpeciesAnalysisFiles } from "@/lib/speciesPageAnalysis";

describe("species page analysis file scope", () => {
  it("accepts only the target species translations", () => {
    expect(() =>
      assertSpeciesAnalysisFiles(
        [
          "src/content/species/natrix-natrix/ka.mdx",
          "src/content/species/natrix-natrix/en.mdx",
        ],
        "natrix-natrix",
      ),
    ).not.toThrow();
    expect(() =>
      assertSpeciesAnalysisFiles(
        ["src/content/species/natrix-tessellata/ka.mdx"],
        "natrix-natrix",
      ),
    ).toThrow();
    expect(() =>
      assertSpeciesAnalysisFiles(
        ["src/content/species/natrix-natrix/notes.md"],
        "natrix-natrix",
      ),
    ).toThrow();
  });

  it("allows lookalike registry edits only in the lookalike review", () => {
    const files = [
      "src/content/species/natrix-natrix/ka.mdx",
      "src/lib/speciesRoutes.test.ts",
      "src/lib/speciesRoutes.ts",
    ];
    expect(() =>
      assertSpeciesAnalysisFiles(files, "natrix-natrix", "lookalikes"),
    ).not.toThrow();
    expect(() =>
      assertSpeciesAnalysisFiles(files, "natrix-natrix", "links"),
    ).toThrow();
    expect(() =>
      assertSpeciesAnalysisFiles(
        ["src/content/species/natrix-tessellata/ka.mdx"],
        "natrix-natrix",
        "lookalikes",
      ),
    ).toThrow();
  });

  it("allows record, map, and region edits only for the target species review", () => {
    const files = [
      "src/content/species/natrix-natrix/ka.mdx",
      "src/components/map/SpeciesRangeMap.tsx",
      "src/data/mapRegions.ts",
      "src/data/regions.test.ts",
      "src/lib/halyomorphaOccurrences.ts",
      "src/lib/halyomorphaOccurrences.test.ts",
    ];
    expect(() =>
      assertSpeciesAnalysisFiles(files, "natrix-natrix", "records"),
    ).not.toThrow();
    expect(() =>
      assertSpeciesAnalysisFiles(files, "natrix-natrix", "analysis"),
    ).toThrow();
    expect(() =>
      assertSpeciesAnalysisFiles(
        ["src/content/species/natrix-tessellata/ka.mdx"],
        "natrix-natrix",
        "records",
      ),
    ).toThrow();
  });
});
