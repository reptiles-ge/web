import { describe, expect, it } from "vitest";

import type { LocaleSwitchIndex } from "@/lib/localeSwitch";

import { pageViewPath } from "@/lib/pageViewTarget";

const switchIndex: LocaleSwitchIndex = {
  groupById: { "macrovipera-lebetina": "snake" },
  guides: {},
  hubById: { "macrovipera-lebetina": "snakes" },
  idBySlug: { giurza: "macrovipera-lebetina" },
  kaSlugById: { "macrovipera-lebetina": "giurza" },
  quizzes: [
    {
      group: "lizard",
      id: "lizard",
      slugs: {
        en: "which-lizard",
        ka: "romeli-xvlikia",
        ru: "kakaya-yashcherica",
        tr: "hangi-kertenkele",
      },
    },
  ],
};

function path(
  pathname: string,
  params: Record<string, string | undefined> = {},
  locale: "en" | "ka" = "ka",
) {
  return pageViewPath(switchIndex, pathname, locale, params);
}

describe("pageViewPath", () => {
  it("keeps static pages as they are", () => {
    expect(path("/")).toBe("/");
    expect(path("/snakes")).toBe("/snakes");
  });

  it("names species and quizzes by id in every locale", () => {
    expect(path("/snakes/[slug]", { slug: "giurza" })).toBe(
      "/snakes/macrovipera-lebetina",
    );
    expect(path("/quiz/[slug]", { slug: "which-lizard" }, "en")).toBe(
      "/quiz/lizard",
    );
  });

  it("fills other dynamic segments from the params", () => {
    expect(path("/regions/[id]", { id: "kakheti" })).toBe("/regions/kakheti");
    expect(path("/news/page/[page]", { page: "2" })).toBe("/news/page/2");
  });

  it("skips unknown pages and species", () => {
    expect(path("/no-such-page")).toBeUndefined();
    expect(path("/lizards/[slug]", { slug: "giurza" })).toBeUndefined();
    expect(path("/regions/[id]")).toBeUndefined();
    expect(path("/regions/[id]", { id: "Bad Id" })).toBeUndefined();
  });
});
