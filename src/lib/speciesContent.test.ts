import { describe, expect, it } from "vitest";

import {
  hasRealIdentification,
  isPlaceholderBody,
} from "@/lib/speciesContent";

describe("isPlaceholderBody", () => {
  it("treats empty and checklist-pointer copy as placeholders", () => {
    expect(isPlaceholderBody("")).toBe(true);
    expect(isPlaceholderBody("  ")).toBe(true);
    expect(isPlaceholderBody("See Tarkhnishvili et al. 2026 for range.")).toBe(
      true,
    );
    expect(isPlaceholderBody("იხილეთ ჩეკლისტი დეტალებისთვის")).toBe(true);
  });

  it("keeps real biology text", () => {
    expect(
      isPlaceholderBody("A large viper of dry rocky slopes in eastern Georgia."),
    ).toBe(false);
  });
});

describe("hasRealIdentification", () => {
  it("rejects missing, empty, and checklist-meta-only traits", () => {
    expect(hasRealIdentification(undefined)).toBe(false);
    expect(hasRealIdentification({ summary: "", traits: [] })).toBe(false);
    expect(
      hasRealIdentification({
        summary: "",
        traits: ["checklist-confirmed", "Colubridae", "2026"],
      }),
    ).toBe(false);
  });

  it("accepts at least one field trait", () => {
    expect(
      hasRealIdentification({
        summary: "",
        traits: ["Blunt snout and keeled dorsal scales"],
      }),
    ).toBe(true);
  });
});
