import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import {
  DANGER_LEVEL_HASH,
  DANGER_LEVEL_ORDER,
  dangerLevelTone,
  dangerPageHref,
  HARMLESS_EXAMPLE_IDS,
} from "@/lib/dangerLevels";

describe("dangerLevels", () => {
  it("orders levels from most to least dangerous", () => {
    expect(DANGER_LEVEL_ORDER).toEqual(["High", "Moderate", "Harmless"]);
  });

  it("has a hash for every level", () => {
    for (const level of DANGER_LEVEL_ORDER) {
      expect(DANGER_LEVEL_HASH[level]).toBe(level.toLowerCase());
    }
  });

  it("gives each level its own tone", () => {
    const tones = DANGER_LEVEL_ORDER.map((level) => dangerLevelTone(level));
    expect(new Set(tones.map((tone) => tone.chip)).size).toBe(3);
    expect(dangerLevelTone("High").value).toBe("text-destructive");
    expect(dangerLevelTone("Moderate").value).toBe("text-gold");
    expect(dangerLevelTone("Harmless").value).toBe("text-primary");
  });

  it("links to the risk page, with a hash when a level is given", () => {
    expect(dangerPageHref()).toEqual({ pathname: "/risk-to-humans" });
    expect(dangerPageHref("High")).toEqual({
      hash: "high",
      pathname: "/risk-to-humans",
    });
  });

  it("lists harmless example species that exist and are harmless", () => {
    for (const id of HARMLESS_EXAMPLE_IDS) {
      expect(getSpeciesById(id)?.danger, id).toBe("Harmless");
    }
  });
});
