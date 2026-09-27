import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getSpeciesTextFields } from "@/lib/speciesTextProcessing";

describe("species page text fields", () => {
  it("includes every identification trait and FAQ answer", () => {
    const raw = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/content/species/zamenis-hohenackeri/ka.mdx",
      ),
      "utf8",
    );
    expect(getSpeciesTextFields(raw)).toEqual([
      "interaction",
      "overview",
      "identification.summary",
      "identification.traits.0",
      "identification.traits.1",
      "identification.traits.2",
      "identification.traits.3",
      "habitat",
      "diet",
      "behavior",
      "conservation",
      "faq.0.answer",
      "faq.1.answer",
      "faq.2.answer",
      "faq.3.answer",
      "faq.4.answer",
      "faq.5.answer",
      "faq.6.answer",
      "faq.7.answer",
    ]);
  });
});
