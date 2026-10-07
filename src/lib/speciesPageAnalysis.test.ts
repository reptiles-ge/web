import { describe, expect, it } from "vitest";

import {
  fillSpeciesPrompt,
  runSpeciesWorkflowSteps,
  selectSpeciesAnalysisFiles,
  selectSpeciesCreationFiles,
  speciesFrontmatterError,
  validateSpeciesCreationInput,
  validateSpeciesWorkflowModes,
} from "@/lib/speciesPageAnalysis";

describe("species page creation", () => {
  it("normalizes the two editor inputs and derives the content id", () => {
    expect(
      validateSpeciesCreationInput(
        "  კავკასიური   მორიელი  ",
        "Olivierus   caucasicus",
      ),
    ).toEqual({
      commonName: "კავკასიური მორიელი",
      id: "olivierus-caucasicus",
      scientificName: "Olivierus caucasicus",
    });
  });

  it("rejects incomplete and multiline names", () => {
    expect(() =>
      validateSpeciesCreationInput("სახეობა", "Olivierus"),
    ).toThrow();
    expect(() =>
      validateSpeciesCreationInput(
        "სახეობა\nინსტრუქცია",
        "Olivierus caucasicus",
      ),
    ).toThrow();
  });

  it("allows only the new page and its required registries", () => {
    expect(
      selectSpeciesCreationFiles(
        [
          "src/content/species/new-species/ka.mdx",
          "src/content/species/new-species/en.mdx",
          "src/content/species/other-species/ka.mdx",
          "src/data/speciesPublish.ts",
          "src/data/speciesAtlasMeta.ts",
          "src/app/page.tsx",
        ],
        "new-species",
      ),
    ).toEqual([
      "src/content/species/new-species/ka.mdx",
      "src/content/species/new-species/en.mdx",
      "src/data/speciesPublish.ts",
      "src/data/speciesAtlasMeta.ts",
    ]);
  });
});

describe("species prompt header", () => {
  it("always sets editing mode and fills the species path", () => {
    const prompt = fillSpeciesPrompt(
      "სამიზნე გვერდი ან სახეობა: [placeholder]\nრეჟიმი: [რედაქტირება / მხოლოდ ანგარიში].\n",
      "picus-viridis",
    );
    expect(prompt).toBe(
      "სამიზნე გვერდი / სახეობა: src/content/species/picus-viridis/ka.mdx (species ID: picus-viridis)\nრეჟიმი: რედაქტირება.\n",
    );
  });
});

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
      "src/data/speciesRangeMaps/index.ts",
      "src/data/speciesRangeMaps/natrix-natrix.ts",
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
  it("detects the unquoted colon that broke the analysis-to-texts handoff", () => {
    const raw = (value: string) =>
      `---\nstats:\n  - label: სიგრძე\n    value: ${value}\n---\n`;
    expect(speciesFrontmatterError(raw("ზამთრის ჯგუფი: 82–158 სმ"))).toMatch(
      /incomplete explicit mapping pair/,
    );
    expect(
      speciesFrontmatterError(raw('"ზამთრის ჯგუფი: 82–158 სმ"')),
    ).toBeNull();
  });

  it("runs steps in the supplied order and stops when a step fails", async () => {
    const events: string[] = [];
    const result = await runSpeciesWorkflowSteps(
      ["records", "analysis", "links"],
      async (step) => {
        events.push(`start:${step}`);
        await Promise.resolve();
        events.push(`end:${step}`);
        if (step === "analysis") throw new Error("failed");
      },
    );
    expect(result?.step).toBe("analysis");
    expect(result?.error).toEqual(new Error("failed"));
    expect(events).toEqual([
      "start:records",
      "end:records",
      "start:analysis",
      "end:analysis",
    ]);
    expect(
      await runSpeciesWorkflowSteps(["records"], async () => undefined),
    ).toBeNull();
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
