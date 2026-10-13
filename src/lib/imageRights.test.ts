import { describe, expect, it } from "vitest";

import { getGuideArticles } from "@/data/guideArticles";
import { getPublishedNewsArticles } from "@/data/news";
import { photoLicenses } from "@/data/photoLicenses";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { pathnames } from "@/i18n/pathnames";
import { routing } from "@/i18n/routing";
import { speciesStructuredData } from "@/lib/createSpeciesRoute";
import {
  guideImageRights,
  photoRights,
  photoUsePageUrl,
  siteImageRights,
} from "@/lib/imageRights";
import { newsImageRights } from "@/lib/newsVisual";
import { galleryImageObject } from "@/lib/photoMeta";
import { speciesOgImageUrl, speciesPageUrl } from "@/lib/site";

type ImageObject = Record<string, unknown> & {
  acquireLicensePage?: string;
  contentUrl?: string;
  copyrightNotice?: string;
  creator?: { "@type": string; name: string };
  creditText?: string;
  license?: string;
};

const PUBLIC_DOMAIN = "https://creativecommons.org/publicdomain/";

function collectImageObjects(value: unknown, found: ImageObject[] = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectImageObjects(item, found);
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record["@type"] === "ImageObject") found.push(record as ImageObject);
    for (const child of Object.values(record)) {
      collectImageObjects(child, found);
    }
  }
  return found;
}

function expectAttributed(image: Partial<ImageObject>, label: string) {
  expect(image.creator?.["@type"], label).toMatch(/^(Organization|Person)$/);
  expect(image.creditText, label).toBeTruthy();
  if (!image.license?.startsWith(PUBLIC_DOMAIN)) {
    expect(image.copyrightNotice, label).toBe(`© ${image.creator?.name}`);
  }
}

