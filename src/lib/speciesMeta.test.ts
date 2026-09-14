import { describe, expect, it } from "vitest";

import {
  speciesMetaDescription,
  speciesPageMetaTitle,
} from "@/lib/speciesMeta";

describe("speciesPageMetaTitle", () => {
  it("uses KA and EN overrides when present", () => {
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "ka",
        "გიურზა",
        "Macrovipera lebetinus",
        "შხამი, არეალი და ამოცნობა",
      ),
    ).toBe(
      "გიურზა (Macrovipera lebetinus) | შხამიანი გველი საქართველოში — რისკი",
    );
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "en",
        "Levantine viper",
        "Macrovipera lebetinus",
        "venom, range, and identification",
      ),
    ).toBe(
      "Levantine viper (Macrovipera lebetinus) | High-risk venomous snake in Georgia",
    );
  });

  it("does not apply EN overrides to RU or TR", () => {
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "ru",
        "Гюрза",
        "Macrovipera lebetinus",
        "яд, ареал и определение",
      ),
    ).toBe("Гюрза (Macrovipera lebetinus) | яд, ареал и определение");
    expect(
      speciesPageMetaTitle(
        "macrovipera-lebetina",
        "tr",
        "Levant engereği",
        "Macrovipera lebetinus",
        "zehir, yayılış ve tanıma",
      ),
    ).toBe(
      "Levant engereği (Macrovipera lebetinus) | zehir, yayılış ve tanıma",
    );
  });
});

describe("speciesMetaDescription", () => {
  it("strips inline markdown links from the lead sentence", () => {
    expect(
      speciesMetaDescription(
        "The Levantine viper is a [venomous snake](/venomous-snakes) often confused with the [Montpellier snake](malpolon-insignitus). Keep distance.",
      ),
    ).toBe(
      "The Levantine viper is a venomous snake often confused with the Montpellier snake.",
    );
  });
});
