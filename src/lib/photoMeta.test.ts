import { describe, expect, it } from "vitest";

import { galleryImageObject } from "@/lib/photoMeta";

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
});
