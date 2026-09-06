import { describe, expect, it } from "vitest";

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
          url: expect.stringMatching(/\/fotografebi\/sandro-khakhva\/?$/),
        }),
      }),
    );
  });
});

describe("galleryImageObjects", () => {
  it("keeps only photos credited to a published author with a page", () => {
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
      "https://cdn.reptiles.ge/sandro.jpg",
      "https://cdn.reptiles.ge/zauri.jpg",
    ]);
  });
});
