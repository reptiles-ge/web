import { describe, expect, it } from "vitest";

import { speciesPublicUrl } from "./speciesPublicUrl";

const GIURZA = {
  group: "snake",
  id: "macrovipera-lebetina",
  slugKa: "giurza",
} as const;

const YELLOWHAMMER = {
  group: "bird",
  id: "emberiza-citrinella",
  slugKa: "chveulebrivi-ghajga",
} as const;

describe("speciesPublicUrl", () => {
  it("builds the Georgian URL from the hub folder and the KA slug", () => {
    expect(speciesPublicUrl(GIURZA)).toBe("https://reptiles.ge/gvelebi/giurza");
    expect(speciesPublicUrl(YELLOWHAMMER, "ka")).toBe(
      "https://reptiles.ge/prinvelebi/chveulebrivi-ghajga",
    );
  });

  it("builds the English URL from the English hub and the species id", () => {
    expect(speciesPublicUrl(GIURZA, "en")).toBe(
      "https://reptiles.ge/en/snakes/macrovipera-lebetina",
    );
    expect(speciesPublicUrl(YELLOWHAMMER, "en")).toBe(
      "https://reptiles.ge/en/birds/emberiza-citrinella",
    );
  });

  it("uses the given site origin and falls back to the id without a KA slug", () => {
    expect(
      speciesPublicUrl(
        { group: "mammal", id: "vulpes-vulpes", slugKa: null },
        "ka",
        "http://localhost:3000",
      ),
    ).toBe("http://localhost:3000/dzuzumtsovrebi/vulpes-vulpes");
  });
});
