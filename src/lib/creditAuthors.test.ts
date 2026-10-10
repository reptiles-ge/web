import { describe, expect, it } from "vitest";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import imageManifest from "@/data/image-manifest.json";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { getCatalogSpecies } from "@/data/species";
import { routing } from "@/i18n/routing";
import {
  creditAuthorAlternates,
  creditAuthorEntityJsonLd,
  creditAuthorIndexAlternates,
  creditAuthorIndexUrl,
  creditAuthorPageSchemaType,
  creditAuthorPortraitImage,
  creditAuthorStaticParams,
  creditAuthorUrl,
  getCreditAuthorCards,
  getCreditAuthorFieldSummary,
  getCreditAuthorGroupStats,
  getCreditAuthorHubIds,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  HOME_CONTRIBUTOR_LIMIT,
  resolvePublishedCreditAuthor,
} from "@/lib/creditAuthors";
import { creditAuthorPageImageUrls } from "@/lib/sitemapImages";

const authors = getPublishedCreditAuthors();

describe("static params and urls", () => {
  it("has one param per published author and locale", () => {
    const params = creditAuthorStaticParams();
    expect(params).toHaveLength(authors.length * routing.locales.length);
    expect(params).toContainEqual({ locale: "en", slug: authors[0].slug });
  });

  it("builds absolute URLs", () => {
    expect(creditAuthorUrl("en", "x")).toMatch(/^https:\/\/reptiles\.ge/);
    expect(creditAuthorIndexUrl("ka")).toMatch(/^https:\/\/reptiles\.ge/);
  });

  it("has alternates for every locale", () => {
    for (const alternates of [
      creditAuthorAlternates("en", authors[0].slug),
      creditAuthorIndexAlternates("en"),
    ]) {
      for (const locale of routing.locales) {
        expect(alternates.languages).toHaveProperty(locale);
      }
    }
  });
});

describe("resolvePublishedCreditAuthor", () => {
  it("resolves published authors only", () => {
    expect(resolvePublishedCreditAuthor(authors[0].slug)).toBe(authors[0]);
    expect(resolvePublishedCreditAuthor("nobody")).toBeUndefined();
  });
});

describe("getCreditAuthorPhotos", () => {
  it("only returns photos credited to one of the author's aliases", () => {
    for (const author of authors) {
      const aliases = new Set(author.aliases);
      for (const photo of getCreditAuthorPhotos(author)) {
        expect(
          aliases.has(photo.credit?.photographer?.trim() ?? ""),
          `${author.slug}: ${photo.src}`,
        ).toBe(true);
      }
    }
  });

  it("lists every photo source at most once", () => {
    for (const author of authors) {
      const srcs = getCreditAuthorPhotos(author).map((photo) => photo.src);
      expect(new Set(srcs).size, author.slug).toBe(srcs.length);
    }
  });

  it("only references published species", () => {
    const ids = new Set(getCatalogSpecies().map((item) => item.id));
    for (const author of authors) {
      for (const photo of getCreditAuthorPhotos(author)) {
        expect(ids.has(photo.speciesId), photo.speciesId).toBe(true);
      }
    }
  });

  it("returns nothing for an author with no matching credits", () => {
    expect(
      getCreditAuthorPhotos({ ...authors[0], aliases: ["Nobody Atall"] }),
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
  const cards = getCreditAuthorCards();

  it("has a card for every published author", () => {
    expect(cards.map((card) => card.author.slug).sort()).toEqual(
      authors.map((author) => author.slug).sort(),
    );
  });

  it("sorts by photo count, then slug", () => {
    for (let index = 1; index < cards.length; index += 1) {
      const previous = cards[index - 1];
      const current = cards[index];
      if (previous.photoCount === current.photoCount) {
        expect(previous.author.slug <= current.author.slug).toBe(true);
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
      const photos = getCreditAuthorPhotos(author);
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
    const stats = getCreditAuthorGroupStats(getCreditAuthorPhotos(authors[0]));
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
      expect(optimizedEntry(author.portraitSrc), author.slug).not.toBeNull();
    }
  });

  it("points share images and structured data at an uploaded WebP variant", () => {
    for (const author of authors) {
      const image = creditAuthorPortraitImage(author);
      if (!optimizedEntry(author.portraitSrc)?.formats.includes("webp")) {
        expect(image.url, author.slug).toBe(author.portraitSrc);
        continue;
      }
      expect(uploaded.has(image.url), author.slug).toBe(true);
      expect(image.type, author.slug).toBe("image/webp");
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
          `${author.slug} ${url}`,
        ).toBe(true);
      }
    }
  });
});

describe("contributor entity JSON-LD", () => {
  const bySlug = (slug: string) => resolvePublishedCreditAuthor(slug)!;

  it("describes a person with a verified job title and affiliation", () => {
    const zauri = bySlug("zauri-khachidze");
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

  it("does not type a photography page as a person or an organization", () => {
    const page = bySlug("velur-bunebastan-axlos");
    const node = creditAuthorEntityJsonLd(page, "ka", {
      description: "bio",
      jobTitle: "Ranger",
    });
    expect(creditAuthorPageSchemaType(page)).toBe("CollectionPage");
    expect(node["@type"]).toBe("Thing");
    expect(node).not.toHaveProperty("affiliation");
    expect(node).not.toHaveProperty("jobTitle");
    expect(node.sameAs).toEqual([
      "https://www.facebook.com/profile.php?id=61585670878935",
    ]);
  });
});
