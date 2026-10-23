import { describe, expect, it } from "vitest";

import { getAtlasStats, summarizeAtlas } from "@/data/speciesAtlas";
import { GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
import { getNavbarData } from "@/lib/navbarData";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

describe("getNavbarData", () => {
  it("builds one optimized image per group hub and atlas stats", async () => {
    const data = getNavbarData(await getAtlasStats("en"));

    expect(Object.keys(data.images).sort()).toEqual(
      Object.keys(GROUP_HUB_ILLUSTRATIONS).sort(),
    );
    for (const image of Object.values(data.images)) {
      expect(image.src).toMatch(/^https?:\/\//);
      for (const source of image.sources) {
        expect(source.srcSet).toBeTruthy();
        expect(source.type).toMatch(/^image\//);
      }
    }
    expect(data.stats).toEqual(summarizeAtlas(await getSpeciesCatalog("en")));
  });
});
