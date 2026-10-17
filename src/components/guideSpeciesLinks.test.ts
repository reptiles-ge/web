import { describe, expect, it } from "vitest";

import { guideSpeciesLinks } from "@/components/guideSpeciesLinks";

describe("guideSpeciesLinks", () => {
  it("maps each extra link to an id, href and translated label", () => {
    expect(
      guideSpeciesLinks(
        [
          { href: "/snakes", key: "linkHub" },
          { href: "/species", key: "linkAtlas" },
        ],
        (key) => `label:${key}`,
      ),
    ).toEqual([
      { href: "/snakes", id: "linkHub", label: "label:linkHub" },
      { href: "/species", id: "linkAtlas", label: "label:linkAtlas" },
    ]);
  });
});
