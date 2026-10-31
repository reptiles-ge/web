import { describe, expect, it } from "vitest";

import imageManifest from "@/data/image-manifest.json";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { routing } from "@/i18n/routing";
import {
  creditAuthorAlternates,
  creditAuthorEntityJsonLd,
  creditAuthorIndexAlternates,
  creditAuthorIndexUrl,
  creditAuthorPageSchemaType,
  creditAuthorPersonId,
  creditAuthorPortraitImage,
  creditAuthorStaticParams,
  creditAuthorUrl,
  getCreditAuthorCards,
  getCreditAuthorFieldSummary,
  getCreditAuthorGroupStats,
  getCreditAuthorHubIds,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  getCreditAuthorTopSpecies,
  HOME_CONTRIBUTOR_LIMIT,
} from "@/lib/creditAuthors";
import { creditAuthorPageImageUrls } from "@/lib/sitemapImages";

import {
  catalogSpeciesFixture,
  contributorsFixture,
  speciesCatalogFixture,
} from "../../tests/fixtures/speciesCatalog";

const authors = contributorsFixture("ka");
const resolvePublishedCreditAuthor = (id: string) =>
  authors.find((author) => author.id === id);

describe("static params and urls", () => {
  it("has one param per contributor and locale", () => {
    const params = creditAuthorStaticParams(authors);
    expect(params).toHaveLength(authors.length * routing.locales.length);
    expect(params).toContainEqual({ locale: "en", slug: authors[0].id });
  });

  it("builds absolute URLs", () => {
    expect(creditAuthorUrl("en", "x")).toMatch(/^https:\/\/reptiles\.ge/);
    expect(creditAuthorIndexUrl("ka")).toMatch(/^https:\/\/reptiles\.ge/);
  });

  it("has alternates for every locale", () => {
    for (const alternates of [
      creditAuthorAlternates("en", authors[0].id),
      creditAuthorIndexAlternates("en"),
    ]) {
      for (const locale of routing.locales) {
        expect(alternates.languages).toHaveProperty(locale);
      }
    }
  });
});

describe("getCreditAuthorPhotos", () => {
  it("only returns photos linked to the author", () => {
    for (const author of authors) {
      const aliases = new Set(author.aliases);
      for (const photo of getCreditAuthorPhotos(
        author,
        speciesCatalogFixture("ka"),
      )) {
        expect(photo.credit?.authorId, photo.src).toBe(author.id);
        expect(
          aliases.has(photo.credit?.photographer?.trim() ?? ""),
          `${author.id}: ${photo.src}`,
        ).toBe(true);
      }
    }
  });

  it("lists every photo source at most once", () => {
    for (const author of authors) {
      const srcs = getCreditAuthorPhotos(
        author,
        speciesCatalogFixture("ka"),
      ).map((photo) => photo.src);
      expect(new Set(srcs).size, author.id).toBe(srcs.length);
    }
  });

  it("only references published species", () => {
    const ids = new Set(catalogSpeciesFixture().map((item) => item.id));
    for (const author of authors) {
      for (const photo of getCreditAuthorPhotos(
        author,
        speciesCatalogFixture("ka"),
      )) {
        expect(ids.has(photo.speciesId), photo.speciesId).toBe(true);
      }
    }
  });

  it("returns nothing for an author with no matching credits", () => {
    expect(
      getCreditAuthorPhotos(
        { id: "nobody-atall" },
        speciesCatalogFixture("ka"),
      ),
    ).toEqual([]);
  });
});

describe("getCreditAuthorSpeciesIds", () => {
  it("returns each species once, in first-seen order", () => {
    const photo = (speciesId: string, src: string) => ({
      speciesId,
      src,
      updatedAt: "2026-01-01",
    });
    expect(
      getCreditAuthorSpeciesIds([
        photo("b", "1"),
        photo("a", "2"),
        photo("b", "3"),
      ]),
    ).toEqual(["b", "a"]);
    expect(getCreditAuthorSpeciesIds([])).toEqual([]);
  });
});

describe("getCreditAuthorHubIds", () => {
  it("returns hubs once each, snakes first", () => {
    expect(
      getCreditAuthorHubIds([
        "falco-peregrinus",
        "testudo-graeca",
        "natrix-natrix",
        "macrovipera-lebetina",
      ]),
    ).toEqual(["snakes", "turtles", "birds"]);
  });

  it("returns nothing for no species", () => {
    expect(getCreditAuthorHubIds([])).toEqual([]);
  });
});

