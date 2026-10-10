import { describe, expect, it } from "vitest";

import { optimizedEntry } from "@/data/optimizedImages";
import { getCatalogSpecies } from "@/data/species";
import { galleryImageObject, galleryImageObjects } from "@/lib/photoMeta";

describe("galleryImageObject", () => {
  it("points published photographers at their author page", () => {
    const data = galleryImageObject(
      {
        credit: { photographer: "სანდრო ხახვა" },
        src: "https://cdn.reptiles.ge/vipera-kaznakovi.jpg",
      },
      {
        commonName: "კავკასიური გველგესლა",
        location: "",
        scientificName: "Vipera kaznakovi",
      },
      "ka",
    );

    expect(data).toEqual(
      expect.objectContaining({
        creator: expect.objectContaining({
          "@type": "Person",
          name: "სანდრო ხახვა",
        }),
      }),
    );
    expect(data).toEqual(
      expect.objectContaining({
        creator: expect.objectContaining({
          url: expect.stringMatching(/^https?:\/\//),
        }),
      }),
    );
  });

  it("credits a photography page by name without calling it a person", () => {
    const data = galleryImageObject(
      {
        credit: { photographer: "ველურ ბუნებასთან ახლოს" },
        src: "https://cdn.reptiles.ge/buteo-buteo.jpg",
      },
      {
        commonName: "ჩვეულებრივი კაკაჩა",
        location: "",
        scientificName: "Buteo buteo",
      },
      "ka",
    );

    expect(data.creditText).toBe("ველურ ბუნებასთან ახლოს");
    expect(data).not.toHaveProperty("creator");
    expect(data).not.toHaveProperty("copyrightHolder");
  });

  it("adds GeoCoordinates under contentLocation Place", () => {
    const data = galleryImageObject(
      {
        credit: {
          lat: 41.81667,
          lng: 45.35,
          location: "ვაშლოვანი",
          photographer: "სანდრო ხახვა",
        },
        src: "https://cdn.reptiles.ge/vipera-kaznakovi.jpg",
      },
      {
        commonName: "კავკასიური გველგესლა",
        location: "",
        scientificName: "Vipera kaznakovi",
      },
      "ka",
    );

    expect(data.contentLocation).toEqual({
      "@type": "Place",
      geo: {
        "@type": "GeoCoordinates",
        latitude: 41.81667,
        longitude: 45.35,
      },
      name: "ვაშლოვანი",
    });
  });
});

describe("galleryImageObjects", () => {
  it("lists every photo and credits the ones that have a photographer", () => {
    const objects = galleryImageObjects(
      [
        {
          credit: { photographer: "Charles J. Sharp" },
          src: "https://cdn.reptiles.ge/commons.jpg",
        },
        {
          credit: { photographer: "სანდრო ხახვა" },
          src: "https://cdn.reptiles.ge/sandro.jpg",
        },
        { src: "https://cdn.reptiles.ge/uncredited.jpg" },
        {
          credit: { photographer: "ზაური ხაჩიძე" },
          src: "https://cdn.reptiles.ge/zauri.jpg",
        },
      ],
      {
        commonName: "კავკასიური გველგესლა",
        location: "",
        scientificName: "Vipera kaznakovi",
      },
      "ka",
    );

    expect(objects.map((item) => item.contentUrl)).toEqual([
      "https://cdn.reptiles.ge/commons.jpg",
      "https://cdn.reptiles.ge/sandro.jpg",
      "https://cdn.reptiles.ge/uncredited.jpg",
      "https://cdn.reptiles.ge/zauri.jpg",
    ]);
    expect(objects.map((item) => item.creditText)).toEqual([
      "Charles J. Sharp",
      "სანდრო ხახვა",
      undefined,
      "ზაური ხაჩიძე",
    ]);
    expect(objects[0].creator).toEqual({
      "@type": "Person",
      name: "Charles J. Sharp",
    });
    expect(objects[1].creator).toHaveProperty("url");
  });
});

describe("species photo JSON-LD URLs", () => {
  it("points every optimized catalog photo at its published CDN file", () => {
    for (const species of getCatalogSpecies()) {
      for (const photo of species.gallery) {
        if (!optimizedEntry(photo.src)) continue;
        const data = galleryImageObject(photo, species, "ka");
        expect(data.contentUrl, photo.src).toMatch(
          /^https:\/\/cdn\.reptiles\.ge\/optimized\/.+-\d+\.(webp|avif)$/,
        );
        expect(data.url, photo.src).toBe(data.contentUrl);
        expect(data.encodingFormat, photo.src).toMatch(/^image\/(webp|avif)$/);
      }
    }
  });
});
