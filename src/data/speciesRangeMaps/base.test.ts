import { describe, expect, it } from "vitest";

import { HALYOMORPHA_RANGE_COPY } from "@/data/speciesRangeMaps/base";

describe("Halyomorpha range copy", () => {
  it("names the region in every locale", () => {
    expect(HALYOMORPHA_RANGE_COPY.en.regionPageLabel("Kakheti")).toBe(
      "Kakheti region page",
    );
    expect(HALYOMORPHA_RANGE_COPY.ka.regionPageLabel("კახეთი")).toContain(
      "კახეთი",
    );
    expect(HALYOMORPHA_RANGE_COPY.ru.regionPageLabel("Кахетия")).toContain(
      "Кахетия",
    );
    expect(HALYOMORPHA_RANGE_COPY.tr.regionPageLabel("Kaheti")).toContain(
      "Kaheti",
    );
  });
});
