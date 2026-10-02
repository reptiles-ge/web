import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getGuideArticles } from "@/data/guideArticles";
import { getCatalogSpecies } from "@/data/species";
import { routing } from "@/i18n/routing";
import {
  getSpeciesProfileGuideLinks,
  SPECIES_GUIDE_LINK_LIMIT,
} from "@/lib/speciesGuideLinks";

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

describe("species profile guide links", () => {
  const catalog = getCatalogSpecies();

  it("links every species a guide names back to that guide", () => {
    for (const article of getGuideArticles()) {
      for (const id of article.relatedSpeciesIds ?? []) {
        const hrefs = getSpeciesProfileGuideLinks(id).map((link) =>
          link.kind === "page" ? link.href : null,
        );
        expect(hrefs, `${id} -> ${article.pathname}`).toContain(
          article.pathname,
        );
      }
    }
  });

  it("stays within the limit without repeating a destination", () => {
    for (const item of catalog) {
      const links = getSpeciesProfileGuideLinks(item.id);
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
        for (const link of getSpeciesProfileGuideLinks(item.id)) {
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
