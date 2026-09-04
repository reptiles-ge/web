import { describe, expect, it } from "vitest";

import {
  createVisitLimiter,
  formatVisitMessage,
  readVisitPath,
  sanitizeVisitPath,
  sanitizeVisitReferrer,
  visitClientIp,
  visitOriginAllowed,
} from "@/lib/visitNotify";

describe("sanitizeVisitPath", () => {
  it("accepts a public pathname", () => {
    expect(sanitizeVisitPath("/gvelebi/giurza")).toBe("/gvelebi/giurza");
  });

  it("rejects missing slash, schemes, and control characters", () => {
    expect(sanitizeVisitPath("gvelebi")).toBeNull();
    expect(sanitizeVisitPath("https://evil.example/")).toBeNull();
    expect(sanitizeVisitPath("/gvelebi\n/giurza")).toBeNull();
  });
});

describe("sanitizeVisitReferrer", () => {
  it("keeps http(s) URLs", () => {
    expect(sanitizeVisitReferrer("https://www.google.com/search?q=gveli")).toBe(
      "https://www.google.com/search?q=gveli",
    );
  });

  it("drops javascript and empty values", () => {
    expect(sanitizeVisitReferrer("javascript:alert(1)")).toBeUndefined();
    expect(sanitizeVisitReferrer("")).toBeUndefined();
  });
});

describe("readVisitPath", () => {
  it("reads a sanitized body", () => {
    expect(
      readVisitPath({
        path: "/en/snakes",
        referrer: "https://t.co/abc",
      }),
    ).toEqual({
      path: "/en/snakes",
      referrer: "https://t.co/abc",
    });
  });

  it("returns null for invalid JSON shapes", () => {
    expect(readVisitPath(null)).toBeNull();
    expect(readVisitPath({ path: "../etc" })).toBeNull();
  });
});

describe("formatVisitMessage", () => {
  it("includes the landing page", () => {
    expect(formatVisitMessage({ path: "/gvelebi" })).toBe(
      "ახალი ვიზიტი\nგვერდი: /gvelebi",
    );
  });

  it("adds a referrer line when present", () => {
    expect(
      formatVisitMessage({
        path: "/",
        referrer: "https://example.com/",
      }),
    ).toBe("ახალი ვიზიტი\nგვერდი: /\nწყარო: https://example.com/");
  });
});

describe("createVisitLimiter", () => {
  it("allows one take per window", () => {
    const limiter = createVisitLimiter(1_000);
    expect(limiter.take("1.1.1.1", 10_000)).toBe(true);
    expect(limiter.take("1.1.1.1", 10_500)).toBe(false);
    expect(limiter.take("1.1.1.1", 11_000)).toBe(true);
    expect(limiter.take("8.8.8.8", 11_000)).toBe(true);
  });
});

describe("visitClientIp", () => {
  it("prefers the first forwarded address", () => {
    const request = new Request("https://reptiles.ge/api/visit", {
      headers: {
        "x-forwarded-for": " 203.0.113.9, 10.0.0.1",
        "x-real-ip": "10.0.0.2",
      },
    });
    expect(visitClientIp(request)).toBe("203.0.113.9");
  });
});

describe("visitOriginAllowed", () => {
  it("requires a matching origin or same-origin fetch", () => {
    const originUrl = new URL("https://reptiles.ge/api/visit");
    const ok = new Request("https://reptiles.ge/api/visit", {
      headers: { origin: "https://reptiles.ge" },
    });
    const sameOrigin = new Request("https://reptiles.ge/api/visit", {
      headers: { "sec-fetch-site": "same-origin" },
    });
    const bad = new Request("https://reptiles.ge/api/visit", {
      headers: { origin: "https://evil.example" },
    });
    const missing = new Request("https://reptiles.ge/api/visit");
    expect(visitOriginAllowed(ok, originUrl)).toBe(true);
    expect(visitOriginAllowed(sameOrigin, originUrl)).toBe(true);
    expect(visitOriginAllowed(bad, originUrl)).toBe(false);
    expect(visitOriginAllowed(missing, originUrl)).toBe(false);
  });
});
