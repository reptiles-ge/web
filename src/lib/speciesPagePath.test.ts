import { describe, expect, it } from "vitest";

import { isSpeciesPagePath } from "@/lib/speciesPagePath";

describe("isSpeciesPagePath", () => {
  it("matches species profiles in every locale", () => {
    for (const path of [
      "/gvelebi/giurza",
      "/en/snakes/macrovipera-lebetina",
      "/ru/lizards/pseudopus-apodus",
      "/tr/birds/tyto-alba",
      "/prinvelebi/bulbuli",
      "/gvelebi/giurza/",
    ]) {
      expect(isSpeciesPagePath(path), path).toBe(true);
    }
  });

  it("rejects hubs, indexes, guides and other sections", () => {
    for (const path of [
      "/",
      "/en",
      "/gvelebi",
      "/en/snakes",
      "/gvelebi/saxeoebebi",
      "/en/snakes/species",
      "/gvelebi/gvelis-nakbeni",
      "/en/snakes/bite",
      "/ru/snakes/identify-venomous",
      "/xvlikebi/darevskia",
      "/dzuzumtsovrebi/ghamura-sakhlshi",
      "/en/mammals/bat-in-the-house",
      "/en/insects/wasp-nest",
      "/regions/kakheti",
      "/news/some-article",
      "/kontributorebi/sandro-khakhva",
      "/quiz/romeli-gvelia",
      "/gvelebi/giurza/extra",
    ]) {
      expect(isSpeciesPagePath(path), path).toBe(false);
    }
  });
});