describe("getCreditAuthorCards", () => {
  const cards = getCreditAuthorCards(authors, speciesCatalogFixture("ka"));

  it("has a card for every contributor", () => {
    expect(cards.map((card) => card.author.id).sort()).toEqual(
      authors.map((author) => author.id).sort(),
    );
  });

  it("sorts by photo count, then slug", () => {
    for (let index = 1; index < cards.length; index += 1) {
      const previous = cards[index - 1];
      const current = cards[index];
      if (previous.photoCount === current.photoCount) {
        expect(previous.author.id <= current.author.id).toBe(true);
      } else {
        expect(previous.photoCount).toBeGreaterThan(current.photoCount);
      }
    }
  });

  it("keeps previews small, real and consistent with the counts", () => {
    for (const card of cards) {
      expect(card.preview.length).toBeLessThanOrEqual(4);
      expect(card.preview.length).toBeLessThanOrEqual(card.photoCount);
      expect(card.speciesCount).toBeLessThanOrEqual(card.photoCount);
    }
  });

  it("exposes the home page limit", () => {
    expect(HOME_CONTRIBUTOR_LIMIT).toBeGreaterThan(0);
  });
});

describe("getCreditAuthorGroupStats", () => {
  it("accounts for every photo and species exactly once per group", () => {
    for (const author of authors) {
      const photos = getCreditAuthorPhotos(author, speciesCatalogFixture("ka"));
      const stats = getCreditAuthorGroupStats(photos);
      expect(stats.reduce((sum, stat) => sum + stat.photos, 0)).toBe(
        photos.length,
      );
      expect(
        stats.flatMap((stat) => stat.species.map((item) => item.id)).sort(),
      ).toEqual(getCreditAuthorSpeciesIds(photos).sort());
      for (const stat of stats) {
        expect(stat.species.reduce((sum, item) => sum + item.photos, 0)).toBe(
          stat.photos,
        );
      }
      expect(stats.map((stat) => stat.hub).sort()).toEqual(
        getCreditAuthorHubIds(getCreditAuthorSpeciesIds(photos)).sort(),
      );
    }
  });

  it("orders groups by photo count", () => {
    const stats = getCreditAuthorGroupStats(
      getCreditAuthorPhotos(authors[0], speciesCatalogFixture("ka")),
    );
    for (let index = 1; index < stats.length; index += 1) {
      expect(stats[index - 1].photos).toBeGreaterThanOrEqual(
        stats[index].photos,
      );
    }
  });

  it("returns nothing for no photos", () => {
    expect(getCreditAuthorGroupStats([])).toEqual([]);
  });
});

describe("getCreditAuthorTopSpecies", () => {
  it("ranks species by photos and counts the rest", () => {
    const top = getCreditAuthorTopSpecies(
      [
        {
          hub: "snakes",
          photos: 4,
          species: [
            { id: "vipera-kaznakovi", photos: 1 },
            { id: "macrovipera-lebetina", photos: 3 },
          ],
        },
        {
          hub: "lizards",
          photos: 2,
          species: [
            { id: "pseudopus-apodus", photos: 1 },
            { id: "anguis-colchica", photos: 1 },
          ],
        },
      ],
      3,
    );
    expect(top).toEqual({
      ids: ["macrovipera-lebetina", "vipera-kaznakovi", "pseudopus-apodus"],
      rest: 1,
    });
  });
});

describe("getCreditAuthorFieldSummary", () => {
  const photo = (location?: string, date?: string) => ({
    credit: { date, location, photographer: "x" },
    speciesId: "macrovipera-lebetina",
    src: `${location}-${date}`,
    updatedAt: "2026-01-01",
  });

  it("picks the most frequent place and the year range", () => {
    expect(
      getCreditAuthorFieldSummary([
        photo("ვაშლოვანი", "2015-05-01"),
        photo("ვაშლოვანი", "2021"),
        photo("თბილისი", "2019-03"),
        photo(undefined, "not a date"),
      ]),
    ).toEqual({
      place: { count: 2, name: "ვაშლოვანი" },
      years: { from: 2015, to: 2021 },
    });
  });

  it("leaves out what the credits do not state", () => {
    expect(getCreditAuthorFieldSummary([photo()])).toEqual({
      place: undefined,
      years: undefined,
    });
  });
});

