import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import {
  breadcrumbListLd,
  sitePageLd,
  speciesItemListLd,
} from "@/lib/pageStructuredData";
import { siteEntityId, speciesPageUrl } from "@/lib/site";

describe("breadcrumbListLd", () => {
  it("numbers crumbs from 1 in order", () => {
    const ld = breadcrumbListLd([
      { item: "https://reptiles.ge/", name: "Home" },
      { item: "https://reptiles.ge/snakes", name: "Snakes" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toEqual([
      {
        "@type": "ListItem",
        item: "https://reptiles.ge/",
        name: "Home",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: "https://reptiles.ge/snakes",
        name: "Snakes",
        position: 2,
      },
    ]);
  });
});

describe("speciesItemListLd", () => {
  it("lists species with name, position and locale URL", () => {
    const species = getSpeciesById("macrovipera-lebetina");
    expect(species).toBeDefined();
    const ld = speciesItemListLd("en", [
      {
        commonName: "Blunt-nosed viper",
        id: "macrovipera-lebetina",
        scientificName: "Macrovipera lebetina",
      },
    ]);
    expect(ld).toEqual({
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          name: "Blunt-nosed viper (Macrovipera lebetina)",
          position: 1,
          url: speciesPageUrl("en", "macrovipera-lebetina"),
        },
      ],
      numberOfItems: 1,
    });
  });

  it("handles an empty list", () => {
    const ld = speciesItemListLd("ka", []);
    expect(ld.itemListElement).toEqual([]);
    expect(ld.numberOfItems).toBe(0);
  });
});

describe("sitePageLd", () => {
  const base = {
    dates: { dateModified: "2026-02-01", datePublished: "2026-01-01" },
    description: "d",
    locale: "en",
    name: "n",
    type: "WebPage" as const,
    url: "https://reptiles.ge/x",
  };

  it("fills the shared publisher fields", () => {
    const ld = sitePageLd(base);
    expect(ld).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      author: { "@id": siteEntityId("organization") },
      dateModified: "2026-02-01",
      datePublished: "2026-01-01",
      description: "d",
      inLanguage: "en",
      isPartOf: { "@id": siteEntityId("website") },
      name: "n",
      publisher: { "@id": siteEntityId("organization") },
      url: "https://reptiles.ge/x",
    });
  });

  it("omits about and mainEntity unless given", () => {
    const ld = sitePageLd(base);
    expect(ld).not.toHaveProperty("about");
    expect(ld).not.toHaveProperty("mainEntity");
  });

  it("includes about, mainEntity and the page type when given", () => {
    const ld = sitePageLd({
      ...base,
      about: { "@type": "Place", name: "Georgia" },
      mainEntity: { "@type": "ItemList" },
      type: "CollectionPage",
    });
    expect(ld).toMatchObject({
      "@type": "CollectionPage",
      about: { "@type": "Place", name: "Georgia" },
      mainEntity: { "@type": "ItemList" },
    });
  });
});
