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
