import { describe, expect, it } from "vitest";

import { adminCoverRoles, resolveAdminCovers } from "@/lib/adminCover";
import {
  coverCropSuffix,
  isCoverCrop,
  isFullCoverCrop,
  matchesCoverSource,
  normalizeCoverCropRect,
  parseCoverCrop,
} from "@/lib/coverCrop";

const original = "https://cdn.reptiles.ge/natrix-natrix-nika-1.jpg";
const rect = { height: 1, width: 0.6, x: 0.25, y: 0 };
const crop = `https://cdn.reptiles.ge/natrix-natrix-nika-1${coverCropSuffix(rect)}.jpg`;

describe("coverCrop", () => {
  it("round-trips the crop rectangle through the file name", () => {
    expect(crop).toBe(
      "https://cdn.reptiles.ge/natrix-natrix-nika-1-crop-250-0-600-1000.jpg",
    );
    expect(parseCoverCrop(crop)).toEqual({
      rect,
      stem: "https://cdn.reptiles.ge/natrix-natrix-nika-1",
    });
    expect(isCoverCrop(crop)).toBe(true);
    expect(isCoverCrop(original)).toBe(false);
  });

  it("matches a crop to its original regardless of extension", () => {
    expect(matchesCoverSource(crop, original)).toBe(true);
    expect(matchesCoverSource(original, original)).toBe(true);
    expect(matchesCoverSource(crop, original.replace(/\.jpg$/, ".webp"))).toBe(
      true,
    );
    expect(
      matchesCoverSource(crop, "https://cdn.reptiles.ge/natrix-natrix-2.jpg"),
    ).toBe(false);
    expect(matchesCoverSource("", original)).toBe(false);
  });

  it("clamps the rectangle inside the photo and rejects tiny crops", () => {
    expect(
      normalizeCoverCropRect({ height: 0.5, width: 0.5, x: 0.8, y: -0.2 }),
    ).toEqual({ height: 0.5, width: 0.5, x: 0.5, y: 0 });
    expect(
      normalizeCoverCropRect({ height: 0.05, width: 0.5, x: 0, y: 0 }),
    ).toBeNull();
    expect(
      normalizeCoverCropRect({ height: Number.NaN, width: 0.5, x: 0, y: 0 }),
    ).toBeNull();
    expect(isFullCoverCrop({ height: 1, width: 0.9999, x: 0, y: 0 })).toBe(
      true,
    );
    expect(isFullCoverCrop(rect)).toBe(false);
  });

  it("keeps the cover badges on the gallery original", () => {
    const covers = resolveAdminCovers(original, crop);
    expect(covers.split).toBe(true);
    expect(adminCoverRoles(original, covers)).toEqual(["desktop", "mobile"]);
  });
});
