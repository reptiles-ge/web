import { describe, expect, it, vi } from "vitest";

import { schemaCropImageObjects } from "@/lib/schemaCropImages";

vi.mock("@/data/newsSchemaImages", () => ({
  schemaImageCrops: (src: string) =>
    src === "/images/cover.jpg"
      ? [
          {
            height: 675,
            ratio: "16x9",
            url: "https://cdn.reptiles.ge/schema/16x9/images/cover.jpg",
            width: 1200,
          },
        ]
      : [],
}));

describe("schemaCropImageObjects", () => {
  it("turns each stored crop into an ImageObject with the photo rights", () => {
    expect(
      schemaCropImageObjects("/images/cover.jpg", { creditText: "A" }),
    ).toEqual([
      {
        "@type": "ImageObject",
        contentUrl: "https://cdn.reptiles.ge/schema/16x9/images/cover.jpg",
        creditText: "A",
        height: 675,
        url: "https://cdn.reptiles.ge/schema/16x9/images/cover.jpg",
        width: 1200,
      },
    ]);
  });

  it("returns nothing for a photo without crops or without a source", () => {
    expect(schemaCropImageObjects("/images/other.jpg", {})).toEqual([]);
    expect(schemaCropImageObjects(undefined, {})).toEqual([]);
  });
});
