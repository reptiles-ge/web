import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";

const DISPLAY_SIZES = [
  "text-display-kicker",
  "text-display-card",
  "text-display-title",
  "text-display-lead",
  "text-display-hero",
  "text-display-stat",
];

describe("cn", () => {
  it("keeps a display size next to a text colour", () => {
    expect(cn("text-display-card text-foreground")).toBe(
      "text-display-card text-foreground",
    );
  });

  it("keeps only the last of two display sizes", () => {
    const sizes = ["text-display-card", "text-display-title"].join(" ");

    expect(cn(sizes)).toBe("text-display-title");
  });

  it.each(DISPLAY_SIZES)("treats %s as a font size, not a colour", (size) => {
    expect(cn(size, "text-foreground")).toBe(`${size} text-foreground`);
    expect(cn("text-foreground", size)).toBe(`text-foreground ${size}`);
    expect(cn("text-lg", size)).toBe(size);
    expect(cn(size, "text-[22px]")).toBe("text-[22px]");
  });

  it("treats text-balance-tight as text wrap, not a colour", () => {
    expect(cn("text-balance-tight", "text-foreground")).toBe(
      "text-balance-tight text-foreground",
    );
    expect(cn("text-foreground", "text-balance-tight")).toBe(
      "text-foreground text-balance-tight",
    );
    expect(cn("text-balance-tight", "text-nowrap")).toBe("text-nowrap");
    expect(cn("text-pretty", "text-balance-tight")).toBe("text-balance-tight");
  });

  it("keeps wrap, size and colour on the static range map heading", () => {
    expect(
      cn(
        "group/heading scroll-mt-28",
        "text-balance-tight mt-5 font-display text-display-title font-semibold text-foreground",
      ),
    ).toBe(
      "group/heading scroll-mt-28 text-balance-tight mt-5 font-display text-display-title font-semibold text-foreground",
    );
  });

  it("keeps the display size on a heading merged with base classes", () => {
    expect(
      cn(
        "group/heading scroll-mt-28",
        "font-display text-display-card font-semibold text-foreground",
      ),
    ).toBe(
      "group/heading scroll-mt-28 font-display text-display-card font-semibold text-foreground",
    );
  });
});
