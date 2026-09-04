import { describe, expect, it } from "vitest";

import { kaToSlug, slugify } from "@/lib/slugify";

describe("kaToSlug", () => {
  it("transliterates Georgian to a latin slug", () => {
    expect(kaToSlug("გიურზა")).toBe("giurza");
  });

  it("collapses punctuation and case", () => {
    expect(slugify("Macrovipera  lebetina!")).toBe("macrovipera-lebetina");
  });
});
