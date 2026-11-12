import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getGuideArticles } from "@/data/guideArticles";
import { routing } from "@/i18n/routing";
import {
  getSpeciesProfileGuideLinks,
  SPECIES_GUIDE_LINK_LIMIT,
} from "@/lib/speciesGuideLinks";

import {
  catalogSpeciesFixture,
  speciesFixture,
} from "../../tests/fixtures/speciesCatalog";

type ClusterCopy = Record<
  string,
  { body?: string; cta?: string; eyebrow?: string; title?: string }
>;

function clusterCopy(locale: string): ClusterCopy {
  const file = path.join(process.cwd(), "messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(file, "utf8")) as {
    groupHubShared: { cluster: ClusterCopy };
  };
  return messages.groupHubShared.cluster;
}

function profileHrefs(id: string) {
  const species = speciesFixture(id) ?? { danger: "harmless", genus: "", id };
  return getSpeciesProfileGuideLinks(
    species as Parameters<typeof getSpeciesProfileGuideLinks>[0],
  ).map((link) => (link.kind === "page" ? link.href : null));
}

describe("species profile guide links", () => {
  const catalog = catalogSpeciesFixture();

  it("links every species a guide names back to that guide", () => {
    for (const article of getGuideArticles()) {
      for (const id of article.relatedSpeciesIds ?? []) {
        const hrefs = getSpeciesProfileGuideLinks(speciesFixture(id)!).map(
          (link) => (link.kind === "page" ? link.href : null),
        );
        expect(hrefs, `${id} -> ${article.pathname}`).toContain(
          article.pathname,
        );
      }
    }
  });

  it("links every species listed for profiles back to that guide", () => {
    for (const article of getGuideArticles()) {
      for (const id of article.profileSpeciesIds ?? []) {
        const hrefs = profileHrefs(id);
        expect(hrefs, `${id} -> ${article.pathname}`).toContain(
          article.pathname,
        );
      }
    }
  });

  it("keeps bats that do not use buildings off the bat-in-the-house guide", () => {
    for (const id of [
      "miniopterus-schreibersii",
      "nyctalus-lasiopterus",
      "rhinolophus-blasii",
      "rhinolophus-mehelyi",
    ]) {
      expect(profileHrefs(id), id).not.toContain("/mammals/ghamura-sakhlshi");
    }
    expect(profileHrefs("rattus-norvegicus")).not.toContain(
      "/mammals/tagvi-sakhlshi",
    );
  });

  it("leads with the practical guide written for that animal", () => {
    const pairs = [
      ["canis-aureus", "/mammals/tura-ezoshi"],
      ["ursus-arctos", "/mammals/datvi-shekhvedra"],
      ["blatta-orientalis", "/insects/taraknebi-sakhlshi"],
      ["cimex-lectularius", "/insects/baghlinjo-sakhlshi"],
      ["halyomorpha-halys", "/insects/farosana-sakhlshi"],
    ] as const;
    for (const [id, href] of pairs) {
      const [first] = getSpeciesProfileGuideLinks(speciesFixture(id)!);
      expect(first?.kind === "page" ? first.href : null, id).toBe(href);
    }
  });

  it("stays within the limit without repeating a destination", () => {
    for (const item of catalog) {
      const links = getSpeciesProfileGuideLinks(item);
      expect(links.length, item.id).toBeLessThanOrEqual(
        SPECIES_GUIDE_LINK_LIMIT,
      );
      const keys = links.map((link) =>
        link.kind === "page" ? link.href : `${link.kind}:${link.id}`,
      );
      expect(new Set(keys).size, item.id).toBe(keys.length);
    }
  });

  it("has card copy for every linked card in every locale", () => {
    for (const locale of routing.locales) {
      const copy = clusterCopy(locale);
      for (const item of catalog) {
        for (const link of getSpeciesProfileGuideLinks(item)) {
          const card = copy[link.key];
          const label = `${locale} ${item.id} ${link.key}`;
          expect(card?.title?.trim(), label).toBeTruthy();
          expect(card?.body?.trim(), label).toBeTruthy();
          expect(card?.eyebrow?.trim(), label).toBeTruthy();
          expect(card?.cta?.trim(), label).toBeTruthy();
        }
      }
    }
  });
});
