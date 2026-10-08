import { describe, expect, it } from "vitest";

import { SPECIES_SECTION_IDS, speciesProfileSectionIds } from "@/lib/toc";

describe("speciesProfileSectionIds", () => {
  it("keeps the reading order and omits unavailable sections", () => {
    expect(
      speciesProfileSectionIds({
        biology: true,
        faq: false,
        gallery: true,
        habitat: true,
        identification: true,
        range: true,
        sources: true,
      }),
    ).toEqual([
      SPECIES_SECTION_IDS.overview,
      SPECIES_SECTION_IDS.identification,
      SPECIES_SECTION_IDS.gallery,
      SPECIES_SECTION_IDS.habitat,
      SPECIES_SECTION_IDS.biology,
      SPECIES_SECTION_IDS.sources,
    ]);
  });
});
