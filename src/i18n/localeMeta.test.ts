import { describe, expect, it } from "vitest";

import {
  allRightsReservedLabel,
  atlasDatasetName,
  atlasVariableName,
  caucasusPlaceName,
  georgiaPlaceName,
  georgiaReptilesLabel,
  isPrefixedLocale,
  openGraphLocale,
  pickLocalized,
} from "@/i18n/localeMeta";

describe("isPrefixedLocale", () => {
  it.each(["en", "ru", "tr"])("accepts %s", (locale) => {
    expect(isPrefixedLocale(locale)).toBe(true);
  });

  it.each(["ka", "de", "", "EN"])("rejects %j", (locale) => {
    expect(isPrefixedLocale(locale)).toBe(false);
  });
});

describe("openGraphLocale", () => {
  it("maps each locale", () => {
    expect(openGraphLocale("ka")).toBe("ka_GE");
    expect(openGraphLocale("en")).toBe("en_US");
    expect(openGraphLocale("ru")).toBe("ru_RU");
    expect(openGraphLocale("tr")).toBe("tr_TR");
  });

  it("falls back to Georgian for an unknown locale", () => {
    expect(openGraphLocale("de")).toBe("ka_GE");
  });
});

describe("place names", () => {
  it("returns the Georgia name per locale, defaulting to Georgian", () => {
    expect(georgiaPlaceName("en")).toBe("Georgia");
    expect(georgiaPlaceName("ru")).toBe("Грузия");
    expect(georgiaPlaceName("de")).toBe("საქართველო");
  });

  it("returns the Caucasus name per locale, defaulting to Georgian", () => {
    expect(caucasusPlaceName("tr")).toBe("Kafkasya");
    expect(caucasusPlaceName("de")).toBe("კავკასია");
  });
});

describe("pickLocalized", () => {
  const text = { en: "E", ka: "K", ru: "R", tr: "T" };

  it("picks the requested locale", () => {
    expect(pickLocalized(text, "ka")).toBe("K");
    expect(pickLocalized(text, "ru")).toBe("R");
    expect(pickLocalized(text, "tr")).toBe("T");
    expect(pickLocalized(text, "en")).toBe("E");
  });

  it("falls back to English when ru or tr is missing, or the locale is unknown", () => {
    expect(pickLocalized({ en: "E", ka: "K" }, "ru")).toBe("E");
    expect(pickLocalized({ en: "E", ka: "K" }, "tr")).toBe("E");
    expect(pickLocalized(text, "de")).toBe("E");
  });
});

describe("localized labels", () => {
  it("covers every locale with a non-empty string", () => {
    for (const locale of ["ka", "en", "ru", "tr"]) {
      expect(allRightsReservedLabel(locale)).toBeTruthy();
      expect(atlasDatasetName(locale)).toBeTruthy();
      expect(georgiaReptilesLabel(locale)).toBeTruthy();
      for (const key of [
        "regions",
        "speciesProfiles",
        "venomousSpecies",
      ] as const) {
        expect(atlasVariableName(key, locale)).toBeTruthy();
      }
    }
  });

  it("returns English copy for English", () => {
    expect(allRightsReservedLabel("en")).toBe("All rights reserved");
    expect(atlasVariableName("regions", "en")).toBe("Regions");
  });
});
