import { describe, expect, it } from "vitest";

import { GROUP_HUBS } from "@/lib/groupHubs";
import { HERO_WALL_ROWS, heroWallSpeciesIds } from "@/lib/heroWall";

describe("heroWallSpeciesIds", () => {
  it("maps every hub on the wall to its hero species", () => {
    const hubs = new Set(HERO_WALL_ROWS.flatMap((row) => row.hubs));
    const ids = heroWallSpeciesIds();
    expect(Object.keys(ids).sort()).toEqual([...hubs].sort());
    for (const hub of hubs) {
      expect(ids[hub]).toBe(GROUP_HUBS[hub].heroSpeciesId);
    }
  });
});
