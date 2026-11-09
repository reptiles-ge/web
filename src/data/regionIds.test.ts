import { describe, expect, it } from "vitest";

import { REGION_IDS } from "@/data/regionIds";
import { regions } from "@/data/regions";

describe("REGION_IDS", () => {
  it("lists every region page and nothing else", () => {
    expect([...REGION_IDS].sort()).toEqual(
      regions.map((region) => region.id).sort(),
    );
  });
});
