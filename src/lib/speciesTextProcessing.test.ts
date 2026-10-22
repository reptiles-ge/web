import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { transformWithAgent } from "@/lib/contentEditorAgent";
import { buildEditorPrompt } from "@/lib/contentEditorPrompt";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";
import {
  getSpeciesTextFields,
  mdxSpeciesTextSource,
  rewriteSpeciesTexts,
} from "@/lib/speciesTextProcessing";

vi.mock("@/lib/contentEditorAgent", () => ({ transformWithAgent: vi.fn() }));

const four = (text: string) => ({ en: text, ka: text, ru: text, tr: text });

function speciesFixture(fields: Record<string, string>) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "species-texts-test-"));
  const folder = path.join(cwd, "src/content/species/test-species");
  fs.mkdirSync(folder, { recursive: true });
  const body = Object.entries(fields)
    .map(([key, value]) => `${key}: "${value}"`)
    .join("\n");
  for (const locale of ["ka", "en", "ru", "tr"])
    fs.writeFileSync(
      path.join(folder, `${locale}.mdx`),
      `---\nid: test-species\ncommonName: გიურზა\nscientificName: Test species\ndanger: High\n${body}\n---\n`,
    );
  return cwd;
}

describe("species page text fields", () => {
  it("includes every identification trait and FAQ answer", () => {
    const raw = `---
interaction: Interaction
overview: Overview
habitat: Habitat
diet: Diet
behavior: Behavior
conservation: Conservation
identification:
  coloration: Brown with dark markings
  colors:
    - brown
  summary: Summary
  traits:
    - First trait
    - Second trait
    - Third trait
faq:
  - question: First question
    answer: First answer
  - question: Second question
    answer: Second answer
  - question: Third question
    answer: Third answer
  - question: Fourth question
    answer: Fourth answer
---
`;
    expect(getSpeciesTextFields(raw)).toEqual([
      "interaction",
      "overview",
      "identification.summary",
      "identification.coloration",
      "identification.traits.0",
      "identification.traits.1",
      "identification.traits.2",
      "habitat",
      "diet",
      "behavior",
      "conservation",
      "faq.0.answer",
      "faq.1.answer",
      "faq.2.answer",
      "faq.3.answer",
    ]);
  });

  it("resolves every Caspian turtle text field in all four locales", async () => {
    const id = "mauremys-caspica";
    const raw = fs.readFileSync(
      path.join(process.cwd(), "src/content/species", id, "ka.mdx"),
      "utf8",
    );
    for (const field of getSpeciesTextFields(raw)) {
      await expect(
        resolveEditorTarget({ field, id, kind: "species" }),
      ).resolves.toHaveProperty("source");
    }
  });
});

describe("page-aware species text rewrite", () => {
  it("passes page context and sends one style repair", async () => {
    const cwd = speciesFixture({
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
    const { notes, updates } = await rewriteSpeciesTexts(
      await mdxSpeciesTextSource("test-species", cwd),
    );
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
    const cwd = speciesFixture({
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
    const { notes, updates } = await rewriteSpeciesTexts(
      await mdxSpeciesTextSource("test-species", cwd),
    );
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
    const deduped = await rewriteSpeciesTexts(
      await mdxSpeciesTextSource("test-species", cwd),
    );
    expect(deduped.updates.map(({ field }) => field)).toEqual([
      "overview",
      "habitat",
    ]);
  });

  it("writes home fields first and the lead last with the rewritten page", async () => {
    const cwd = speciesFixture({
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
    const { notes, updates } = await rewriteSpeciesTexts(
      await mdxSpeciesTextSource("test-species", cwd),
    );
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
    const cwd = speciesFixture({
      overview:
        "A viper like the [racer](test-racer). It is dangerous to people.",
    });
    const folder = path.join(cwd, "src/content/species/test-racer");
    fs.mkdirSync(folder, { recursive: true });
    for (const [locale, name] of Object.entries({
      en: "Spotted Whip Snake",
      ka: "ნაირფერი მცურავი",
      ru: "Пятнистый полоз",
      tr: "Benekli kamçı yılanı",
    }))
      fs.writeFileSync(
        path.join(folder, `${locale}.mdx`),
        `---\ncommonName: ${name}\n---\n`,
      );
    const calls: Parameters<typeof transformWithAgent>[0][] = [];
    vi.mocked(transformWithAgent).mockImplementation(async (input) => {
      calls.push(input);
      return four(input.selected);
    });
    await rewriteSpeciesTexts(await mdxSpeciesTextSource("test-species", cwd));
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
