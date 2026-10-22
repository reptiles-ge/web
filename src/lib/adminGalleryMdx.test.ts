import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import { appendGalleryItemToMdx } from "@/lib/adminGalleryMdx";

const FIXTURE = `---
id: test-species
gallery:
  - src: "https://cdn.reptiles.ge/a.jpg"
    credit:
      photographer: ანა
  - src: "https://cdn.reptiles.ge/b.jpg"
    credit:
      photographer: ბექა
      location: ყვარელი
  - src: "https://cdn.reptiles.ge/c.jpg"
commonName: ტესტი
---

ტექსტი
`;

describe("appendGalleryItemToMdx", () => {
  it("writes photographer url on a new gallery item", () => {
    const next = appendGalleryItemToMdx(FIXTURE, {
      credit: {
        photographer: "ანა",
        url: "https://example.com/ana",
      },
      src: "https://cdn.reptiles.ge/d.jpg",
    });
    const gallery = matter(next).data.gallery as Array<{
      credit?: { photographer?: string; url?: string };
      src: string;
    }>;
    expect(gallery.at(-1)?.credit).toEqual({
      photographer: "ანა",
      url: "https://example.com/ana",
    });
    expect(next).toContain('url: "https://example.com/ana"');
  });

  it("writes georgia-field photoConfidence into credit", () => {
    const next = appendGalleryItemToMdx(FIXTURE, {
      credit: {
        location: "ვაშლოვანი",
        photoConfidence: "georgia-field",
        photographer: "ანა",
      },
      src: "https://cdn.reptiles.ge/d.jpg",
    });
    expect(next).toContain("photoConfidence: georgia-field");
    const gallery = matter(next).data.gallery as Array<{
      credit?: {
        location?: string;
        photoConfidence?: string;
        photographer?: string;
      };
      src: string;
    }>;
    expect(gallery.at(-1)?.credit).toEqual({
      location: "ვაშლოვანი",
      photoConfidence: "georgia-field",
      photographer: "ანა",
    });
  });

  it("writes numeric lat/lng into credit yaml", () => {
    const next = appendGalleryItemToMdx(FIXTURE, {
      credit: {
        lat: 41.81667,
        lng: 45.35,
        location: "ვაშლოვანი",
        photographer: "ანა",
      },
      src: "https://cdn.reptiles.ge/d.jpg",
    });
    expect(next).toContain("lat: 41.81667");
    expect(next).toContain("lng: 45.35");
    const gallery = matter(next).data.gallery as Array<{
      credit?: {
        lat?: number;
        lng?: number;
        location?: string;
        photographer?: string;
      };
      src: string;
    }>;
    expect(gallery.at(-1)?.credit).toEqual({
      lat: 41.81667,
      lng: 45.35,
      location: "ვაშლოვანი",
      photographer: "ანა",
    });
  });
});
