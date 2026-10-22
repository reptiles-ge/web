import { describe, expect, it } from "vitest";

import { ratingInputSchema } from "./ratingInput";

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
      { locale: "ka", path: "no-slash", rating: 5 },
      { locale: "de", path: "/", rating: 5 },
      { locale: "ka", path: "/", rating: 0 },
    ]) {
      expect(ratingInputSchema.safeParse(value).success).toBe(false);
    }
  });
});