function expectLicensed(image: Partial<ImageObject>, label: string) {
  expect(image.license, label).toMatch(/^https:\/\//);
  expect(image.acquireLicensePage, label).toMatch(/^https:\/\//);
}

describe("photo use page URL", () => {
  it("is absolute and has a Georgian public slug", () => {
    expect(photoUsePageUrl("ka")).toMatch(/^https:\/\/reptiles\.ge/);
    expect(pathnames["/photo-use"]).toEqual({
      en: "/photo-use",
      ka: "/fotoebis-gamoyeneba",
      ru: "/photo-use",
      tr: "/photo-use",
    });
  });
});

describe("photoRights", () => {
  it("points contributor photos at the photo use page", () => {
    const rights = photoRights(
      "https://cdn.reptiles.ge/vipera-dinniki-sandro-1.jpg",
      { photographer: "სანდრო ხახვა" },
      "en",
    );
    expect(rights.license).toBe(photoUsePageUrl("en"));
    expect(rights.acquireLicensePage).toBe(photoUsePageUrl("en"));
    expect(rights.creator).toEqual(
      expect.objectContaining({ "@type": "Person" }),
    );
    expect(rights.copyrightNotice).toBe(`© ${rights.creator?.name}`);
    expect(rights.creditText).toBe(rights.creator?.name);
  });

  it("uses the iNaturalist license and observation for a CC photo", () => {
    const rights = photoRights(
      "https://cdn.reptiles.ge/vipera-transcaucasiana.jpg",
      {
        photographer: "Vojtěch Víta",
        url: "https://www.inaturalist.org/observations/238226101",
      },
      "ka",
    );
    expect(rights.license).toBe(
      "https://creativecommons.org/licenses/by-nc/4.0/",
    );
    expect(rights.acquireLicensePage).toBe(
      "https://www.inaturalist.org/observations/238226101",
    );
    expect(rights.copyrightNotice).toBe("© Vojtěch Víta");
  });

  it("uses the Commons license and file page for a Commons photo", () => {
    const rights = photoRights(
      "https://cdn.reptiles.ge/vipera-transcaucasiana-2.jpg",
      { photographer: "Hectonichus" },
      "ka",
    );
    expect(rights.license).toBe(
      "https://creativecommons.org/licenses/by-sa/3.0/",
    );
    expect(rights.acquireLicensePage).toMatch(
      /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
    );
  });

  it("sends all-rights-reserved iNaturalist photos to the photo use page", () => {
    const src = Object.keys(photoLicenses).find(
      (key) => photoLicenses[key].license === null,
    ) as string;
    const rights = photoRights(src, { photographer: "Someone" }, "ru");
    expect(rights.license).toBe(photoUsePageUrl("ru"));
    expect(rights.acquireLicensePage).toBe(photoUsePageUrl("ru"));
  });

  it("leaves out a copyright notice on public domain photos", () => {
    const rights = photoRights(
      "https://cdn.reptiles.ge/erinaceus-concolor-israel-1.jpg",
      { photographer: "Nadav Kavalerchik" },
      "en",
    );
    expect(rights.license).toMatch(
      /^https:\/\/creativecommons\.org\/publicdomain\//,
    );
    expect(rights).not.toHaveProperty("copyrightNotice");
    expect(rights.creator).toEqual(
      expect.objectContaining({ name: "Nadav Kavalerchik" }),
    );
  });

  it("does not invent a creator for an uncredited photo", () => {
    const rights = photoRights(
      "https://cdn.reptiles.ge/x.jpg",
      undefined,
      "en",
    );
    expect(rights).not.toHaveProperty("creator");
    expect(rights).not.toHaveProperty("copyrightNotice");
    expectLicensed(rights, "uncredited");
  });
});

describe("photoLicenses", () => {
  it("stores absolute Creative Commons URLs and source pages", () => {
    for (const [src, entry] of Object.entries(photoLicenses)) {
      if (entry.license !== null) {
        expect(entry.license, src).toMatch(
          /^https:\/\/creativecommons\.org\/(licenses|publicdomain)\/[a-z-]+\/\d\.\d\/([a-z]{2}\/)?$/,
        );
      }
      expect(entry.sourceUrl, src).toMatch(
        /^https:\/\/(www\.inaturalist\.org\/observations\/\d+|commons\.wikimedia\.org\/wiki\/File:.+)$/,
      );
    }
  });
});

describe("species ImageObjects", () => {
  it("carry license metadata on every page and locale", () => {
    for (const locale of routing.locales) {
      for (const raw of getCatalogSpecies()) {
        const item = localizeSpecies(raw, locale);
        const data = speciesStructuredData({
          breadcrumbCrumbs: [{ name: item.commonName }],
          galleryTitle: "gallery",
          item,
          locale,
          ogImage: speciesOgImageUrl(item.id, item.image),
          pageUrl: speciesPageUrl(locale, item.id),
          raw,
        });
        for (const image of collectImageObjects(data)) {
          const label = `${locale} ${raw.id} ${image.contentUrl}`;
          expectLicensed(image, label);
          if (image.creator) expectAttributed(image, label);
        }
      }
    }
  });

  it("credit every photo that has a photographer", () => {
    for (const locale of routing.locales) {
      for (const raw of getCatalogSpecies()) {
        const item = localizeSpecies(raw, locale);
        for (const photo of item.gallery) {
          const image = galleryImageObject(photo, item, locale) as ImageObject;
          const label = `${locale} ${raw.id} ${photo.src}`;
          expectLicensed(image, label);
          if (photo.credit?.photographer?.trim()) {
            expectAttributed(image, label);
          } else {
            expect(image, label).not.toHaveProperty("creator");
          }
        }
      }
    }
  });
});

describe("guide and news images", () => {
  it("license every guide hero and credit the site's own covers", () => {
    for (const article of getGuideArticles()) {
      for (const locale of routing.locales) {
        const rights = guideImageRights(article.hero, locale);
        expectLicensed(rights, article.id);
        if (!article.hero.src.includes("/external/") && !article.hero.credit) {
          expect(rights).toEqual(siteImageRights(locale));
          expectAttributed(rights, article.id);
        }
      }
    }
  });

  it("license every news image", () => {
    for (const article of getPublishedNewsArticles()) {
      for (const locale of routing.locales) {
        const rights = newsImageRights(article, locale);
        expectLicensed(rights, article.slug);
        if ("creator" in rights) expectAttributed(rights, article.slug);
      }
    }
  });

  it("credit the site as an Organization by @id", () => {
    const rights = siteImageRights("ka");
    expect(rights.creator).toEqual(
      expect.objectContaining({
        "@id": "https://reptiles.ge/#organization",
        "@type": "Organization",
      }),
    );
    expect(rights.copyrightNotice).toBe("© Reptiles.ge");
  });
});
