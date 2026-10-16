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

  it("keeps Georgian when the country is unknown", () => {
    expect(
      suggestLocale({ country: null, current: "ka", languages: ["en-US"] }),
    ).toBeNull();
    expect(
      suggestLocale({ country: null, current: "ka", languages: ["ru-RU"] }),
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
  const crawlers = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.175 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)",
    "Mozilla/5.0 (compatible; GoogleOther)",
    "Mediapartners-Google",
    "FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)",
    "AdsBot-Google (+http://www.google.com/adsbot.html)",
    "Mozilla/5.0 (compatible; Google-Extended)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "Mozilla/5.0 (compatible; YandexRenderResourcesBot/1.0)",
    "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
    "DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)",
    "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Twitterbot/1.0",
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
    "TelegramBot (like TwitterBot)",
    "WhatsApp/2.23.20.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 SkypeUriPreview Preview/0.5",
    "ia_archiver (+http://www.alexa.com/site/help/webmasters; crawler@alexa.com)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 PTST/240601.152609",
  ];

  const browsers = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 YaBrowser/24.6.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/111.0.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/322.0.648915268 Mobile/15E148 Safari/604.1",
  ];

  it.each(crawlers)("treats %s as a crawler", (userAgent) => {
    expect(isLikelyBot(userAgent, false)).toBe(true);
  });

  it.each(browsers)("treats %s as a reader", (userAgent) => {
    expect(isLikelyBot(userAgent, false)).toBe(false);
  });

  it("treats automated browsers as crawlers", () => {
    expect(isLikelyBot(browsers[0], true)).toBe(true);
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
