import { describe, expect, it } from "vitest";

import { photoLicenses } from "@/data/photoLicenses";
import { getCatalogSpecies } from "@/data/species";
import { photoContributor, photoRights } from "@/lib/imageRights";
import {
  getPhotoUseCreditExample,
  getPhotoUseHeroPhotos,
  getPhotoUsePhotos,
  getPhotoUseShowcase,
  getPhotoUseStats,
  PHOTO_USE_SHOWCASE_GROUPS,
  PHOTO_USE_SHOWCASE_SIZE,
  photoLicenseLabel,
  type PhotoUsePhoto,
} from "@/lib/photoUse";

const OTHER_AUTHOR = {
  aliases: ["Other"],
  id: "other",
  name: { en: "Other", ka: "Other" },
  portraitSrc: "",
  published: true,
  role: "photographer" as const,
  slug: "other",
};

describe("photo use data", () => {
  const photos = getPhotoUsePhotos();

  it("counts every unique gallery photo of the published catalog", () => {
    const srcs = new Set(
      getCatalogSpecies().flatMap((species) =>
        species.gallery.map((item) => item.src),
      ),
    );
    expect(photos.length).toBe(srcs.size);
    expect(new Set(photos.map((photo) => photo.src)).size).toBe(photos.length);
  });

  it("derives the stats from the data", () => {
    const stats = getPhotoUseStats(photos);
    expect(stats.photos).toBe(photos.length);
    expect(stats.contributors).toBe(
      photos.filter((photo) => photoContributor(photo.credit)).length,
    );
    expect(stats.open).toBe(
      photos.filter(
        (photo) =>
          !photoContributor(photo.credit) && photoLicenses[photo.src]?.license,
      ).length,
    );
    expect(stats.authors).toBeGreaterThan(0);
    expect(stats.authors).toBeLessThanOrEqual(stats.photos);
  });

  it("merges a contributor's aliases into one author", () => {
    const base = photos.find((photo) => photo.author)!;
    const alias = base.author!.aliases.at(-1)!;
    const sample: PhotoUsePhoto[] = [
      base,
      { ...base, credit: { photographer: alias }, src: `${base.src}#2` },
      { ...base, author: undefined, credit: {}, src: `${base.src}#3` },
    ];
    expect(getPhotoUseStats(sample).authors).toBe(1);
  });

  it("shows six contributor profile heroes, one per group", () => {
    const showcase = getPhotoUseShowcase();
    expect(showcase).toHaveLength(PHOTO_USE_SHOWCASE_SIZE);
    const groups = showcase.map((photo) => photo.group);
    expect(new Set(groups).size).toBe(groups.length);
    expect(groups).toEqual(
      PHOTO_USE_SHOWCASE_GROUPS.filter((group) => groups.includes(group)),
    );
    for (const photo of showcase) {
      const species = getCatalogSpecies().find(
        (item) => item.id === photo.speciesId,
      );
      expect(photo.src).toBe(species?.image);
      expect(photoContributor(species?.imageCredit)?.id).toBe(photo.author.id);
    }
    expect(getPhotoUseShowcase()).toEqual(showcase);
  });

  it("skips non-contributor heroes and reuses an author only as a fallback", () => {
    const heroes = getPhotoUseHeroPhotos();
    const first = heroes.find((photo) => photo.author)!;
    const outsider = { ...first, author: undefined, src: "a" };
    const snake = { ...first, group: "snake" as const };
    const lizard = { ...first, group: "lizard" as const, src: "b" };
    const other = { ...lizard, author: OTHER_AUTHOR, src: "c" };
    expect(
      getPhotoUseShowcase([outsider, snake, lizard, other]).map((p) => p.src),
    ).toEqual([snake.src, "c"]);
    expect(getPhotoUseShowcase([snake, lizard]).map((p) => p.src)).toEqual([
      snake.src,
      "b",
    ]);
  });

  it("explains a credit with another author's source link and CC license", () => {
    const example = getPhotoUseCreditExample(photos)!;
    expect(example.photo.credit?.photographer).toBeTruthy();
    expect(photoContributor(example.photo.credit)).toBeUndefined();
    expect(
      photoRights(example.photo.src, example.photo.credit, "en").license,
    ).toBe(example.licenseUrl);
    expect(example.sourceUrl).toBe(example.photo.credit?.url);
    expect(photoLicenses[example.photo.src].license).toBe(example.licenseUrl);
    expect(example.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//);
    expect(getPhotoUseCreditExample([])).toBeUndefined();
  });

  it("labels Creative Commons licenses", () => {
    expect(
      photoLicenseLabel("https://creativecommons.org/licenses/by-nc/4.0/"),
    ).toBe("CC BY-NC 4.0");
    expect(
      photoLicenseLabel("https://creativecommons.org/licenses/by-sa/2.0/de/"),
    ).toBe("CC BY-SA 2.0 DE");
    expect(
      photoLicenseLabel("https://creativecommons.org/publicdomain/zero/1.0/"),
    ).toBe("CC0 1.0");
    expect(
      photoLicenseLabel("https://creativecommons.org/publicdomain/mark/1.0/"),
    ).toBe("Public Domain Mark");
  });
});
