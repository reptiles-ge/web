import { describe, expect, it } from "vitest";

import { speciesSameAs, speciesStructuredData } from "@/lib/createSpeciesRoute";
import { getSpeciesHeroSources } from "@/lib/speciesContent";

import {
  catalogSpeciesFixture,
  localizedFixture,
  speciesFixture,
} from "../../tests/fixtures/speciesCatalog";

const CHEIRACANTHIUM_URL =
  "https://reptiles.ge/en/spiders/cheiracanthium-punctorium";
const CORRECT_NENTWIG_DOI = "https://doi.org/10.1016/j.toxicon.2013.07.010";
const OLD_NENTWIG_DOI = "https://doi.org/10.1016/j.toxicon.2013.07.020";
const GEORGIAN_RED_LIST_URL =
  "https://matsne.gov.ge/ka/document/view/2256983/0";
const BADGER_MDD_URL = "https://www.mammaldiversity.org/taxon/1005857/";
const MELES_MELES_IUCN_URL =
  "https://www.iucnredlist.org/species/29673/45203002";
const OTTER_AUDIO_URL = "https://xeno-canto.org/961007";
const OTTER_CURRENT_IUCN_URL =
  "https://www.iucnredlist.org/species/12419/218069689";
const OTTER_REPORT_URL =
  "https://media.rufford.org/media/project_reports/11302-B%20Final%20Report.pdf";

const VIPERA_TRANSCAUCASIANA_IUCN_URL =
  "https://www.iucnredlist.org/species/164708/114549008";

type ArticleJsonLd = {
  "@id": string;
  about: TaxonJsonLd;
  associatedMedia?: Array<{ "@id": string }>;
  author: unknown;
  citation: CreativeWorkJsonLd[];
  hasPart?: { "@id": string };
  image: unknown[];
  inLanguage: string;
  mainEntity?: TaxonJsonLd;
  mainEntityOfPage: {
    "@id": string;
    "@type": string;
  };
};

type CreativeWorkJsonLd = {
  url?: string;
};

type FaqJsonLd = {
  mainEntity: Array<{ acceptedAnswer: { text: string } }>;
};

type GalleryJsonLd = {
  "@id": string;
  about: TaxonJsonLd;
  associatedMedia: unknown[];
};

type TaxonJsonLd = {
  "@id"?: string;
  alternateName?: string[];
  sameAs?: string[];
};

