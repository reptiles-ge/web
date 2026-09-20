import { describe, expect, it } from "vitest";

import { shortMetaDescription } from "@/lib/metaDescription";
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

  it("uses exact KA-only overrides", () => {
    expect(
      speciesPageMetaTitle(
        "dolichophis-schmidti",
        "ka",
        "წითელმუცელა მცურავი",
        "Dolichophis schmidti",
        "არეალი და ამოცნობა საქართველოში",
      ),
    ).toBe(
      "წითელმუცელა მცურავი (Dolichophis schmidti) — უშხამო გველი აღმოსავლეთ საქართველოში",
    );
  });

  it("keeps the KA length guard for non-exact overrides", () => {
    expect(
      speciesPageMetaTitle(
        "vipera-transcaucasiana",
        "ka",
        "ცხვირრქოსანი გველგესლა",
        "Vipera ammodytes",
        "შხამი, არეალი და ამოცნობა",
      ),
    ).toBe("ცხვირრქოსანი გველგესლა | შხამი, არეალი და ამოცნობა");
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
