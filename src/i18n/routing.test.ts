import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

describe("routing", () => {
  it("does not set a locale cookie, so HTML responses stay cacheable", () => {
    expect(routing.localeCookie).toBe(false);
    expect(routing.localeDetection).toBe(false);
  });
});
