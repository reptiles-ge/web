import { describe, expect, it } from "vitest";

import { hasRoutePlaceholder } from "@/lib/routePlaceholder";

describe("hasRoutePlaceholder", () => {
  it("detects literal dynamic route placeholders", () => {
    expect(hasRoutePlaceholder("/snakes/[slug]")).toBe(true);
    expect(hasRoutePlaceholder("/regions/[id]")).toBe(true);
  });

  it("detects encoded dynamic route placeholders", () => {
    expect(hasRoutePlaceholder("/snakes/%5Bslug%5D")).toBe(true);
    expect(hasRoutePlaceholder("/regions/%5Bid%5D")).toBe(true);
  });

  it("ignores normal public paths", () => {
    expect(hasRoutePlaceholder("/gvelebi/giurza")).toBe(false);
    expect(hasRoutePlaceholder("/regions/adjara")).toBe(false);
  });
});
