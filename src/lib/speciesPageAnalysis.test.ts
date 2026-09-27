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
});
