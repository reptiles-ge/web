import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import {
  collectTurtleRegions,
  TURTLE_META,
  TURTLE_ORDER,
} from "@/lib/turtleIdentify";

describe("turtleIdentify", () => {
  it("has metadata for every turtle in the display order", () => {
    expect(Object.keys(TURTLE_META).sort()).toEqual([...TURTLE_ORDER].sort());
  });

  it("only marks Trachemys scripta as introduced", () => {
    const introduced = TURTLE_ORDER.filter(
      (id) => TURTLE_META[id].status === "introduced",
    );
    expect(introduced).toEqual(["trachemys-scripta"]);
  });

  it("collects each region once across turtles", () => {
    const turtles = TURTLE_ORDER.flatMap((id) => {
      const species = getSpeciesById(id);
      return species ? [species] : [];
    });
    const regions = collectTurtleRegions([...turtles, ...turtles]);
    const ids = regions.map((region) => region.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns nothing for no turtles", () => {
    expect(collectTurtleRegions([])).toEqual([]);
  });
});
