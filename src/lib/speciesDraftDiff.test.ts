import { describe, expect, it } from "vitest";

import { diffSpeciesRecords } from "./speciesDraftDiff";

describe("diffSpeciesRecords", () => {
  it("lists changed, added and removed leaves in a stable order", () => {
    const current = {
      base: { faq: [{ answer: "a" }], overview: "old", stats: [1, 2] },
      translations: { en: { overview: "same" } },
    };
    const draft = {
      base: {
        faq: [{ answer: "b" }],
        interaction: "new",
        overview: "old",
        stats: [1],
      },
      translations: { en: { overview: "same" } },
    };
    expect(diffSpeciesRecords(current, draft)).toEqual([
      { after: "b", before: "a", path: "base.faq.0.answer" },
      { after: "new", before: "", path: "base.interaction" },
      { after: "", before: "2", path: "base.stats.1" },
    ]);
  });

  it("returns nothing for equal records", () => {
    expect(
      diffSpeciesRecords({ a: [1, { b: null }] }, { a: [1, { b: null }] }),
    ).toEqual([]);
  });
});
