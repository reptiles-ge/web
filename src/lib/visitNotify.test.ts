import { describe, expect, it } from "vitest";

import {
  createVisitLimiter,
  formatVisitMessage,
  readVisitPath,
  sanitizeVisitPath,
  sanitizeVisitReferrer,
  visitClientIp,
  visitDeviceLabel,
  visitGeo,
  visitOriginAllowed,
  visitPlaceLabel,
  visitReferrerSource,
} from "@/lib/visitNotify";
import { visitLocaleFromPath, visitPageLabel } from "@/lib/visitPageLabel";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

describe("sanitizeVisitPath", () => {
  it("accepts a public pathname", () => {
    expect(sanitizeVisitPath("/gvelebi/giurza")).toBe("/gvelebi/giurza");
  });

  it("rejects missing slash, schemes, and control characters", () => {
    expect(sanitizeVisitPath("gvelebi")).toBeNull();
    expect(sanitizeVisitPath("https://evil.example/")).toBeNull();
    expect(sanitizeVisitPath("/gvelebi\n/giurza")).toBeNull();
  });

  it("drops fbclid and other click ids", () => {
    expect(
      sanitizeVisitPath(
        "/amfibiebi/mtsvane-gombesho?fbclid=IwY2xjawUH_E1wZG9mAWV4dG4DYWVtAjExAHNydGMGYXBwX2lkDDM1MDY4NTUzMTcyOAABHhYVlNQvjW8VTIa5WjvdE24l9QY4kTZQ5aAfcFuoipUs-vLy3GdtCgz3hAis_aem_Xv7yattSoi9zPIgzSwL6Uw",
      ),
    ).toBe("/amfibiebi/mtsvane-gombesho?utm_source=facebook");
    expect(
      sanitizeVisitPath("/gvelebi/giurza?gclid=abc&utm_campaign=spring"),
    ).toBe("/gvelebi/giurza?utm_campaign=spring&utm_source=google");
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

describe("visitPageLabel", () => {
  it("resolves a KA species slug", () => {
    expect(visitPageLabel("/gvelebi/giurza")).toBe("გიურზა");
  });

  it("resolves an English species path to the KA name", () => {
    expect(visitPageLabel("/en/snakes/macrovipera-lebetina")).toBe("გიურზა");
  });

  it("resolves hubs and home", () => {
    expect(visitPageLabel("/gvelebi")).toBe("გველები");
    expect(visitPageLabel("/")).toBe("მთავარი");
  });

  it("prefers a static guide over a species slug", () => {
    expect(visitPageLabel("/gvelebi/saxeoebebi")).toBe("გველის სახეობები");
  });
});

describe("visitLocaleFromPath", () => {
  it("reads locale prefixes", () => {
    expect(visitLocaleFromPath("/gvelebi/giurza")).toBe("ka");
    expect(visitLocaleFromPath("/en/snakes")).toBe("en");
    expect(visitLocaleFromPath("/ru")).toBe("ru");
    expect(visitLocaleFromPath("/tr/lizards")).toBe("tr");
  });
});

describe("formatVisitMessage", () => {
  it("formats the compact visit card", () => {
    expect(
      formatVisitMessage({
        city: "Tbilisi",
        country: "GE",
        path: "/gvelebi/giurza",
        referrer: "https://www.google.com/search?q=gveli",
        userAgent: IPHONE_SAFARI,
      }),
    ).toBe(
      [
        "ახალი ვიზიტი · KA",
        "",
        "გვერდი: გიურზა",
        "URL: /gvelebi/giurza",
        "",
        "წყარო: Google",
        "ადგილი: საქართველო, თბილისი",
        "მოწყობილობა: iPhone · Safari",
      ].join("\n"),
    );
  });

  it("omits missing optional lines", () => {
    expect(formatVisitMessage({ path: "/gvelebi" })).toBe(
      ["ახალი ვიზიტი · KA", "", "გვერდი: გველები", "URL: /gvelebi"].join("\n"),
    );
  });

  it("marks an English landing", () => {
    expect(
      formatVisitMessage({ path: "/en/snakes/macrovipera-lebetina" }),
    ).toBe(
      [
        "ახალი ვიზიტი · EN",
        "",
        "გვერდი: გიურზა",
        "URL: /en/snakes/macrovipera-lebetina",
      ].join("\n"),
    );
  });

  it("does not show fbclid on the URL line", () => {
    expect(
      formatVisitMessage({
        path: "/amfibiebi/mtsvane-gombesho?fbclid=IwY2xjawUH_E1wZG9mAWV4dG4DYWVtAjExAHNydGMGYXBwX2lkDDM1MDY4NTUzMTcyOAABHhYVlNQvjW8VTIa5WjvdE24l9QY4kTZQ5aAfcFuoipUs-vLy3GdtCgz3hAis_aem_Xv7yattSoi9zPIgzSwL6Uw",
      }),
    ).toBe(
      [
        "ახალი ვიზიტი · KA",
        "",
        "გვერდი: მწვანე გომბეშო",
        "URL: /amfibiebi/mtsvane-gombesho",
        "",
        "წყარო: Facebook",
      ].join("\n"),
    );
  });
});

describe("visitReferrerSource", () => {
  it("names well-known hosts", () => {
    expect(visitReferrerSource("https://www.google.com/search?q=gveli")).toBe(
      "Google",
    );
    expect(visitReferrerSource("https://t.me/share")).toBe("Telegram");
    expect(visitReferrerSource("https://l.facebook.com/l.php")).toBe(
      "Facebook",
    );
  });

  it("falls back to utm_source", () => {
    expect(visitReferrerSource(undefined, "/?utm_source=instagram")).toBe(
      "Instagram",
    );
  });

  it("skips same-site referrers", () => {
    expect(visitReferrerSource("https://reptiles.ge/gvelebi")).toBeUndefined();
  });
});

describe("visitPlaceLabel", () => {
  it("uses Georgian names for Georgia", () => {
    expect(visitPlaceLabel("GE", "Tbilisi")).toBe("საქართველო, თბილისი");
    expect(visitPlaceLabel("GE", "Batumi")).toBe("საქართველო, ბათუმი");
  });

  it("keeps a country when the city is missing", () => {
    expect(visitPlaceLabel("DE")).toBe("გერმანია");
  });
});

describe("visitDeviceLabel", () => {
  it("reads iPhone Safari", () => {
    expect(visitDeviceLabel(IPHONE_SAFARI)).toBe("iPhone · Safari");
  });

  it("reads desktop Chrome before Safari", () => {
    expect(
      visitDeviceLabel(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      ),
    ).toBe("Windows · Chrome");
  });
});

describe("visitGeo", () => {
  it("reads Vercel geo headers", () => {
    const request = new Request("https://reptiles.ge/api/visit", {
      headers: {
        "x-vercel-ip-city": "Tbilisi",
        "x-vercel-ip-country": "GE",
      },
    });
    expect(visitGeo(request)).toEqual({ city: "Tbilisi", country: "GE" });
  });

  it("decodes a percent-encoded city", () => {
    const request = new Request("https://reptiles.ge/api/visit", {
      headers: {
        "x-vercel-ip-city": "New%20York",
        "x-vercel-ip-country": "US",
      },
    });
    expect(visitGeo(request)).toEqual({ city: "New York", country: "US" });
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
