import { describe, expect, it } from "vitest";

import type { OptimizedImageEntry } from "@/data/optimizedImages";

import { formatGeneratedImages } from "@/lib/imageOptimize";

const entry = (path: string): OptimizedImageEntry => ({
  formats: ["avif", "webp"],
  height: 600,
  path,
  width: 800,
  widths: [400, 800],
});

describe("formatGeneratedImages", () => {
  it("formats an empty map as an empty object", () => {
    expect(formatGeneratedImages({})).toBe("{\n\n}");
  });

  it("emits JSON-compatible objects with inline arrays", () => {
    const output = formatGeneratedImages({ "https://cdn/a.jpg": entry("a") });
    expect(output).toBe(`{
  "https://cdn/a.jpg": {
    "path": "a",
    "width": 800,
    "height": 600,
    "widths": [400, 800],
    "formats": ["avif", "webp"]
  }
}`);
  });

  it("sorts entries by source key", () => {
    const output = formatGeneratedImages(
      Object.fromEntries([
        ["https://cdn/b.jpg", entry("b")],
        ["https://cdn/a.jpg", entry("a")],
      ]),
    );
    expect(output.indexOf("a.jpg")).toBeLessThan(output.indexOf("b.jpg"));
  });

  it("round-trips through JSON.parse", () => {
    const images = {
      "https://cdn/a.jpg": entry("a"),
      "https://cdn/b.jpg": entry("b"),
    };
    expect(JSON.parse(formatGeneratedImages(images))).toEqual(images);
  });
});
