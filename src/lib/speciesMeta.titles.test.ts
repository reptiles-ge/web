import { describe, expect, it } from "vitest";

import {
  speciesFallbackDescriptionKey,
  speciesImageAlt,
  speciesMetaDescription,
  speciesMetaDescriptionOverride,
  speciesPageMetaTitle,
  speciesPhotoAlt,
  speciesTitleIntentKey,
} from "@/lib/speciesMeta";

describe("speciesTitleIntentKey", () => {
  it.each([
    ["lizard", undefined, "titleLizard"],
    ["turtle", undefined, "titleTurtle"],
    ["bird", undefined, "titleBird"],
    ["insect", undefined, "titleInsect"],
    ["mammal", undefined, "titleMammal"],
    ["scorpion", undefined, "titleScorpion"],
    ["spider", undefined, "titleSpider"],
    ["amphibian", undefined, "titleAmphibian"],
  ] as const)("maps %s to %s", (group, danger, key) => {
    expect(speciesTitleIntentKey(group, danger)).toBe(key);
  });

  it("separates venomous from harmless snakes", () => {
    expect(speciesTitleIntentKey("snake", "High")).toBe("titleSnakeVenomous");
    expect(speciesTitleIntentKey("snake", "Moderate")).toBe(
      "titleSnakeVenomous",
    );
    expect(speciesTitleIntentKey("snake", "Harmless")).toBe("titleSnake");
    expect(speciesTitleIntentKey("snake")).toBe("titleSnake");
  });
});

describe("speciesFallbackDescriptionKey", () => {
  it("uses the venomous description only for venomous snakes", () => {
    expect(speciesFallbackDescriptionKey("snake", "High")).toBe(
      "descriptionVenomous",
    );
    expect(speciesFallbackDescriptionKey("snake", "Harmless")).toBe(
      "descriptionReptile",
    );
  });

  it.each([
    ["amphibian", "descriptionAmphibian"],
    ["bird", "descriptionBird"],
    ["insect", "descriptionInsect"],
    ["mammal", "descriptionMammal"],
    ["scorpion", "descriptionScorpion"],
    ["spider", "descriptionSpider"],
    ["lizard", "descriptionReptile"],
    ["turtle", "descriptionReptile"],
  ] as const)("maps %s to %s", (group, key) => {
    expect(speciesFallbackDescriptionKey(group)).toBe(key);
  });
});

describe("speciesPageMetaTitle", () => {
  it("joins common name, scientific name and intent", () => {
    expect(
      speciesPageMetaTitle("x", "en", "Grass snake", "Natrix natrix", "ID"),
    ).toBe("Grass snake (Natrix natrix) | ID");
  });

  it("shortens a long Georgian title but not other locales", () => {
    const common = "ა".repeat(40);
    const scientific = "Longus nameus speciesus";
    const intent = "ამოცნობა და გავრცელება საქართველოში";
    expect(speciesPageMetaTitle("x", "ka", common, scientific, intent)).toBe(
      `${common} | ${intent}`,
    );
    expect(speciesPageMetaTitle("x", "en", common, scientific, intent)).toBe(
      `${common} (${scientific}) | ${intent}`,
    );
  });

  it("uses a per-species override when one exists", () => {
    expect(speciesPageMetaTitle("alectoris-chukar", "en", "a", "b", "c")).toBe(
      "Chukar Partridge (Alectoris chukar) in Georgia | Range and ID",
    );
  });

  it("falls back to the generated title for a locale without an override", () => {
    expect(
      speciesPageMetaTitle("araneus-diadematus", "ru", "Паук", "Araneus", "ID"),
    ).toBe("Паук (Araneus) | ID");
  });
});

describe("speciesMetaDescription", () => {
  it("returns short text unchanged", () => {
    expect(speciesMetaDescription("Short text.")).toBe("Short text.");
  });

  it("never exceeds the maximum length", () => {
    const long = "word ".repeat(100);
    expect(speciesMetaDescription(long, 120).length).toBeLessThanOrEqual(120);
  });
});

describe("speciesMetaDescriptionOverride", () => {
  it("is undefined when no override exists", () => {
    expect(speciesMetaDescriptionOverride("no-such-id", "en")).toBeUndefined();
  });
});

describe("alt text", () => {
  it("builds image alt from names and place", () => {
    expect(speciesImageAlt("Viper", "Vipera x", "Kakheti")).toBe(
      "Viper (Vipera x) Kakheti",
    );
  });

  it("builds photo alt, preferring the credited place and adding the photographer", () => {
    expect(
      speciesPhotoAlt("Viper", "Vipera x", "Georgia", {
        location: " Kakheti ",
        photographer: "Jane",
      } as never),
    ).toBe("Viper (Vipera x) — Kakheti — Jane");
  });

  it("falls back to the default place and omits empty parts", () => {
    expect(speciesPhotoAlt("Viper", "Vipera x", "Georgia")).toBe(
      "Viper (Vipera x) — Georgia",
    );
    expect(speciesPhotoAlt("Viper", "Vipera x", "")).toBe("Viper (Vipera x)");
  });
});
