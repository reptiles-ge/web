import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { optimizedEntry } from "@/data/optimizedImages";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUBS } from "@/lib/groupHubs";

describe("group hub illustrations", () => {
  it("covers every hub", () => {
    expect(Object.keys(GROUP_HUB_ILLUSTRATIONS).sort()).toEqual(
      Object.keys(GROUP_HUBS).sort(),
    );

    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) {
      expect(src.startsWith("/images/home/groups/"), src).toBe(true);
    }
  });

  it("points at existing homepage cover files", () => {
    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) {
      const filePath = path.join(process.cwd(), "public", src);
      expect(fs.existsSync(filePath), src).toBe(true);
      expect(optimizedEntry(src), src).not.toBeNull();
    }
  });
});
