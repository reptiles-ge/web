import { describe, expect, it } from "vitest";

import { speciesNameWithScientific } from "@/lib/speciesDisplayName";

describe("speciesNameWithScientific", () => {
  it("adds the scientific name in brackets", () => {
    expect(speciesNameWithScientific("გიურზა", "Macrovipera lebetinus")).toBe(
      "გიურზა (Macrovipera lebetinus)",
    );
  });

  it("does not repeat a common name that is the scientific name", () => {
    expect(
      speciesNameWithScientific(
        "Cheiracanthium punctorium",
        "Cheiracanthium punctorium",
      ),
    ).toBe("Cheiracanthium punctorium");
    expect(
      speciesNameWithScientific(
        " cheiracanthium Punctorium",
        "Cheiracanthium punctorium ",
      ),
    ).toBe("cheiracanthium Punctorium");
  });

  it("falls back to whichever name is set", () => {
    expect(speciesNameWithScientific("", "Vipera eriwanensis")).toBe(
      "Vipera eriwanensis",
    );
    expect(speciesNameWithScientific("Jumping spider", "")).toBe(
      "Jumping spider",
    );
  });
});
