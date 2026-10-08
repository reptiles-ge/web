import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { resolvePageContextFromIndex } from "@/lib/localeSwitch";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import { liveQuizzes } from "@/lib/quizzes";

const index = getLocaleSwitchIndex();

describe("getLocaleSwitchIndex", () => {
  it("indexes every published species by id and by its KA slug", () => {
    for (const item of getCatalogSpecies()) {
      expect(index.idBySlug[item.id], item.id).toBe(item.id);
      expect(index.idBySlug[index.kaSlugById[item.id]], item.id).toBe(item.id);
      expect(index.hubById[item.id], item.id).toBeTruthy();
      expect(index.groupById[item.id], item.id).toBeTruthy();
    }
  });

  it("gives the giurza its Georgian slug", () => {
    expect(index.kaSlugById["macrovipera-lebetina"]).toBe("giurza");
    expect(index.hubById["macrovipera-lebetina"]).toBe("snakes");
  });

  it("indexes every cluster guide by pathname", () => {
    for (const guide of CLUSTER_GUIDE_LIST) {
      expect(index.guides[guide.pathname]?.id, guide.id).toBe(guide.id);
    }
  });

  it("indexes the live quizzes with all four slugs", () => {
    expect(index.quizzes.map((quiz) => quiz.id)).toEqual(
      liveQuizzes().map((quiz) => quiz.id),
    );
    for (const quiz of index.quizzes) {
      expect(Object.keys(quiz.slugs).sort()).toEqual(["en", "ka", "ru", "tr"]);
    }
  });

  it("round-trips a species page through the page-context resolver", () => {
    expect(
      resolvePageContextFromIndex(index, "/snakes/[slug]", "ka", {
        slug: "giurza",
      }),
    ).toMatchObject({
      entity_id: "macrovipera-lebetina",
      group: "snake",
      page_type: "species",
    });
  });
});
