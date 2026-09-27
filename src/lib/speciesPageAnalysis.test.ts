import { describe, expect, it } from "vitest";

import {
  runSpeciesWorkflowSteps,
  selectSpeciesAnalysisFiles,
  validateSpeciesWorkflowModes,
} from "@/lib/speciesPageAnalysis";

describe("species page analysis file scope", () => {
  it("selects only the target species translations", () => {
    expect(
      selectSpeciesAnalysisFiles(
        [
          "src/content/species/natrix-natrix/ka.mdx",
          "src/content/species/natrix-natrix/en.mdx",
          "src/content/species/natrix-tessellata/ka.mdx",
          "src/content/species/natrix-natrix/notes.md",
          "AGENTS.md",
        ],
        "natrix-natrix",
      ),
    ).toEqual([
      "src/content/species/natrix-natrix/ka.mdx",
      "src/content/species/natrix-natrix/en.mdx",
    ]);
  });

  it("allows lookalike registry edits only in the lookalike review", () => {
    const files = [
      "src/content/species/natrix-natrix/ka.mdx",
      "src/lib/speciesRoutes.test.ts",
      "src/lib/speciesRoutes.ts",
    ];
    expect(
      selectSpeciesAnalysisFiles(files, "natrix-natrix", "lookalikes"),
    ).toEqual(files);
    expect(selectSpeciesAnalysisFiles(files, "natrix-natrix", "links")).toEqual(
      ["src/content/species/natrix-natrix/ka.mdx"],
    );
    expect(
      selectSpeciesAnalysisFiles(
        ["src/content/species/natrix-tessellata/ka.mdx"],
        "natrix-natrix",
        "lookalikes",
      ),
    ).toEqual([]);
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
    expect(
      selectSpeciesAnalysisFiles(files, "natrix-natrix", "records"),
    ).toEqual(files);
    expect(
      selectSpeciesAnalysisFiles(files, "natrix-natrix", "analysis"),
    ).toEqual(["src/content/species/natrix-natrix/ka.mdx"]);
    expect(
      selectSpeciesAnalysisFiles(
        ["src/content/species/natrix-tessellata/ka.mdx"],
        "natrix-natrix",
        "records",
      ),
    ).toEqual([]);
  });
});

describe("species workflow", () => {
  it("runs steps in the supplied order and stops when a step fails", async () => {
    const events: string[] = [];
    await expect(
      runSpeciesWorkflowSteps(
        ["records", "analysis", "links"],
        async (step) => {
          events.push(`start:${step}`);
          await Promise.resolve();
          events.push(`end:${step}`);
          if (step === "analysis") throw new Error("failed");
        },
      ),
    ).rejects.toThrow("failed");
    expect(events).toEqual([
      "start:records",
      "end:records",
      "start:analysis",
      "end:analysis",
    ]);
  });

  it("rejects duplicate or unknown steps", () => {
    expect(validateSpeciesWorkflowModes(["links", "analysis"])).toEqual([
      "links",
      "analysis",
    ]);
    expect(() => validateSpeciesWorkflowModes(["links", "links"])).toThrow();
    expect(() => validateSpeciesWorkflowModes(["unknown"])).toThrow();
    expect(() => validateSpeciesWorkflowModes([])).toThrow();
  });
});
