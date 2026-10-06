import { describe, expect, it } from "vitest";

import { formatRatingNotification } from "@/lib/ratingNotification";

const base = {
  acceptLanguage: null,
  country: null,
  host: "reptiles.ge",
  locale: "ka",
  pages: undefined,
  path: "/gvelebi/giurza",
  rating: 4,
  referrer: undefined,
  seconds: undefined,
  userAgent: null,
} as const;

const lines = (overrides: Partial<Record<keyof typeof base, unknown>>) =>
  formatRatingNotification({ ...base, ...overrides } as Parameters<
    typeof formatRatingNotification
  >[0]).split("\n");

describe("formatRatingNotification", () => {
  it("keeps only the rating, page and locale without visit details", () => {
    expect(lines({})).toEqual([
      "★★★★☆ 4/5",
      "https://reptiles.ge/gvelebi/giurza",
      "🌐 ka",
    ]);
  });

  it.each([
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "📱 iPhone · Safari",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 [FBAN/FBIOS;FBAV/470.0.0.31.105]",
      "📱 iPhone · Facebook app",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
      "📱 Android · Samsung Internet",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
      "📱 Windows · Edge",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:127.0) Gecko/20100101 Firefox/127.0",
      "📱 macOS · Firefox",
    ],
  ])("names the device and browser of %s", (userAgent, expected) => {
    expect(lines({ userAgent })).toContain(expected);
  });

  it("shows the browser language only when it differs from the page", () => {
    expect(lines({ acceptLanguage: "ka-GE,ka;q=0.9" })).toContain("🌐 ka");
    expect(lines({ acceptLanguage: "ru-RU,ru;q=0.9" })).toContain(
      "🌐 ka · browser ru-RU",
    );
  });

  it("shows the country with its flag", () => {
    expect(lines({ country: "TR" })).toContain("📍 🇹🇷 Türkiye");
    expect(lines({ country: "T1" })).toHaveLength(3);
  });

  it.each([
    [45, 1, "⏱ 45 s on site · 1 page"],
    [60, 2, "⏱ 1 min on site · 2 pages"],
    [3725, 14, "⏱ 62 min 5 s on site · 14 pages"],
    [0, 4, "⏱ 4 pages"],
    [90, 0, "⏱ 1 min 30 s on site"],
  ])("describes %i seconds and %i pages", (seconds, pages, expected) => {
    expect(lines({ pages, seconds })).toContain(expected);
  });

  it("leaves out a referrer that is the site itself or not a host", () => {
    expect(lines({ referrer: "l.facebook.com" })).toContain("↩ l.facebook.com");
    expect(lines({ referrer: "reptiles.ge" })).toHaveLength(3);
    expect(lines({ referrer: "evil.example/path" })).toHaveLength(3);
    expect(lines({ referrer: `${"a".repeat(120)}.com` })).toHaveLength(3);
  });
});
