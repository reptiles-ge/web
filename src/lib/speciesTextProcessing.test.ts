import { describe, expect, it, vi } from "vitest";

import { transformWithAgent } from "@/lib/contentEditorAgent";
import { buildEditorPrompt } from "@/lib/contentEditorPrompt";
import {
  rewriteSpeciesTexts,
  type SpeciesTextSource,
} from "@/lib/speciesTextProcessing";

vi.mock("@/lib/contentEditorAgent", () => ({ transformWithAgent: vi.fn() }));

const four = (text: string) => ({ en: text, ka: text, ru: text, tr: text });

const FIELD_ORDER = [
  "description",
  "interaction",
  "overview",
  "identification.summary",
  "identification.coloration",
  "habitat",
  "diet",
  "behavior",
  "conservation",
];

function textSource(
  fields: Record<string, string>,
  names: Record<string, Record<"en" | "ka" | "ru" | "tr", string>> = {},
): SpeciesTextSource {
  return {
    commonName: "გიურზა",
    danger: "High",
    fields: FIELD_ORDER.filter((field) => fields[field]),
    id: "test-species",
    read: (_, field) => fields[field] ?? "",
    scientificName: "Test species",
    speciesNames: async (ids) => ids.flatMap((id) => names[id] ?? []),
  };
}

describe("page-aware species text rewrite", () => {
  it("passes page context and sends one style repair", async () => {
    const source = textSource({
      habitat: "It lives on dry slopes to 1500 m. It hides under stones.",
      overview: "A large viper of dry slopes. It is dangerous to people.",
    });
    const calls: Parameters<typeof transformWithAgent>[0][] = [];
    vi.mocked(transformWithAgent).mockImplementation(async (input) => {
      calls.push(input);
      if (input.field === "overview" && !input.styleRepair)
        return four("This atlas lists a large viper. It is dangerous.");
      return four(input.selected);
    });
    const { notes, updates } = await rewriteSpeciesTexts(source);
    const first = calls.find((call) => call.field === "overview")!;
    expect(first).toMatchObject({
      commonName: "გიურზა",
      latinName: "Test species",
      otherFields: {
        habitat: "It lives on dry slopes to 1500 m. It hides under stones.",
      },
      riskLevel: "High",
    });
    const repair = calls.find((call) => call.styleRepair)!;
    expect(repair.field).toBe("overview");
    expect(repair.styleRepair!.issues).toContain("this atlas");
    expect(calls).toHaveLength(3);
    expect(notes).toEqual([]);
    expect(updates.map(({ field }) => field)).toEqual(["overview", "habitat"]);
  });

  it("keeps a field whose number is lost from the whole page", async () => {
    const source = textSource({
      habitat: "It lives on dry slopes to 1500 m. It hides under stones.",
      overview: "A viper up to 1500 m. It is dangerous to people.",
    });
    vi.mocked(transformWithAgent).mockImplementation(async (input) =>
      four(
        input.field === "overview"
          ? "A viper of dry slopes. It is dangerous to people."
          : "It lives on dry slopes. It hides under stones.",
      ),
    );
    const { notes, updates } = await rewriteSpeciesTexts(source);
    expect(updates).toEqual([]);
    expect(notes).toEqual([
      "overview: რიცხვი დაიკარგა ან შეიცვალა, ველი უცვლელად დარჩა",
      "habitat: რიცხვი დაიკარგა ან შეიცვალა, ველი უცვლელად დარჩა",
    ]);
    vi.mocked(transformWithAgent).mockImplementation(async (input) =>
      four(
        input.field === "overview"
          ? "A viper of dry slopes. It is dangerous to people."
          : input.selected,
      ),
    );
    const deduped = await rewriteSpeciesTexts(source);
    expect(deduped.updates.map(({ field }) => field)).toEqual([
      "overview",
      "habitat",
    ]);
  });

  it("writes home fields first and the lead last with the rewritten page", async () => {
    const source = textSource({
      description: "A viper of eastern Georgia.",
      habitat: "It lives on dry slopes to 1500 m. It hides under stones.",
      overview: "A viper of dry slopes. It is dangerous to people.",
    });
    const calls: Parameters<typeof transformWithAgent>[0][] = [];
    vi.mocked(transformWithAgent).mockImplementation(async (input) => {
      calls.push(input);
      if (input.field === "habitat")
        return four(
          "It lives in dry rocky places to 1500 m. It hides under stones.",
        );
      if (input.field === "overview")
        return four("The viper lives up to 1500 m. It is dangerous to people.");
      return four(input.selected);
    });
    const { notes, updates } = await rewriteSpeciesTexts(source);
    expect(calls.map(({ field }) => field)).toEqual([
      "habitat",
      "overview",
      "description",
    ]);
    expect(calls[1].otherFields?.habitat).toBe(
      "It lives in dry rocky places to 1500 m. It hides under stones.",
    );
    expect(notes).toEqual([]);
    expect(updates.find(({ field }) => field === "overview")?.result.ka).toBe(
      "The viper lives up to 1500 m. It is dangerous to people.",
    );
  });

  it("gives translations the linked species' official names", async () => {
    const source = textSource(
      {
        overview:
          "A viper like the [racer](test-racer). It is dangerous to people.",
      },
      {
        "test-racer": {
          en: "Spotted Whip Snake",
          ka: "ნაირფერი მცურავი",
          ru: "Пятнистый полоз",
          tr: "Benekli kamçı yılanı",
        },
      },
    );
    const calls: Parameters<typeof transformWithAgent>[0][] = [];
    vi.mocked(transformWithAgent).mockImplementation(async (input) => {
      calls.push(input);
      return four(input.selected);
    });
    await rewriteSpeciesTexts(source);
    expect(calls[0].speciesNames).toEqual([
      {
        en: "Spotted Whip Snake",
        ka: "ნაირფერი მცურავი",
        ru: "Пятнистый полоз",
        tr: "Benekli kamçı yılanı",
      },
    ]);
    expect(buildEditorPrompt({ ...calls[0], styleGuide: "" })).toContain(
      "SPECIES_NAMES:",
    );
    expect(
      buildEditorPrompt({ after: "", before: "", selected: "Text." }),
    ).not.toContain("SPECIES_NAMES");
  });
});
