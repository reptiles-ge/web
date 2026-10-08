import { describe, expect, it } from "vitest";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import { getCatalogSpecies } from "@/data/species";
import { routing } from "@/i18n/routing";
import {
  creditAuthorAlternates,
  creditAuthorIndexAlternates,
  creditAuthorIndexUrl,
  creditAuthorStaticParams,
  creditAuthorUrl,
  getCreditAuthorCards,
  getCreditAuthorHubIds,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  HOME_CONTRIBUTOR_LIMIT,
  resolvePublishedCreditAuthor,
} from "@/lib/creditAuthors";

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
