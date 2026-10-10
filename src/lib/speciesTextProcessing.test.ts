import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { resolveEditorTarget } from "@/lib/contentEditorTarget";
import { getSpeciesTextFields } from "@/lib/speciesTextProcessing";

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
