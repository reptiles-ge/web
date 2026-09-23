import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { speciesSameAs, speciesStructuredData } from "@/lib/createSpeciesRoute";

const CHEIRACANTHIUM_URL =
  "https://reptiles.ge/en/spiders/cheiracanthium-punctorium";
const CORRECT_NENTWIG_DOI = "https://doi.org/10.1016/j.toxicon.2013.07.010";
const OLD_NENTWIG_DOI = "https://doi.org/10.1016/j.toxicon.2013.07.020";
const GEORGIAN_RED_LIST_URL =
  "https://matsne.gov.ge/ka/document/view/2256983/0";
const OTTER_AUDIO_URL = "https://xeno-canto.org/961007";
const OTTER_CURRENT_IUCN_URL =
  "https://www.iucnredlist.org/species/12419/218069689";
const OTTER_REPORT_URL =
  "https://media.rufford.org/media/project_reports/11302-B%20Final%20Report.pdf";

type ArticleJsonLd = {
  about: TaxonJsonLd;
  citation: CreativeWorkJsonLd[];
  inLanguage: string;
  mainEntity: TaxonJsonLd;
  mainEntityOfPage: {
    "@id": string;
    "@type": string;
  };
};

type CreativeWorkJsonLd = {
  url?: string;
};

type GalleryJsonLd = {
  about: TaxonJsonLd;
};

type TaxonJsonLd = {
  alternateName?: string[];
  sameAs?: string[];
};

describe("species structured data", () => {
  it("includes both Georgian cockroach names in every Taxon instance", () => {
    const raw = getSpeciesById("blatta-orientalis");
    expect(raw).toBeDefined();

    for (const locale of ["ka", "en", "ru", "tr"] as const) {
      const localized = localizeSpecies(raw!, locale);
      const jsonLd = speciesStructuredData({
        breadcrumbCrumbs: [{ name: localized.commonName }],
        galleryTitle: "gallery",
        item: localized,
        locale,
        ogImage: localized.image,
        pageUrl: "https://reptiles.ge/mtserebi/shavi-tarakana",
        raw: raw!,
      });
      const article = jsonLd.find(
        (entry) => entry["@type"] === "Article",
      ) as ArticleJsonLd;
      const expectedNames = ["შავი ტარაკანა", "შავი ტარაკანი"];

      expect(article.about.alternateName).toEqual(
        expect.arrayContaining(expectedNames),
      );
      expect(article.mainEntity.alternateName).toEqual(
        expect.arrayContaining(expectedNames),
      );
      if (locale === "ka") {
        expect(localized.commonName).toBe("შავი ტარაკანა");
        expect(article.mainEntity.alternateName).toEqual(expectedNames);
      }
    }
  });

  it("keeps Cheiracanthium identity URLs in sameAs and source URLs in citation", () => {
    const raw = getSpeciesById("cheiracanthium-punctorium");
    expect(raw).toBeDefined();

    const species = raw!;
    const localized = localizeSpecies(species, "en");
    const sameAs = speciesSameAs(species);

    expect(species.sources.map((source) => source.url)).toContain(
      CORRECT_NENTWIG_DOI,
    );
    expect(species.sources.map((source) => source.url)).not.toContain(
      OLD_NENTWIG_DOI,
    );
    expect(sameAs).toEqual([
      "https://wsc.nmbe.ch/spec-data/28306",
      "https://araneae.nmbe.ch/data/1140/Cheiracanthium_punctorium",
      "https://caucasus-spiders.info/checklist/species-datasheet/?spec=2214",
      "https://arages.de/arachnologie-vernetzt/spinne-des-jahres/2023-ammendornfinger",
    ]);
    expect(sameAs).not.toContain(CORRECT_NENTWIG_DOI);
    expect(sameAs).not.toContain(GEORGIAN_RED_LIST_URL);

    const jsonLd = speciesStructuredData({
      breadcrumbCrumbs: [
        { href: "/", name: "Home" },
        { href: "/spiders", name: "Spiders" },
        { href: "/species", name: "Species" },
        { name: localized.commonName },
      ],
      galleryTitle: "gallery",
      item: localized,
      locale: "en",
      ogImage: localized.image,
      pageUrl: CHEIRACANTHIUM_URL,
      raw: species,
    });
    const article = jsonLd.find(
      (entry) => entry["@type"] === "Article",
    ) as ArticleJsonLd;
    const gallery = jsonLd.find(
      (entry) => entry["@type"] === "ImageGallery",
    ) as GalleryJsonLd;

    expect(article?.inLanguage).toBe("en");
    expect(article?.mainEntityOfPage).toEqual({
      "@id": CHEIRACANTHIUM_URL,
      "@type": "WebPage",
    });
    expect(article?.citation.map((source) => source.url)).toContain(
      CORRECT_NENTWIG_DOI,
    );
    expect(article?.citation.map((source) => source.url)).toContain(
      GEORGIAN_RED_LIST_URL,
    );
    expect(article?.mainEntity.sameAs).toEqual(sameAs);
    expect(article?.about.sameAs).toEqual(sameAs);
    expect(gallery?.about.sameAs).toEqual(sameAs);
  });

  it("uses წავი as the Georgian otter label without leaking citations into sameAs", () => {
    const raw = getSpeciesById("lutra-lutra");
    expect(raw).toBeDefined();

    const species = raw!;
    const localized = localizeSpecies(species, "ka");
    const sameAs = speciesSameAs(species);

    expect(localized.commonName).toBe("წავი");
    expect(sameAs).toEqual([
      OTTER_CURRENT_IUCN_URL,
      "https://www.iucnredlist.org/species/12419/21935287",
    ]);
    expect(sameAs).not.toContain(OTTER_REPORT_URL);
    expect(sameAs).not.toContain(GEORGIAN_RED_LIST_URL);
    expect(sameAs).not.toContain(OTTER_AUDIO_URL);

    const jsonLd = speciesStructuredData({
      breadcrumbCrumbs: [
        { href: "/", name: "მთავარი" },
        { href: "/mammals", name: "ძუძუმწოვრები" },
        { href: "/species", name: "სახეობები" },
        { name: localized.commonName },
      ],
      galleryTitle: "გალერეა",
      item: localized,
      locale: "ka",
      ogImage: localized.image,
      pageUrl: "https://reptiles.ge/dzuzumtsovrebi/chveulebrivi-tsavi",
      raw: species,
    });
    const article = jsonLd.find(
      (entry) => entry["@type"] === "Article",
    ) as ArticleJsonLd;

    expect(article?.mainEntity.alternateName?.[0]).toBe("წავი");
    expect(article?.mainEntity.sameAs).toEqual(sameAs);
    expect(article?.citation.map((source) => source.url)).toContain(
      OTTER_REPORT_URL,
    );
    expect(article?.citation.map((source) => source.url)).toContain(
      GEORGIAN_RED_LIST_URL,
    );
  });
});
