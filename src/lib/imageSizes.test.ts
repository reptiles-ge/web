import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  galleryFeaturedSizes,
  galleryThumbSizes,
  RELATED_CARD_SIZES,
} from "@/lib/imageSizes";

describe("image sizes", () => {
  it("sizes gallery thumbs to the two-column mobile slot, not 50vw", () => {
    expect(galleryThumbSizes(12)).toContain(
      "calc((100vw - 3rem - 0.75rem) / 2)",
    );
    expect(galleryThumbSizes(12)).not.toContain("50vw");
  });

  it("sizes the featured gallery tile to the padded content width", () => {
    expect(galleryFeaturedSizes()).toContain("calc(100vw - 3rem)");
    expect(galleryFeaturedSizes()).not.toBe("100vw");
  });

  it("uses full content width for a single gallery photo", () => {
    expect(galleryThumbSizes(1)).toBe(galleryFeaturedSizes());
  });

  it("sizes related cards to the padded grid, not 100vw", () => {
    expect(RELATED_CARD_SIZES).toContain("calc(100vw - 3rem)");
    expect(RELATED_CARD_SIZES).not.toContain("100vw,");
  });
});

describe("logo assets", () => {
  it("ships 88 and 160 pixel sources", () => {
    for (const file of [
      "logo-88.avif",
      "logo-88.webp",
      "logo-160.avif",
      "logo-160.webp",
    ]) {
      const filePath = path.join(process.cwd(), "public/images", file);
      expect(fs.existsSync(filePath), file).toBe(true);
      expect(fs.statSync(filePath).size).toBeLessThan(20_000);
    }
  });
});