describe("species structured data", () => {
  it("lists in ImageGallery exactly the photos the gallery shows", () => {
    for (const raw of catalogSpeciesFixture()) {
      const localized = localizedFixture(raw, "ka");
      const shown = getSpeciesHeroSources(localized).gallery.length;
      const gallery = speciesStructuredData({
        breadcrumbCrumbs: [{ name: localized.commonName }],
        galleryTitle: "gallery",
        item: localized,
        locale: "ka",
        ogImage: localized.image,
        pageUrl: "https://reptiles.ge/species",
        raw,
      }).find((entry) => entry["@type"] === "ImageGallery") as
        GalleryJsonLd | undefined;

      expect(gallery?.associatedMedia.length ?? 0, raw.id).toBe(shown);
    }
  });

  it("includes both Georgian cockroach names in every Taxon instance", () => {
    const raw = speciesFixture("blatta-orientalis");
    expect(raw).toBeDefined();

    for (const locale of ["ka", "en", "ru", "tr"] as const) {
      const localized = localizedFixture(raw!, locale);
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
      if (locale === "ka") {
        expect(localized.commonName).toBe("შავი ტარაკანა");
        expect(article.about.alternateName).toEqual(expectedNames);
      }
    }
  });

  it("defines the Taxon and each photo once and references the organization by @id", () => {
    const raw = speciesFixture("macrovipera-lebetina")!;
    const localized = localizedFixture(raw, "ka");
    const pageUrl = "https://reptiles.ge/gvelebi/giurza";
    const jsonLd = speciesStructuredData({
      breadcrumbCrumbs: [{ name: localized.commonName }],
      galleryTitle: "გალერეა",
      item: localized,
      locale: "ka",
      ogImage: localized.image,
      pageUrl,
      raw,
    });
    const article = jsonLd.find(
      (entry) => entry["@type"] === "Article",
    ) as ArticleJsonLd;
    const gallery = jsonLd.find(
      (entry) => entry["@type"] === "ImageGallery",
    ) as GalleryJsonLd;
    const serialized = JSON.stringify(jsonLd);
    const organization = { "@id": "https://reptiles.ge/#organization" };

    expect(article["@id"]).toBe(`${pageUrl}#article`);
    expect(article.about["@id"]).toBe(`${pageUrl}#taxon`);
    expect(article.mainEntity).toBeUndefined();
    expect(article.author).toEqual(organization);
    expect(article).toHaveProperty("publisher", organization);
    expect(article.hasPart).toEqual({ "@id": gallery["@id"] });
    expect(gallery.about).toEqual({ "@id": `${pageUrl}#taxon` });
    expect(serialized.match(/"@type":"Taxon","alternateName"/g)).toHaveLength(
      1,
    );
    expect(serialized.match(/"@type":"ImageObject"/g)).toHaveLength(
      gallery.associatedMedia.length + 1,
    );
    expect(article.associatedMedia).toEqual(
      gallery.associatedMedia.map((_, index) => ({
        "@id": `${pageUrl}#photo-${index + 1}`,
      })),
    );
    expect(
      article.image.slice(1).every((entry) => typeof entry === "string"),
    ).toBe(true);
  });

  it("keeps Cheiracanthium identity URLs in sameAs and source URLs in citation", () => {
    const raw = speciesFixture("cheiracanthium-punctorium");
    expect(raw).toBeDefined();

    const species = raw!;
    const localized = localizedFixture(species, "en");
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
      "https://www.wikidata.org/wiki/Q472994",
      "https://www.gbif.org/species/2164096",
      "https://www.inaturalist.org/taxa/61866",
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
    expect(article?.about.sameAs).toEqual(sameAs);
    expect(gallery?.about).toEqual({ "@id": `${CHEIRACANTHIUM_URL}#taxon` });
  });

  it("uses წავი as the Georgian otter label and keeps only the current IUCN assessment in sameAs", () => {
    const raw = speciesFixture("lutra-lutra");
    expect(raw).toBeDefined();

    const species = raw!;
    const localized = localizedFixture(species, "ka");
    const sameAs = speciesSameAs(species);

    expect(localized.commonName).toBe("წავი");
    expect(sameAs).toEqual([
      OTTER_CURRENT_IUCN_URL,
      "https://www.mammaldiversity.org/taxon/1005848/",
      "https://www.wikidata.org/wiki/Q29995",
      "https://www.gbif.org/species/2433753",
      "https://www.inaturalist.org/taxa/41850",
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

    expect(article?.about.alternateName?.[0]).toBe("წავი");
    expect(article?.about.sameAs).toEqual(sameAs);
    expect(article?.citation.map((source) => source.url)).toContain(
      OTTER_REPORT_URL,
    );
    expect(article?.citation.map((source) => source.url)).toContain(
      GEORGIAN_RED_LIST_URL,
    );
  });

  it("keeps a source about another species out of the badger's sameAs", () => {
    const raw = speciesFixture("meles-canescens");
    expect(raw).toBeDefined();

    const sameAs = speciesSameAs(raw!);

    expect(sameAs).toContain(BADGER_MDD_URL);
    expect(sameAs).not.toContain(MELES_MELES_IUCN_URL);
  });

  it("cites the Vipera transcaucasiana IUCN account without making it a sameAs of Vipera ammodytes", () => {
    const raw = speciesFixture("vipera-transcaucasiana")!;
    const localized = localizedFixture(raw, "en");
    const article = speciesStructuredData({
      breadcrumbCrumbs: [{ name: localized.commonName }],
      galleryTitle: "gallery",
      item: localized,
      locale: "en",
      ogImage: localized.image,
      pageUrl: "https://reptiles.ge/en/snakes/vipera-transcaucasiana",
      raw,
    }).find((entry) => entry["@type"] === "Article") as ArticleJsonLd;

    expect(raw.scientificName).toBe("Vipera ammodytes");
    expect(speciesSameAs(raw)).not.toContain(VIPERA_TRANSCAUCASIANA_IUCN_URL);
    expect(article.citation.map((work) => work.url)).toContain(
      VIPERA_TRANSCAUCASIANA_IUCN_URL,
    );
  });

  it("only uses a source as sameAs when it names the Taxon's own binomial", () => {
    for (const raw of catalogSpeciesFixture()) {
      const [genus, epithet] = raw.scientificName.split(" ");
      const sameAs = new Set(speciesSameAs(raw));
      for (const source of raw.sources) {
        if (!source.url || !sameAs.has(source.url)) continue;
        const named = Array.from(
          source.name.matchAll(
            new RegExp(String.raw`\b${genus}\s+([a-z-]+)`, "g"),
          ),
          (match) => match[1],
        );
        if (named.length === 0) continue;
        expect(
          named.some((name) => stem(name) === stem(epithet)),
          `${raw.id}: ${source.name}`,
        ).toBe(true);
      }
    }
  });

  it("keeps keyword phrases and duplicates out of Taxon alternateName", () => {
    for (const raw of catalogSpeciesFixture()) {
      for (const locale of ["ka", "en", "ru", "tr"] as const) {
        const localized = localizedFixture(raw, locale);
        const article = speciesStructuredData({
          breadcrumbCrumbs: [{ name: localized.commonName }],
          galleryTitle: "gallery",
          item: localized,
          locale,
          ogImage: localized.image,
          pageUrl: "https://reptiles.ge/species",
          raw,
        }).find((entry) => entry["@type"] === "Article") as ArticleJsonLd;
        const names = article.about.alternateName ?? [];
        const keys = names.map((name) => name.toLocaleLowerCase());
        const label = `${raw.id}/${locale}`;

        expect(new Set(keys).size, label).toBe(keys.length);
        expect(keys, label).not.toContain(
          raw.scientificName.toLocaleLowerCase(),
        );
        for (const name of names) {
          expect(name, label).not.toMatch(
            /\b(?:non-)?venomous\b|\bGeorgia\b|საქართველო|შხამიან|უშხამო|Грузи|ядовит|Gürcistan|zehirli|zehirsiz/iu,
          );
        }
      }
    }
  });

  it("writes FAQ answers as plain text without inline species links", () => {
    const raw = speciesFixture("meles-canescens");
    expect(raw).toBeDefined();

    const localized = localizedFixture(raw!, "ka");
    const faq = speciesStructuredData({
      breadcrumbCrumbs: [{ name: localized.commonName }],
      galleryTitle: "გალერეა",
      item: localized,
      locale: "ka",
      ogImage: localized.image,
      pageUrl: "https://reptiles.ge/dzuzumtsovrebi/machvi",
      raw: raw!,
    }).find((entry) => entry["@type"] === "FAQPage") as FaqJsonLd | undefined;
    const answers = faq?.mainEntity.map((entry) => entry.acceptedAnswer.text);

    expect(answers?.length).toBeGreaterThan(0);
    for (const answer of answers ?? []) {
      expect(answer).not.toMatch(/\]\(/);
    }
  });
});

function stem(epithet: string) {
  return epithet.replace(/-+$/, "").replace(/(?:us|um|is|a|e)$/, "");
}
