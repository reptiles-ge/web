import { describe, expect, it } from "vitest";

import { NO_CONTRIBUTORS } from "@/lib/contributorCredits";
import {
  speciesFallbackDescriptionKey,
  speciesImageAlt,
  speciesMetaDescription,
  speciesMetaDescriptionOverride,
  speciesPageMetaTitle,
  speciesPhotoAlt,
  speciesSummaryDescription,
  speciesTitleIntentKeys,
} from "@/lib/speciesMeta";

import { contributorDirectoryFixture } from "../../tests/fixtures/speciesCatalog";

describe("speciesTitleIntentKeys", () => {
  it.each([
    ["lizard", "titleLizard"],
    ["turtle", "titleTurtle"],
    ["bird", "titleBird"],
    ["insect", "titleInsect"],
    ["mammal", "titleMammal"],
    ["scorpion", "titleScorpion"],
    ["spider", "titleSpider"],
    ["amphibian", "titleAmphibian"],
  ] as const)("maps %s to %s and its question", (group, key) => {
    expect(speciesTitleIntentKeys(group)).toEqual({
      intent: key,
      question: `${key}Question`,
    });
  });

  it("separates venomous from harmless snakes", () => {
    expect(speciesTitleIntentKeys("snake", "High").intent).toBe(
      "titleSnakeVenomous",
    );
    expect(speciesTitleIntentKeys("snake", "Moderate").question).toBe(
      "titleSnakeVenomousQuestion",
    );
    expect(speciesTitleIntentKeys("snake", "Harmless").intent).toBe(
      "titleSnake",
    );
    expect(speciesTitleIntentKeys("snake").question).toBe("titleSnakeQuestion");
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
  const intents = {
    intent: "venomous or not? Photos, range",
    question: "venomous or not?",
    short: "in Georgia",
  };

  it("joins both names and the full intent when they fit", () => {
    expect(
      speciesPageMetaTitle("x", "en", "Grass snake", "Natrix natrix", intents),
    ).toBe("Grass snake (Natrix natrix) — venomous or not? Photos, range");
  });

  it("drops the scientific name before the details outside English", () => {
    expect(
      speciesPageMetaTitle(
        "x",
        "ru",
        "Обыкновенная медянка",
        "Coronella austriaca",
        {
          intent: "ядовитая змея или нет? Ареал в Грузии",
          question: "ядовитая змея или нет?",
          short: "в Грузии",
        },
      ),
    ).toBe("Обыкновенная медянка — ядовитая змея или нет? Ареал в Грузии");
  });

  it("keeps the scientific name in English and shortens the intent", () => {
    expect(
      speciesPageMetaTitle(
        "x",
        "en",
        "Smooth snake",
        "Coronella austriaca",
        intents,
      ),
    ).toBe("Smooth snake (Coronella austriaca) — venomous or not?");
    expect(
      speciesPageMetaTitle(
        "x",
        "ru",
        "Smooth snake",
        "Coronella austriaca",
        intents,
      ),
    ).toBe("Smooth snake — venomous or not? Photos, range");
  });

  it("keeps the scientific name in Georgian even when the question has to go", () => {
    expect(
      speciesPageMetaTitle("x", "ka", "ჩვეულებრივი ანკარა", "Natrix natrix", {
        intent: "შხამიანია თუ არა? ფოტო, გავრცელება",
        question: "შხამიანია თუ არა?",
        short: "საქართველოში",
      }),
    ).toBe("ჩვეულებრივი ანკარა (Natrix natrix) — შხამიანია თუ არა?");
    expect(
      speciesPageMetaTitle("x", "ka", "დინიკის გველგესლა", "Vipera dinniki", {
        intent: "რამდენად საშიშია ნაკბენი? ფოტო, გავრცელება",
        question: "რამდენად საშიშია ნაკბენი?",
        short: "საქართველოში",
      }),
    ).toBe("დინიკის გველგესლა (Vipera dinniki) საქართველოში");
  });

  it("falls back to the place when no question fits", () => {
    expect(
      speciesPageMetaTitle(
        "x",
        "en",
        "Transcaucasian Ratsnake",
        "Zamenis hohenackeri",
        intents,
      ),
    ).toBe("Transcaucasian Ratsnake (Zamenis hohenackeri) in Georgia");
  });

  it("asks the question with the common name alone when both names are too long", () => {
    expect(
      speciesPageMetaTitle(
        "x",
        "tr",
        "Kırmızı karınlı kırbaç yılanı",
        "Dolichophis schmidti",
        {
          intent: "zehirli mi? Fotoğraf, Gürcistan’da yayılış",
          question: "zehirli mi?",
          short: "Gürcistan’da",
        },
      ),
    ).toBe("Kırmızı karınlı kırbaç yılanı — zehirli mi?");
  });

  it("uses the scientific name when there is no common name", () => {
    expect(
      speciesPageMetaTitle("x", "ru", " ", "Cheiracanthium punctorium", {
        intent: "опасен ли укус? Фото, где встречается в Грузии",
        question: "опасен ли укус?",
        short: "в Грузии",
      }),
    ).toBe("Cheiracanthium punctorium — опасен ли укус?");
  });

  it("drops the intent when even the short title is too long", () => {
    const common = "ა".repeat(45);
    const scientific = "Longus nameus speciesus";
    expect(
      speciesPageMetaTitle("x", "ka", common, scientific, {
        intent: "შხამიანია თუ არა? ფოტო, გავრცელება",
        question: "შხამიანია თუ არა?",
        short: "საქართველოში",
      }),
    ).toBe(`${common} (${scientific})`);
  });

  it("uses a per-species override when one exists", () => {
    expect(
      speciesPageMetaTitle("alectoris-chukar", "en", "a", "b", intents),
    ).toBe("Chukar Partridge (Alectoris chukar) in Georgia | Range, ID");
  });

  it("falls back to the generated title for a locale without an override", () => {
    expect(
      speciesPageMetaTitle("araneus-diadematus", "ru", "Паук", "Araneus", {
        intent: "опасен ли укус? Фото, где встречается в Грузии",
        question: "опасен ли укус?",
        short: "в Грузии",
      }),
    ).toBe("Паук — опасен ли укус? Фото, где встречается в Грузии");
  });
});

describe("speciesSummaryDescription", () => {
  it("uses a curated summary that fits a meta description", () => {
    const summary = "a".repeat(120);
    expect(speciesSummaryDescription(` ${summary} `, "en")).toBe(summary);
  });

  it("skips summaries that are too short or too long", () => {
    expect(speciesSummaryDescription("a".repeat(69), "en")).toBeUndefined();
    expect(speciesSummaryDescription("a".repeat(156), "en")).toBeUndefined();
    expect(speciesSummaryDescription("ა".repeat(160), "ka")).toBe(
      "ა".repeat(160),
    );
    expect(speciesSummaryDescription("ა".repeat(161), "ka")).toBeUndefined();
  });
});

describe("speciesMetaDescription", () => {
  it("returns a short overview unchanged", () => {
    expect(
      speciesMetaDescription(
        { description: "", overview: "Short text." },
        "en",
      ),
    ).toBe("Short text.");
  });

  it("prefers a summary that fits", () => {
    const description = `Summary ${"a".repeat(80)}.`;
    expect(
      speciesMetaDescription({ description, overview: "Overview." }, "en"),
    ).toBe(description);
  });

  it("stops at a sentence end instead of cutting a sentence", () => {
    const overview = `First ${"a".repeat(90)}. Second ${"b".repeat(90)}.`;
    expect(speciesMetaDescription({ description: "", overview }, "en")).toBe(
      `First ${"a".repeat(90)}.`,
    );
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
      speciesPhotoAlt(
        "Viper",
        "Vipera x",
        {
          location: " Kakheti ",
          photographer: "Jane",
        },
        NO_CONTRIBUTORS,
      ),
    ).toBe("Viper (Vipera x) — Kakheti — Jane");
  });

  it("names no place when the photo credit has none", () => {
    expect(
      speciesPhotoAlt("Viper", "Vipera x", undefined, NO_CONTRIBUTORS),
    ).toBe("Viper (Vipera x)");
    expect(
      speciesPhotoAlt(
        "Viper",
        "Vipera x",
        { photographer: "Jane" },
        NO_CONTRIBUTORS,
      ),
    ).toBe("Viper (Vipera x) — Jane");
  });
});

describe("speciesPhotoAlt photographer names", () => {
  it("uses the credited author's name in the page locale", () => {
    expect(
      speciesPhotoAlt(
        "Mantis",
        "Mantis religiosa",
        {
          photographer: "ზაური ხაჩიძე",
        },
        contributorDirectoryFixture("en"),
      ),
    ).toBe("Mantis (Mantis religiosa) — Zauri Khachidze");
  });
});
