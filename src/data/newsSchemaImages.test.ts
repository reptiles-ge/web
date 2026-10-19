import { describe, expect, it } from "vitest";

import {
  NEWS_SCHEMA_IMAGE_MIN_WIDTH,
  NEWS_SCHEMA_RATIOS,
  newsSchemaCrops,
} from "@/data/newsSchemaImages";
import { CDN_BASE } from "@/lib/site";

import manifest from "./newsSchemaImages.json";

describe("news schema crops", () => {
  it("covers 16:9, 4:3 and 1:1 at the minimum width", () => {
    expect(
      NEWS_SCHEMA_RATIOS.map((ratio) => [ratio.id, ratio.width / ratio.height]),
    ).toEqual([
      ["16x9", 16 / 9],
      ["4x3", 4 / 3],
      ["1x1", 1],
    ]);
    for (const ratio of NEWS_SCHEMA_RATIOS) {
      expect(ratio.width).toBe(NEWS_SCHEMA_IMAGE_MIN_WIDTH);
    }
  });

  it("has no crops for an unknown photo", () => {
    expect(newsSchemaCrops("https://cdn.reptiles.ge/unknown.jpg")).toEqual([]);
  });

  it("stores every ratio on the CDN for each listed photo", () => {
    const entries: Record<
      string,
      ReturnType<typeof newsSchemaCrops>
    > = manifest.entries;
    for (const [src, crops] of Object.entries(entries)) {
      expect(
        crops.map((crop) => crop.ratio),
        src,
      ).toEqual(NEWS_SCHEMA_RATIOS.map((ratio) => ratio.id));
      for (const crop of crops) {
        expect(crop.url.startsWith(`${CDN_BASE}/schema/${crop.ratio}/`)).toBe(
          true,
        );
        expect(crop.width).toBeGreaterThanOrEqual(NEWS_SCHEMA_IMAGE_MIN_WIDTH);
      }
      expect(newsSchemaCrops(src)).toEqual(crops);
    }
  });
});
