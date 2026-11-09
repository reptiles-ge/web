import { describe, expect, it } from "vitest";

import { contentViewForPath, pageViewTemplate } from "@/lib/pageViewPath";

describe("pageViewTemplate", () => {
  it.each([
    ["/", "/"],
    ["/about", "/about"],
    ["/regions/kakheti", "/regions/[id]"],
    ["/snakes/macrovipera-lebetina", "/snakes/[slug]"],
    ["/news/page/2", "/news/page/[page]"],
    ["/amphibians/bayayi", "/amphibians/bayayi"],
    ["/quiz/snake", "/quiz/[slug]"],
  ])("matches %s to %s", (path, template) => {
    expect(pageViewTemplate(path)).toBe(template);
  });

  it.each([
    "",
    "about",
    "/no-such-page",
    "/snakes/a/b",
    "/Snakes",
    "/regions/kakheti/",
    "/snakes/--x",
  ])("refuses %j", (path) => {
    expect(pageViewTemplate(path)).toBeUndefined();
  });
});

describe("contentViewForPath", () => {
  it("finds the species and the news article behind a page", () => {
    expect(contentViewForPath("/lizards/paralaudakia-caucasia")).toEqual({
      id: "paralaudakia-caucasia",
      kind: "species",
    });
    expect(contentViewForPath("/news/new-checklist")).toEqual({
      id: "new-checklist",
      kind: "news",
    });
  });

  it("has no content for other pages", () => {
    expect(contentViewForPath("/regions/kakheti")).toBeUndefined();
    expect(contentViewForPath("/news/page/2")).toBeUndefined();
    expect(contentViewForPath("/nowhere")).toBeUndefined();
  });
});
