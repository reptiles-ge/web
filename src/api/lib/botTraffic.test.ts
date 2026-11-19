import { describe, expect, it } from "vitest";

import { isBotTraffic, isBotUserAgent, requestAsn } from "./botTraffic";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 15; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36";
const FIREFOX =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 15.6; rv:144.0) Gecko/20100101 Firefox/144.0";
const FACEBOOK_APP =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22G86 [FBAN/FBIOS;FBAV/530.0.0.40.94;FBBV/770000000;FBDV/iPhone16,2;FBMD/iPhone;FBSN/iOS;FBSV/18.6;FBSS/3;FBCR/;FBID/phone;FBLC/ka_GE;FBOP/5]";
const GOOGLE_APP =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/390.0.789012345 Mobile/15E148 Safari/604.1";
const FBANDROID =
  "Mozilla/5.0 (Linux; Android 14; SM-A546B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/530.0.0.48.74;IABMV/1;]";
const IGIOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 400.0.0.37.86 (iPhone15,3; iOS 18_6; ka_GE; ka; scale=3.00; 1290x2796; 780000000; IABMV/1)";
const IGANDROID =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 Instagram 400.0.0.37.86 Android (34/14; 480dpi; 1080x2340; samsung; SM-S918B; dm3q; qcom; ka_GE; 780000000; IABMV/1)";
const MESSENGER =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22G86 [FBAN/MessengerLiteForiOS;FBAV/480.0.0.40.110;FBBV/700000000;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/18.6;FBSS/3;FBCR/;FBID/phone;FBLC/en_US;FBOP/0]";
const THREADS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Barcelona 400.0.0.24.92 (iPhone15,3; iOS 18_6; en_US; en; scale=3.00; 1290x2796; 780000000)";
const TIKTOK =
  "Mozilla/5.0 (Linux; Android 14; SM-A546B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 musical_ly_2024100000 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/41.0.0 ByteLocale/ka ByteFullLocale/ka Region/GE BytedanceWebview/d8a21c6";
const LINKEDIN =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.31.1";
const XTWITTER =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Twitter for iPhone/11.0";
const TELEGRAMANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240805.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 Telegram-Android/11.2.3 (Google Pixel 8; Android 14; SDK 34; HIGH)";
const VIBER =
  "Mozilla/5.0 (Linux; Android 14; SM-A546B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 Viber/24.5.0.0";
const SLACKAPP =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Slack/4.46.99 Chrome/138.0 Electron/37.2.0 Safari/537.36 Sonic Slack_SSB/4.46.99";
const SAMSUNG =
  "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36";

describe("isBotUserAgent", () => {
  it.each([
    CHROME,
    IPHONE,
    ANDROID,
    FIREFOX,
    FACEBOOK_APP,
    GOOGLE_APP,
    FBANDROID,
    IGIOS,
    IGANDROID,
    MESSENGER,
    THREADS,
    TIKTOK,
    LINKEDIN,
    XTWITTER,
    TELEGRAMANDROID,
    VIBER,
    SLACKAPP,
    SAMSUNG,
  ])("lets a browser or in-app browser through: %s", (userAgent) => {
    expect(isBotUserAgent(userAgent)).toBe(false);
  });

  it.each([
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 (compatible; GoogleOther)",
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/142.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    "Mozilla/5.0 (compatible; AhrefsSiteAudit/6.1; +http://ahrefs.com/robot/site-audit)",
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
    "Screaming Frog SEO Spider/21.0",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)",
    "TelegramBot (like TwitterBot)",
    "curl/8.7.1",
    "python-requests/2.32.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 PTST/250101.000000",
    "",
    "   ",
    undefined,
  ])("blocks a robot: %s", (userAgent) => {
    expect(isBotUserAgent(userAgent)).toBe(true);
  });
});

describe("isBotTraffic", () => {
  it("lets a browser on a home or mobile network through", () => {
    expect(isBotTraffic({ asn: 35805, userAgent: CHROME })).toBe(false);
    expect(isBotTraffic({ asn: null, userAgent: IPHONE })).toBe(false);
  });

  it("blocks a browser user agent from a cloud or crawler network", () => {
    for (const asn of [15169, 16509, 8075, 24940, 14061, 32934, 396982]) {
      expect(isBotTraffic({ asn, userAgent: CHROME })).toBe(true);
    }
  });

  it("keeps Cloudflare WARP visitors", () => {
    expect(isBotTraffic({ asn: 13335, userAgent: CHROME })).toBe(false);
  });

  it("blocks a robot user agent on any network", () => {
    expect(isBotTraffic({ asn: 35805, userAgent: "Googlebot/2.1" })).toBe(true);
  });
});

describe("requestAsn", () => {
  function withCf(cf: unknown) {
    const request = new Request("https://api.reptiles.ge/v1/views");
    Object.defineProperty(request, "cf", { value: cf });
    return request;
  }

  it("reads the ASN Cloudflare attaches to the request", () => {
    expect(requestAsn(withCf({ asn: 15169 }))).toBe(15169);
  });

  it("answers null without a usable ASN", () => {
    expect(requestAsn(new Request("https://api.reptiles.ge/"))).toBeNull();
    expect(requestAsn(withCf(null))).toBeNull();
    expect(requestAsn(withCf({ asn: "15169" }))).toBeNull();
    expect(requestAsn(withCf({}))).toBeNull();
  });
});
