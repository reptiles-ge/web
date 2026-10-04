import { describe, expect, it } from "vitest";

import { createRateLimiter } from "@/lib/rateLimit";

describe("createRateLimiter", () => {
  it("allows up to the limit inside the window", () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });

    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 100)).toBe(true);
    expect(allow("a", 200)).toBe(false);
  });

  it("allows again once the window has passed", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 999)).toBe(false);
    expect(allow("a", 1000)).toBe(true);
  });

  it("counts each key separately", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(allow("a", 0)).toBe(true);
    expect(allow("b", 0)).toBe(true);
    expect(allow("a", 1)).toBe(false);
  });
});
