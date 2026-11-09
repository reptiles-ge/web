import { describe, expect, it } from "vitest";

import { readTrafficEntry } from "@/lib/trafficEntry";

function read(referrer: string, search = "", siteHost = "reptiles.ge") {
  return readTrafficEntry({ referrer, search, siteHost });
}

describe("readTrafficEntry", () => {
  it("keeps only the referrer host", () => {
    expect(read("https://www.google.com/search?q=giurza")).toEqual({
      referrer: "google.com",
    });
    expect(read("android-app://com.google.android.gm/")).toEqual({
      referrer: "com.google.android.gm",
    });
  });

  it("reads utm_source and the first click id", () => {
    expect(read("", "?utm_source=Facebook%20Ads&fbclid=abc&gclid=def")).toEqual(
      { clickId: "gclid", utmSource: "facebook-ads" },
    );
  });

  it("is a direct visit without referrer or campaign", () => {
    expect(read("")).toEqual({});
    expect(read("not a url")).toEqual({});
  });

  it("is no entry when the visitor came from the site", () => {
    expect(read("https://reptiles.ge/gvelebi")).toBeUndefined();
    expect(read("https://www.reptiles.ge/", "?utm_source=x")).toBeUndefined();
    expect(read("http://localhost:3000/", "", "localhost")).toBeUndefined();
  });

  it("drops a utm_source it cannot keep", () => {
    expect(read("", "?utm_source=%E1%83%92%E1%83%95")).toEqual({});
  });
});
