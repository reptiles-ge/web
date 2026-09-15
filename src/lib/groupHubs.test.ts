import { describe, expect, it } from "vitest";

import { optimizedEntry } from "@/data/optimizedImages";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUBS } from "@/lib/groupHubs";

describe("group hub illustrations", () => {
  it("covers every hub", () => {
    expect(Object.keys(GROUP_HUB_ILLUSTRATIONS).sort()).toEqual(
      Object.keys(GROUP_HUBS).sort(),
    );

    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) {
      expect(src.startsWith("https://cdn.reptiles.ge/"), src).toBe(true);
    }
  });

  it("has optimized derivatives for homepage cards", () => {
    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) {
      expect(optimizedEntry(src), src).not.toBeNull();
    }
  });
});
