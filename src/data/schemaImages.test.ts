import { describe, expect, it } from "vitest";

import { uploadedSchemaImageCrops } from "@/data/optimizedImages.api.generated";
import {
  SCHEMA_IMAGE_MIN_WIDTH,
  SCHEMA_RATIOS,
  schemaImageCrops,
} from "@/data/schemaImages";
import { CDN_BASE } from "@/lib/site";

describe("news schema crops", () => {
  it("covers 16:9, 4:3 and 1:1 at the minimum width", () => {
    expect(
      SCHEMA_RATIOS.map((ratio) => [ratio.id, ratio.width / ratio.height]),
    ).toEqual([
      ["16x9", 16 / 9],
      ["4x3", 4 / 3],
      ["1x1", 1],
    ]);
    for (const ratio of SCHEMA_RATIOS) {
      expect(ratio.width).toBe(SCHEMA_IMAGE_MIN_WIDTH);
    }
  });

  it("has no crops for an unknown photo", () => {
    expect(schemaImageCrops("https://cdn.reptiles.ge/unknown.jpg")).toEqual([]);
  });

  it("stores every ratio on the CDN for each listed photo", () => {
    expect(Object.keys(uploadedSchemaImageCrops).length).toBeGreaterThan(0);
    for (const [src, crops] of Object.entries(uploadedSchemaImageCrops)) {
      expect(
        crops.map((crop) => crop.ratio),
        src,
      ).toEqual(SCHEMA_RATIOS.map((ratio) => ratio.id));
      for (const crop of crops) {
        expect(crop.url.startsWith(`${CDN_BASE}/schema/${crop.ratio}/`)).toBe(
          true,
        );
        expect(crop.width).toBeGreaterThanOrEqual(SCHEMA_IMAGE_MIN_WIDTH);
      }
      expect(schemaImageCrops(src)).toEqual(crops);
    }
  });
});
