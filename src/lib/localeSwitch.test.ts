import { describe, expect, it } from "vitest";

import {
  type LocaleSwitchIndex,
  resolvePageContextFromIndex,
  speciesHrefFromIndex,
} from "@/lib/localeSwitch";

const index: LocaleSwitchIndex = {
  groupById: { "natrix-natrix": "snake", "testudo-graeca": "turtle" },
  guides: {
    "/snakes/bite": { group: "snake", id: "snake-bite" },
  },
  hubById: { "natrix-natrix": "snakes", "testudo-graeca": "turtles" },
  idBySlug: {
    "natrix-natrix": "natrix-natrix",
    "testudo-graeca": "testudo-graeca",
    "xmelis-kua": "testudo-graeca",
  },
  kaSlugById: { "natrix-natrix": "ujo", "testudo-graeca": "xmelis-kua" },
  quizzes: [
    {
      group: "snake",
      id: "snake",
      slugs: {
        en: "which-snake",
        ka: "romeli-gvelia",
        ru: "kakaya-zmeya",
        tr: "hangi-yilan",
      },
    },
  ],
};

function resolve(
  pathname: string,
  params: { id?: string; slug?: string } = {},
  locale: "en" | "ka" = "en",
) {
  return resolvePageContextFromIndex(index, pathname, locale, params);
}

describe("resolvePageContextFromIndex", () => {
  it.each([
    ["/", "home"],
    ["/about", "about"],
    ["/authors", "author_index"],
    ["/contact", "contact"],
    ["/news", "news"],
    ["/species", "atlas"],
    ["/quiz", "quiz_index"],
    ["/regions", "region_index"],
  ])("maps %s to %s", (pathname, pageType) => {
    expect(resolve(pathname)).toEqual({ page_type: pageType });
  });

  it("maps entity pages with their id", () => {
    expect(resolve("/authors/[slug]", { slug: "jane" })).toEqual({
      entity_id: "jane",
      page_type: "author",
    });
    expect(resolve("/news/[slug]", { slug: "story" })).toEqual({
      entity_id: "story",
      page_type: "news_article",
    });
    expect(resolve("/regions/[id]", { id: "kakheti" })).toEqual({
      entity_id: "kakheti",
      page_type: "region",
    });
  });

  it("does not treat an entity path without a param as an entity page", () => {
    expect(resolve("/authors/[slug]").page_type).toBe("other");
  });

  it("resolves a quiz by its slug in the current locale", () => {
    expect(resolve("/quiz/[slug]", { slug: "which-snake" })).toEqual({
      entity_id: "snake",
      group: "snake",
      page_type: "quiz",
    });
    expect(
      resolve("/quiz/[slug]", { slug: "romeli-gvelia" }, "ka"),
    ).toMatchObject({ entity_id: "snake" });
  });

  it("still reports a quiz page for an unknown quiz slug", () => {
    expect(resolve("/quiz/[slug]", { slug: "nope" })).toEqual({
      entity_id: undefined,
      group: undefined,
      page_type: "quiz",
    });
  });

  it("resolves a species page through its slug", () => {
    expect(resolve("/snakes/[slug]", { slug: "natrix-natrix" })).toEqual({
      entity_id: "natrix-natrix",
      group: "snake",
      page_type: "species",
    });
    expect(resolve("/turtles/[slug]", { slug: "xmelis-kua" })).toMatchObject({
      entity_id: "testudo-graeca",
    });
  });

  it("reports other when the species belongs to a different hub", () => {
    expect(resolve("/snakes/[slug]", { slug: "xmelis-kua" })).toEqual({
      page_type: "other",
    });
    expect(resolve("/snakes/[slug]", { slug: "unknown" })).toEqual({
      page_type: "other",
    });
  });

  it("maps hub index pages", () => {
    expect(resolve("/snakes")).toEqual({
      entity_id: "snakes",
      group: "snake",
      page_type: "hub",
    });
    expect(resolve("/birds")).toMatchObject({ group: "bird" });
  });

  it("maps indexed guides and standalone snake guides", () => {
    expect(resolve("/snakes/bite")).toEqual({
      entity_id: "snake-bite",
      group: "snake",
      page_type: "guide",
    });
    expect(resolve("/venomous-snakes")).toEqual({
      entity_id: "venomous-snakes",
      group: "snake",
      page_type: "guide",
    });
  });

  it("falls back to other", () => {
    expect(resolve("/something-else")).toEqual({ page_type: "other" });
  });
});

describe("speciesHrefFromIndex", () => {
  it("uses the KA slug in Georgian and the id elsewhere", () => {
    expect(speciesHrefFromIndex(index, "natrix-natrix", "ka")).toEqual({
      params: { slug: "ujo" },
      pathname: "/snakes/[slug]",
    });
    expect(speciesHrefFromIndex(index, "natrix-natrix", "en")).toEqual({
      params: { slug: "natrix-natrix" },
      pathname: "/snakes/[slug]",
    });
  });

  it("falls back to the id when there is no KA slug", () => {
    expect(speciesHrefFromIndex(index, "unknown-id", "ka").params.slug).toBe(
      "unknown-id",
    );
  });
});
