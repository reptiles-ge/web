import { describe, expect, it } from "vitest";

import {
  chromeIconButtonClass,
  chromeShellClass,
  NAVBAR_SCROLL_OFFSET,
} from "@/lib/chromeStyles";

describe("chrome styles", () => {
  it("uses the light shell unless a dark variant is requested", () => {
    expect(NAVBAR_SCROLL_OFFSET).toBe(40);
    expect(chromeIconButtonClass()).toContain("bg-card/90");
    expect(chromeIconButtonClass("dark")).toContain("bg-white/10");
    expect(chromeShellClass()).toContain("text-foreground");
    expect(chromeShellClass("dark")).toContain("text-white");
  });
});
