import { describe, expect, it } from "vitest";

import { photoCreditSourceLabel } from "@/lib/photoCreditSource";

describe("photoCreditSourceLabel", () => {
  it("names Wikimedia Commons, Facebook, and iNaturalist", () => {
    expect(
      photoCreditSourceLabel(
        "https://commons.wikimedia.org/wiki/File:ArgiopeBruennichiMating.JPG",
      ),
    ).toBe("Wikimedia Commons");
    expect(
      photoCreditSourceLabel("https://www.facebook.com/profile.php?id=1"),
    ).toBe("Facebook");
    expect(
      photoCreditSourceLabel("https://m.facebook.com/profile.php?id=1"),
    ).toBe("Facebook");
    expect(
      photoCreditSourceLabel("https://www.inaturalist.org/photos/207089136"),
    ).toBe("iNaturalist");
  });

  it("falls back to the hostname for unknown sites", () => {
    expect(photoCreditSourceLabel("https://www.example.com/photo")).toBe(
      "example.com",
    );
  });

  it("ignores blank or non-http urls", () => {
    expect(photoCreditSourceLabel("")).toBeUndefined();
    expect(photoCreditSourceLabel("javascript:alert(1)")).toBeUndefined();
  });
});
