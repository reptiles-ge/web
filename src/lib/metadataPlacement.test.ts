import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";
import { shouldServeStreamingMetadata } from "../../node_modules/vinext/dist/server/streaming-metadata.js";
import {
  BLOCKING_METADATA_USER_AGENTS,
  metadataPlacementProblems,
} from "./metadataPlacement";

const METADATA = [
  "<title>გიურზა — შხამიანი გველი საქართველოში</title>",
  '<meta name="description" content="გიურზა საქართველოში"/>',
  '<meta name="robots" content="follow, index, max-image-preview:large"/>',
  '<meta property="og:title" content="გიურზა"/>',
  '<meta property="og:image" content="https://cdn.reptiles.ge/og/giurza.jpg"/>',
  '<meta name="twitter:card" content="summary_large_image"/>',
  '<link rel="canonical" href="https://reptiles.ge/gvelebi/giurza"/>',
  '<link rel="alternate" hrefLang="x-default" href="https://reptiles.ge/gvelebi/giurza"/>',
  '<link rel="alternate" hrefLang="en" href="https://reptiles.ge/en/snakes/macrovipera-lebetina"/>',
].join("");

const SHELL_HEAD =
  '<!DOCTYPE html><html lang="ka"><head><meta charSet="utf-8"/>';

const HEAD_PLACED = `${SHELL_HEAD}${METADATA}</head><body><main><h1>გიურზა</h1></main></body></html>`;

const BODY_STREAMED = `${SHELL_HEAD}</head><body><main><h1>გიურზა</h1></main><footer></footer><div hidden=""><!--$?--><template id="B:0"></template><!--/$--></div><div hidden id="S:0"><div hidden="">${METADATA}</div></div></body></html>`;

const USER_AGENTS = {
  bingbot:
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  cacheWarmer: "reptiles-cache-warmer",
  chrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  empty: "",
  facebook: "facebookexternalhit/1.1",
  googlebot:
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  googlebotSmartphone:
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  gptbot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  vinextWarmup: "vinext-cloudflare-cdn-warm",
};

describe("metadataPlacementProblems", () => {
  it("accepts metadata rendered inside the head", () => {
    expect(metadataPlacementProblems(HEAD_PLACED)).toEqual([]);
  });

  it("flags metadata streamed into a hidden body boundary", () => {
    const problems = metadataPlacementProblems(BODY_STREAMED);

    expect(problems).toContainEqual({
      issue: "missing-from-head",
      tag: "title",
    });
    expect(problems).toContainEqual({
      issue: "missing-from-head",
      tag: "canonical",
    });
    expect(problems).toContainEqual({ issue: "in-body", tag: "canonical" });
    expect(problems).toContainEqual({ issue: "in-body", tag: "hreflang" });
    expect(problems).toContainEqual({ issue: "in-body", tag: "robots" });
  });

  it("flags a single tag that leaks into the body", () => {
    const leak = HEAD_PLACED.replace(
      "</main>",
      '</main><link rel="alternate" hrefLang="ru" href="https://reptiles.ge/ru"/>',
    );

    expect(metadataPlacementProblems(leak)).toEqual([
      { issue: "in-body", tag: "hreflang" },
    ]);
  });

  it("ignores svg titles in the body", () => {
    const icon = HEAD_PLACED.replace(
      "</main>",
      "<svg><title>რუკა</title></svg></main>",
    );

    expect(metadataPlacementProblems(icon)).toEqual([]);
  });
});

describe("blocking metadata user agents", () => {
  it("is the htmlLimitedBots value in next.config", () => {
    expect(nextConfig.htmlLimitedBots).toBe(BLOCKING_METADATA_USER_AGENTS);
  });

  it.each(Object.entries(USER_AGENTS))(
    "renders head metadata for the %s user agent",
    (_name, userAgent) => {
      expect(
        shouldServeStreamingMetadata(
          userAgent,
          BLOCKING_METADATA_USER_AGENTS.source,
        ),
      ).toBe(false);
    },
  );
});
