import { describe, expect, it } from "vitest";

import {
  speciesShareText,
  speciesShareVenomous,
} from "@/lib/speciesShareText";

describe("speciesShareVenomous", () => {
  it("marks High and Moderate snakes as venomous", () => {
    expect(speciesShareVenomous("snake", "High")).toBe(true);
    expect(speciesShareVenomous("snake", "Moderate")).toBe(true);
  });

  it("marks Harmless herpetofauna as non-venomous", () => {
    expect(speciesShareVenomous("snake", "Harmless")).toBe(false);
    expect(speciesShareVenomous("lizard", "Harmless")).toBe(false);
  });

  it("does not invent venom status for birds or missing danger", () => {
    expect(speciesShareVenomous("bird", "Harmless")).toBeNull();
    expect(speciesShareVenomous("snake")).toBeNull();
  });
});

describe("speciesShareText", () => {
  it("formats a venomous species card", () => {
    expect(
      speciesShareText({
        commonName: "გიურზა",
        detailsLabel: "დეტალები",
        harmlessStatus: "უშხამო სახეობაა.",
        scientificName: "Macrovipera lebetinus",
        url: "https://reptiles.ge/gvelebi/giurza",
        venomous: true,
        venomousStatus: "შხამიანი სახეობაა.",
      }),
    ).toBe(
      [
        "გიურზა (Macrovipera lebetinus) - შხამიანი სახეობაა.",
        "",
        "🔗 დეტალები: https://reptiles.ge/gvelebi/giurza",
      ].join("\n"),
    );
  });

  it("formats a non-venomous species card", () => {
    expect(
      speciesShareText({
        commonName: "წყლის გველი",
        detailsLabel: "დეტალები",
        harmlessStatus: "უშხამო სახეობაა.",
        scientificName: "Natrix tessellata",
        url: "https://reptiles.ge/gvelebi/wyis-gveli",
        venomous: false,
        venomousStatus: "შხამიანი სახეობაა.",
      }),
    ).toBe(
      [
        "წყლის გველი (Natrix tessellata) - უშხამო სახეობაა.",
        "",
        "🔗 დეტალები: https://reptiles.ge/gvelebi/wyis-gveli",
      ].join("\n"),
    );
  });

  it("omits venom wording when status is unknown", () => {
    expect(
      speciesShareText({
        commonName: "ჩვეულებრივი კაკაჩა",
        detailsLabel: "დეტალები",
        harmlessStatus: "უშხამო სახეობაა.",
        scientificName: "Accipiter nisus",
        url: "https://reptiles.ge/prinvelebi/chveulebrivi-kakacha",
        venomous: null,
        venomousStatus: "შხამიანი სახეობაა.",
      }),
    ).toBe(
      [
        "ჩვეულებრივი კაკაჩა (Accipiter nisus)",
        "",
        "🔗 დეტალები: https://reptiles.ge/prinvelebi/chveulebrivi-kakacha",
      ].join("\n"),
    );
  });
});
