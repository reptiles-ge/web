import { describe, expect, it } from "vitest";

import {
  optimizedPhotoFormats,
  photoAssetPath,
  photoDerivativeHeight,
  photoDerivativeKey,
  photoDerivativeWidths,
  photographerSlug,
  speciesPhotoKey,
} from "@/lib/photoDerivatives";

describe("photoDerivativeWidths", () => {
  it("uses the full ladder for a wide photo", () => {
    expect(photoDerivativeWidths(4000)).toStrictEqual([
      320, 400, 640, 800, 1200, 2400,
    ]);
  });

  it("stops at the source width without upscaling", () => {
    expect(photoDerivativeWidths(1000)).toStrictEqual([
      320, 400, 640, 800, 1000,
    ]);
    expect(photoDerivativeWidths(800)).toStrictEqual([320, 400, 640, 800]);
    expect(photoDerivativeWidths(200)).toStrictEqual([200]);
  });
});

describe("photoDerivativeHeight", () => {
  it("keeps the aspect ratio and never grows the source", () => {
    expect(photoDerivativeHeight({ height: 2000, width: 3000 }, 320)).toBe(213);
    expect(photoDerivativeHeight({ height: 750, width: 1000 }, 1000)).toBe(750);
    expect(photoDerivativeHeight({ height: 1, width: 4000 }, 320)).toBe(1);
  });
});

describe("photo keys", () => {
  it("names the original and its derivatives like the old pipeline", () => {
    expect(
      speciesPhotoKey({ ext: "jpg", id: "bufo-viridis", n: 2, slug: "ana" }),
    ).toBe("bufo-viridis-ana-2.jpg");
    expect(
      speciesPhotoKey({ ext: "png", id: "bufo-viridis", n: 1, slug: null }),
    ).toBe("bufo-viridis-1.png");
    expect(photoAssetPath("bufo-viridis-ana-2.jpg")).toBe("bufo-viridis-ana-2");
    expect(photoDerivativeKey("bufo-viridis-ana-2.jpg", 640, "avif")).toBe(
      "optimized/bufo-viridis-ana-2-640.avif",
    );
  });

  it("slugs the photographer's first name", () => {
    expect(photographerSlug("ანა მელიქიშვილი")).toBe("ana");
    expect(photographerSlug("  ")).toBeNull();
    expect(photographerSlug(undefined)).toBeNull();
  });
});

describe("optimizedPhotoFormats", () => {
  it("keeps formats whose widest copy beats the original", () => {
    expect(
      optimizedPhotoFormats(
        [
          { byteSize: 50, format: "avif", width: 320 },
          { byteSize: 400, format: "avif", width: 800 },
          { byteSize: 90, format: "webp", width: 320 },
          { byteSize: 1200, format: "webp", width: 800 },
        ],
        1000,
      ),
    ).toStrictEqual(["avif"]);
  });

  it("returns nothing without derivatives", () => {
    expect(optimizedPhotoFormats([], 1000)).toStrictEqual([]);
  });
});
