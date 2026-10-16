import { describe, expect, it } from "vitest";

import {
  browserLocales,
  isLikelyBot,
  LANGUAGE_SUGGESTION_COPY,
  needsCountry,
  normalizeCountry,
  suggestLocale,
} from "@/lib/languageSuggestion";

describe("browserLocales", () => {
  it("keeps supported languages in order without duplicates", () => {
    expect(browserLocales(["ru-RU", "en-US", "ru", "de", "TR"])).toEqual([
      "ru",
      "en",
      "tr",
    ]);
  });

  it("returns nothing for unsupported languages", () => {
    expect(browserLocales(["de-DE", "hy"])).toEqual([]);
  });
});

describe("needsCountry", () => {
  it("skips the lookup when the page language is in the browser list", () => {
    expect(needsCountry("ka", ["en-US", "ka"])).toBe(false);
  });

  it("looks up the country on Georgian pages for other browser languages", () => {
    expect(needsCountry("ka", ["en-US"])).toBe(true);
  });

  it("looks up the country when no browser language is supported", () => {
    expect(needsCountry("en", ["de-DE"])).toBe(true);
  });

  it("skips the lookup on other pages when a browser language is supported", () => {
    expect(needsCountry("en", ["ru-RU"])).toBe(false);
  });
});

describe("suggestLocale", () => {
  it("suggests nothing when the reader already uses the page language", () => {
    expect(
      suggestLocale({ country: "RU", current: "ru", languages: ["ru-RU"] }),
    ).toBeNull();
    expect(
      suggestLocale({ country: null, current: "en", languages: ["de", "en"] }),
    ).toBeNull();
  });

  it("suggests the first supported browser language", () => {
    expect(
      suggestLocale({ country: "DE", current: "ka", languages: ["ru", "en"] }),
    ).toBe("ru");
    expect(
      suggestLocale({ country: null, current: "en", languages: ["tr-TR"] }),
    ).toBe("tr");
  });

  it("keeps Georgian for readers in Georgia", () => {
    expect(
      suggestLocale({ country: "GE", current: "ka", languages: ["en-US"] }),
    ).toBeNull();
    expect(
      suggestLocale({ country: "GE", current: "ka", languages: ["de"] }),
    ).toBeNull();
  });

  it("falls back to the country when no browser language is supported", () => {
    expect(
      suggestLocale({ country: "TR", current: "ka", languages: ["de"] }),
    ).toBe("tr");
    expect(
      suggestLocale({ country: "KZ", current: "ka", languages: ["kk"] }),
    ).toBe("ru");
    expect(
      suggestLocale({ country: "DE", current: "ka", languages: ["de"] }),
    ).toBe("en");
    expect(
      suggestLocale({ country: "DE", current: "en", languages: ["de"] }),
    ).toBeNull();
    expect(
      suggestLocale({ country: null, current: "ka", languages: ["de"] }),
    ).toBeNull();
  });
});

describe("normalizeCountry", () => {
  it("accepts two-letter codes and drops unknown ones", () => {
    expect(normalizeCountry("de")).toBe("DE");
    expect(normalizeCountry("XX")).toBeNull();
    expect(normalizeCountry("T1")).toBeNull();
    expect(normalizeCountry("Germany")).toBeNull();
    expect(normalizeCountry(null)).toBeNull();
  });
});

describe("isLikelyBot", () => {
  it("detects crawlers and automation", () => {
    expect(isLikelyBot("Mozilla/5.0 (compatible; Googlebot/2.1)", false)).toBe(
      true,
    );
    expect(isLikelyBot("Mozilla/5.0 (Macintosh)", true)).toBe(true);
    expect(isLikelyBot("Mozilla/5.0 (Macintosh) Safari/605.1.15", false)).toBe(
      false,
    );
  });
});

describe("LANGUAGE_SUGGESTION_COPY", () => {
  it("has copy for every locale", () => {
    for (const copy of Object.values(LANGUAGE_SUGGESTION_COPY)) {
      expect(copy.action && copy.close && copy.text).toBeTruthy();
    }
    expect(Object.keys(LANGUAGE_SUGGESTION_COPY).sort()).toEqual([
      "en",
      "ka",
      "ru",
      "tr",
    ]);
  });
});