describe("portrait URLs outside the picture element", () => {
  const uploaded = new Set(
    Object.values(imageManifest.entries).flatMap((entry) =>
      entry.derivatives.map(
        (derivative) => `https://cdn.reptiles.ge/${derivative.key}`,
      ),
    ),
  );

  it("optimizes every published portrait", () => {
    for (const author of authors) {
      expect(optimizedEntry(author.portraitSrc), author.id).not.toBeNull();
    }
  });

  it("points share images and structured data at an uploaded WebP variant", () => {
    for (const author of authors) {
      const image = creditAuthorPortraitImage(author);
      if (!optimizedEntry(author.portraitSrc)?.formats.includes("webp")) {
        expect(image.url, author.id).toBe(author.portraitSrc);
        continue;
      }
      expect(uploaded.has(image.url), author.id).toBe(true);
      expect(image.type, author.id).toBe("image/webp");
    }
  });

  it("never shares the missing Sheklashvili original", () => {
    const author = resolvePublishedCreditAuthor("giorgi-sheklashvili");
    expect(author).toBeDefined();
    if (!author) return;
    expect(creditAuthorPortraitImage(author).url).toBe(
      "https://cdn.reptiles.ge/optimized/images/authors/giorgi-sheklashvili-1200.webp",
    );
  });

  it("resolves sitemap and search thumbnails to uploaded variants", () => {
    for (const author of authors) {
      const [sitemapUrl] = creditAuthorPageImageUrls(author.portraitSrc, []);
      const searchThumb = optimizedImgSrc(author.portraitSrc, 400);
      for (const url of [sitemapUrl, searchThumb]) {
        expect(
          uploaded.has(url) || url === author.portraitSrc,
          `${author.id} ${url}`,
        ).toBe(true);
      }
    }
  });
});

describe("contributor entity JSON-LD", () => {
  const bySlug = (slug: string) => resolvePublishedCreditAuthor(slug)!;

  it("describes a person with a verified job title and affiliation", () => {
    const zauri = contributorsFixture("en").find(
      (author) => author.id === "zauri-khachidze",
    )!;
    const node = creditAuthorEntityJsonLd(zauri, "en", {
      description: "bio",
      jobTitle: "Ranger",
    });
    expect(creditAuthorPageSchemaType(zauri)).toBe("ProfilePage");
    expect(node).toMatchObject({
      "@type": "Person",
      affiliation: [
        { "@type": "Organization", name: "Borjomi-Kharagauli National Park" },
      ],
      jobTitle: "Ranger",
      name: "Zauri Khachidze",
    });
  });

  it("leaves out job title and affiliation a person's bio does not state", () => {
    const node = creditAuthorEntityJsonLd(bySlug("sandro-khakhva"), "ka", {});
    expect(node["@type"]).toBe("Person");
    expect(node).not.toHaveProperty("affiliation");
    expect(node).not.toHaveProperty("jobTitle");
  });

  it("gives a person a stable @id and leaves out an empty sameAs", () => {
    const node = creditAuthorEntityJsonLd(bySlug("sandro-khakhva"), "ka", {});
    expect(node["@id"]).toBe(
      `${creditAuthorUrl("ka", "sandro-khakhva")}#person`,
    );
    expect(node["@id"]).toBe(creditAuthorPersonId("ka", "sandro-khakhva"));
    expect(node).not.toHaveProperty("sameAs");
  });

  it("does not type a photography page as a person or an organization", () => {
    const page = bySlug("velur-bunebastan-axlos");
    const node = creditAuthorEntityJsonLd(page, "ka", {
      description: "bio",
      jobTitle: "Ranger",
    });
    expect(creditAuthorPageSchemaType(page)).toBe("CollectionPage");
    expect(node["@type"]).toBe("Thing");
    expect(node).not.toHaveProperty("@id");
    expect(node).not.toHaveProperty("affiliation");
    expect(node).not.toHaveProperty("jobTitle");
    expect(node.sameAs).toEqual([
      "https://www.facebook.com/profile.php?id=61585670878935",
    ]);
  });
});
