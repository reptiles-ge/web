import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { getCatalogSpecies } from "@/data/species";
import { shortMetaDescription } from "@/lib/metaDescription";
import {
  SPECIES_META_DESCRIPTION_OVERRIDE,
  speciesMetaDescription,
  speciesMetaDescriptionOverride,
  speciesPageMetaTitle,
} from "@/lib/speciesMeta";

const descriptionOverrides = Object.entries(
  SPECIES_META_DESCRIPTION_OVERRIDE,
).flatMap(([speciesId, locales]) =>
  Object.entries(locales ?? {}).map(
    ([locale, text]) => [speciesId, locale as AppLocale, text] as const,
  ),
);

describe("speciesPageMetaTitle", () => {
  it("uses KA and EN overrides when present", () => {
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "ka",
        "გიურზა",
        "Macrovipera lebetinus",
        "შხამი, არეალი და ამოცნობა",
        "საქართველოში",
      ),
    ).toBe("გიურზა (Macrovipera lebetinus) — შხამიანი გველი საქართველოში");
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "en",
        "Levantine viper",
        "Macrovipera lebetinus",
        "venom, range, and identification",
        "in Georgia",
      ),
    ).toBe("Levantine viper (Macrovipera lebetinus) | Venomous snake");
  });

  it("uses KA-only overrides", () => {
    expect(
      speciesPageMetaTitle(
        "dolichophis-schmidti",
        "ka",
        "წითელმუცელა მცურავი",
        "Dolichophis schmidti",
        "არეალი და ამოცნობა საქართველოში",
        "საქართველოში",
      ),
    ).toBe("წითელმუცელა მცურავი (Dolichophis schmidti) — უშხამო გველი");
    expect(
      speciesPageMetaTitle(
        "vipera-transcaucasiana",
        "ka",
        "ცხვირრქოსანი გველგესლა",
        "Vipera ammodytes",
        "შხამი, არეალი და ამოცნობა",
        "საქართველოში",
      ),
    ).toBe("ცხვირრქოსანი გველგესლა (Vipera ammodytes) — შხამიანი გველი");
  });

  it("does not apply EN overrides to RU or TR", () => {
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "ru",
        "Гюрза",
        "Macrovipera lebetinus",
        "яд, ареал и определение",
        "в Грузии",
      ),
    ).toBe("Гюрза (Macrovipera lebetinus) | яд, ареал и определение");
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "tr",
        "Levant engereği",
        "Macrovipera lebetinus",
        "zehir, yayılış ve tanıma",
        "Gürcistan’da",
      ),
    ).toBe("Levant engereği (Macrovipera lebetinus) Gürcistan’da");
  });
});

describe("speciesMetaDescription", () => {
  it("strips inline markdown links without dropping fitting text", () => {
    expect(
      speciesMetaDescription(
        "The Levantine viper is a [venomous snake](/venomous-snakes) often confused with the [Montpellier snake](malpolon-insignitus). Keep distance.",
      ),
    ).toBe(
      "The Levantine viper is a venomous snake often confused with the Montpellier snake. Keep distance.",
    );
  });

  it("clips long descriptions to the search snippet limit", () => {
    const description = speciesMetaDescription(
      "This deliberately long overview keeps going past the normal search snippet boundary so metadata does not exceed the limit used by the SEO crawl report in production.",
      90,
    );

    expect(description.length).toBeLessThanOrEqual(90);
    expect(description.endsWith("…")).toBe(true);
  });
});

describe("shortMetaDescription", () => {
  it("keeps the full description when it fits", () => {
    const text = "First sentence. Second sentence.";

    expect(shortMetaDescription(text)).toBe(text);
  });

  it("clips only when the description exceeds the limit", () => {
    const text = "A ".repeat(100);

    expect(shortMetaDescription(text).length).toBeLessThanOrEqual(160);
  });
});

describe("SPECIES_META_DESCRIPTION_OVERRIDE", () => {
  it("targets catalog species only", () => {
    const ids = new Set(getCatalogSpecies().map((species) => species.id));
    for (const speciesId of Object.keys(SPECIES_META_DESCRIPTION_OVERRIDE)) {
      expect(ids.has(speciesId), speciesId).toBe(true);
    }
  });

  it("fits the snippet limit so no override is clipped", () => {
    for (const [speciesId, locale, text] of descriptionOverrides) {
      const label = `${speciesId} ${locale}`;
      expect(text, label).toBe(text.trim());
      expect(text.length, label).toBeGreaterThanOrEqual(70);
      expect(text.length, label).toBeLessThanOrEqual(160);
      expect(speciesMetaDescriptionOverride(speciesId, locale), label).toBe(
        text,
      );
    }
  });

  it("never repeats a description", () => {
    const texts = descriptionOverrides.map(([, , text]) => text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it.each([
    ["latrodectus-tredecimguttatus", "ru", "Каракурт"],
    ["macrovipera-lebetina", "ru", "Гюрза"],
    ["macrovipera-lebetina", "en", "Levantine viper"],
    ["natrix-tessellata", "en", "Dice snake"],
    ["natrix-tessellata", "ru", "Водяной уж"],
    ["lycosa-singoriensis", "ru", "Южнорусский тарантул"],
    ["capreolus-capreolus", "ru", "Косуля"],
    ["coronella-austriaca", "ru", "Обыкновенная медянка"],
    ["cheiracanthium-punctorium", "en", "Cheiracanthium punctorium"],
    ["araneus-diadematus", "en", "Araneus diadematus"],
  ] as const)("leads %s (%s) with the searched name %s", (id, locale, name) => {
    expect(
      SPECIES_META_DESCRIPTION_OVERRIDE[id]?.[locale]?.startsWith(name),
    ).toBe(true);
  });
});
