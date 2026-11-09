import { describe, expect, it } from "vitest";

import {
  classifyTrafficEntry,
  isSiteHost,
  TRAFFIC_SOURCE_IDS,
  trafficChannel,
} from "@/lib/trafficSource";

describe("classifyTrafficEntry", () => {
  it.each([
    ["google.com", "google"],
    ["google.com.ge", "google"],
    ["www.google.ge", "google"],
    ["com.google.android.googlequicksearchbox", "google"],
    ["gemini.google.com", "gemini"],
    ["mail.google.com", "gmail"],
    ["bing.com", "bing"],
    ["yandex.ru", "yandex"],
    ["duckduckgo.com", "duckduckgo"],
    ["l.facebook.com", "facebook"],
    ["m.facebook.com", "facebook"],
    ["l.instagram.com", "instagram"],
    ["t.co", "x"],
    ["chatgpt.com", "chatgpt"],
    ["perplexity.ai", "perplexity"],
    ["ka.wikipedia.org", "wikipedia"],
    ["example.org", "other"],
    ["notgoogle.com", "other"],
  ])("maps the referrer %s to %s", (referrer, source) => {
    expect(classifyTrafficEntry({ referrer })).toEqual({
      referrer: referrer.replace(/^www\./, ""),
      source,
    });
  });

  it("prefers a click id, then utm_source, then the referrer", () => {
    expect(
      classifyTrafficEntry({ clickId: "gclid", referrer: "google.com" }),
    ).toEqual({ referrer: "google.com", source: "google-ads" });
    expect(classifyTrafficEntry({ clickId: "fbclid" })).toEqual({
      referrer: "",
      source: "facebook",
    });
    expect(
      classifyTrafficEntry({
        referrer: "example.org",
        utmSource: "chatgpt.com",
      }),
    ).toEqual({ referrer: "example.org", source: "chatgpt" });
  });

  it("keeps an unknown utm_source as the referrer of other", () => {
    expect(classifyTrafficEntry({ utmSource: "newsletter" })).toEqual({
      referrer: "utm:newsletter",
      source: "other",
    });
    expect(
      classifyTrafficEntry({
        referrer: "example.org",
        utmSource: "newsletter",
      }),
    ).toEqual({ referrer: "example.org", source: "other" });
  });

  it("counts a visit without referrer or campaign as direct", () => {
    expect(classifyTrafficEntry({})).toEqual({
      referrer: "",
      source: "direct",
    });
  });
});

describe("trafficChannel", () => {
  it("gives every source a channel", () => {
    expect(trafficChannel("google")).toBe("search");
    expect(trafficChannel("facebook")).toBe("social");
    expect(trafficChannel("chatgpt")).toBe("ai");
    expect(trafficChannel("direct")).toBe("direct");
    expect(trafficChannel("removed-source")).toBe("referral");
    expect(new Set(TRAFFIC_SOURCE_IDS).size).toBe(TRAFFIC_SOURCE_IDS.length);
  });
});

describe("isSiteHost", () => {
  it("knows the site and its subdomains", () => {
    expect(isSiteHost("reptiles.ge")).toBe(true);
    expect(isSiteHost("www.reptiles.ge")).toBe(true);
    expect(isSiteHost("admin.reptiles.ge")).toBe(true);
    expect(isSiteHost("notreptiles.ge")).toBe(false);
  });
});
