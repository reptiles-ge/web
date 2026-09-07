import { describe, expect, it } from "vitest";

import {
  speciesShareStatusKind,
  speciesShareText,
  speciesShareVenomous,
} from "@/lib/speciesShareText";

describe("speciesShareStatusKind", () => {
  it("uses rear-fanged copy for the cat snake", () => {
    expect(speciesShareStatusKind("telescopus-fallax", "snake", "Harmless")).toBe(
      "rearFanged",
    );
  });

  it("marks High and Moderate snakes as venomous", () => {
    expect(speciesShareStatusKind("macrovipera-lebetina", "snake", "High")).toBe(
      "venomous",
    );
    expect(
      speciesShareStatusKind("malpolon-insignitus", "snake", "Moderate"),
    ).toBe("venomous");
  });

  it("marks Harmless herpetofauna as non-venomous", () => {
    expect(speciesShareStatusKind("natrix-tessellata", "snake", "Harmless")).toBe(
      "harmless",
    );
    expect(
      speciesShareStatusKind("paralaudakia-caucasia", "lizard", "Harmless"),
    ).toBe("harmless");
  });

  it("does not invent venom status for birds or missing danger", () => {
    expect(speciesShareStatusKind("accipiter-nisus", "bird", "Harmless")).toBeNull();
    expect(speciesShareStatusKind("natrix-tessellata", "snake")).toBeNull();
  });
});

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
        scientificName: "Macrovipera lebetinus",
        status: "შხამიანი სახეობაა.",
        url: "https://reptiles.ge/gvelebi/giurza",
      }),
    ).toBe(
      [
        "გიურზა (Macrovipera lebetinus) - შხამიანი სახეობაა.",
        "",
        "🔗 დეტალები: https://reptiles.ge/gvelebi/giurza",
      ].join("\n"),
    );
  });

  it("formats the cat snake with rear-fanged wording", () => {
    expect(
      speciesShareText({
        commonName: "კატისთვალა",
        detailsLabel: "დეტალები",
        scientificName: "Telescopus fallax",
        status:
          "შხამიანი სახეობაა, მაგრამ ეშვები ხახის სიღრმეშია — ადამიანამდე შხამი ჩვეულებრივ ვერ აღწევს.",
        url: "https://reptiles.ge/gvelebi/katistvala",
      }),
    ).toBe(
      [
        "კატისთვალა (Telescopus fallax) - შხამიანი სახეობაა, მაგრამ ეშვები ხახის სიღრმეშია — ადამიანამდე შხამი ჩვეულებრივ ვერ აღწევს.",
        "",
        "🔗 დეტალები: https://reptiles.ge/gvelebi/katistvala",
      ].join("\n"),
    );
  });

  it("formats a non-venomous species card", () => {
    expect(
      speciesShareText({
        commonName: "წყლის გველი",
        detailsLabel: "დეტალები",
        scientificName: "Natrix tessellata",
        status: "უშხამო სახეობაა.",
        url: "https://reptiles.ge/gvelebi/wyis-gveli",
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
        scientificName: "Accipiter nisus",
        url: "https://reptiles.ge/prinvelebi/chveulebrivi-kakacha",
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
