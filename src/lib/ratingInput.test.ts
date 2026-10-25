import { describe, expect, it } from "vitest";

import { ratingInputSchema, ratingPageUrl } from "./ratingInput";

describe("ratingInputSchema", () => {
  it("accepts a 5-star rating without feedback", () => {
    expect(
      ratingInputSchema.parse({ locale: "ka", path: "/", rating: 5 }),
    ).toEqual({ feedback: null, locale: "ka", path: "/", rating: 5 });
  });

  it("requires cleaned feedback below 5 stars", () => {
    expect(
      ratingInputSchema.safeParse({ locale: "en", path: "/en", rating: 3 })
        .success,
    ).toBe(false);
    expect(
      ratingInputSchema.parse({
        feedback: " ok text ",
        locale: "en",
        path: "/en",
        rating: 3,
      }).feedback,
    ).toBe("ok text");
  });

  it("rejects bad paths, locales and ratings", () => {
    for (const value of [
      { locale: "ka", path: "//x", rating: 5 },
      { locale: "ka", path: "/\\example.test/x", rating: 5 },
      { locale: "ka", path: "/gvelebi\\x", rating: 5 },
      { locale: "ka", path: "no-slash", rating: 5 },
      { locale: "de", path: "/", rating: 5 },
      { locale: "ka", path: "/", rating: 0 },
    ]) {
      expect(ratingInputSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe("ratingPageUrl", () => {
  it("resolves a site path against the origin", () => {
    expect(ratingPageUrl("/gvelebi/giurza", "https://reptiles.ge")).toBe(
      "https://reptiles.ge/gvelebi/giurza",
    );
  });

  it("refuses a path that resolves to another origin", () => {
    for (const path of ["/\\example.test/x", "//example.test/x"]) {
      expect(ratingPageUrl(path, "https://reptiles.ge")).toBeNull();
    }
  });
});
