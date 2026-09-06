import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { optimizedEntry } from "@/data/optimizedImages";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUBS } from "@/lib/groupHubs";

describe("group hub illustrations", () => {
  it("covers every hub with a local file", () => {
    expect(Object.keys(GROUP_HUB_ILLUSTRATIONS).sort()).toEqual(
      Object.keys(GROUP_HUBS).sort(),
    );

    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) {
      const filePath = path.join(process.cwd(), "public", src.slice(1));
      expect(fs.existsSync(filePath), src).toBe(true);
    }
  });

  it("has optimized derivatives for homepage cards", () => {
    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) {
      expect(optimizedEntry(src), src).not.toBeNull();
    }
  });
});
