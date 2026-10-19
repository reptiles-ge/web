import { describe, expect, it } from "vitest";

import {
  checkNewsHero,
  checkNewsHeroes,
  NEWS_HERO_MAX_EXCEPTIONS,
  NEWS_HERO_RULE_SINCE,
  newsHeroProblem,
  newsHeroSize,
} from "@/lib/newsHeroImage";

const optimized = {
  "https://cdn.reptiles.ge/narrow.jpg": {
    formats: ["avif", "webp"],
    height: 683,
    path: "narrow",
    width: 1024,
    widths: [320, 400, 640, 800, 1024],
  },
  "https://cdn.reptiles.ge/wide.jpg": {
    formats: ["avif", "webp"],
    height: 2000,
    path: "wide",
    width: 3000,
    widths: [320, 400, 640, 800, 1200, 2400],
  },
} as const satisfies Parameters<typeof newsHeroSize>[1];

const wide = { src: "https://cdn.reptiles.ge/wide.jpg" };
const narrow = { src: "https://cdn.reptiles.ge/narrow.jpg" };
const fresh = { publishedAt: NEWS_HERO_RULE_SINCE, slug: "fresh" };
const older = { publishedAt: "2026-09-01T10:00:00+04:00", slug: "older" };
const reason = "Breaking story; wide photo requested";

describe("newsHeroSize", () => {
  it("uses the widest served derivative of an optimized image", () => {
    expect(newsHeroSize(wide, optimized)).toEqual({
      height: 1600,
      width: 2400,
    });
  });

  it("falls back to the frontmatter size", () => {
    expect(
      newsHeroSize({ height: 900, src: "/a.jpg", width: 1600 }, optimized),
    ).toEqual({ height: 900, width: 1600 });
  });

  it("is unknown without either", () => {
    expect(newsHeroSize({ src: "/a.jpg", width: 1600 }, optimized)).toBe(
      undefined,
    );
  });
});

describe("newsHeroProblem", () => {
  it("passes a wide landscape hero", () => {
    expect(newsHeroProblem(wide, optimized)).toBe(undefined);
  });

  it("names each failure", () => {
    expect(newsHeroProblem(undefined, optimized)).toMatch(/no hero image/);
    expect(newsHeroProblem({ src: "/a.jpg" }, optimized)).toMatch(/unknown/);
    expect(newsHeroProblem(narrow, optimized)).toBe(
      "hero is 1024×683, narrower than 1200 px",
    );
    expect(
      newsHeroProblem({ height: 2048, src: "/a.jpg", width: 2048 }, optimized),
    ).toBe("hero is 2048×2048, not landscape");
  });
});

describe("checkNewsHero", () => {
  it("accepts a good hero at any date", () => {
    expect(checkNewsHero({ ...fresh, image: wide }, optimized)).toEqual({});
    expect(checkNewsHero({ ...older, image: wide }, optimized)).toEqual({});
  });

  it("fails a new article and only warns for an older one", () => {
    expect(checkNewsHero({ ...fresh, image: narrow }, optimized).error).toMatch(
      /^fresh: hero is 1024×683.*heroImageException/,
    );
    expect(checkNewsHero({ ...older, image: narrow }, optimized)).toEqual({
      warning: "older: hero is 1024×683, narrower than 1200 px",
    });
  });

  it("turns an excepted failure into a warning with the reason", () => {
    expect(
      checkNewsHero({ ...fresh, exception: reason, image: narrow }, optimized),
    ).toEqual({
      warning: `fresh: heroImageException (${reason}): hero is 1024×683, narrower than 1200 px`,
    });
  });

  it("rejects an exception the hero no longer needs", () => {
    expect(
      checkNewsHero({ ...older, exception: reason, image: wide }, optimized)
        .error,
    ).toMatch(/remove it/);
  });
});

describe("checkNewsHeroes", () => {
  it("collects errors and warnings", () => {
    expect(
      checkNewsHeroes(
        [
          { ...fresh, image: narrow },
          { ...older, image: narrow },
          { ...fresh, image: wide, slug: "ok" },
        ],
        optimized,
      ),
    ).toEqual({
      errors: [expect.stringMatching(/^fresh:/)],
      warnings: [expect.stringMatching(/^older:/)],
    });
  });

  it("caps open exceptions", () => {
    const inputs = Array.from(
      { length: NEWS_HERO_MAX_EXCEPTIONS + 1 },
      (_, index) => ({
        ...fresh,
        exception: reason,
        image: narrow,
        slug: `a${index}`,
      }),
    );
    expect(
      checkNewsHeroes(inputs.slice(0, NEWS_HERO_MAX_EXCEPTIONS), optimized)
        .errors,
    ).toEqual([]);
    expect(checkNewsHeroes(inputs, optimized).errors).toEqual([
      expect.stringMatching(/^4 articles use heroImageException \(a0, a1/),
    ]);
  });
});
