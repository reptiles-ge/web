import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  appendGalleryItemToMdx,
  reorderGalleryInMdx,
} from "@/lib/adminGalleryMdx";

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

function gallerySrcs(raw: string) {
  const gallery = matter(raw).data.gallery as Array<{ src: string }>;
  return gallery.map((item) => item.src);
}

describe("reorderGalleryInMdx", () => {
  it("moves an item without dropping credits", () => {
    const next = reorderGalleryInMdx(FIXTURE, [
      "https://cdn.reptiles.ge/c.jpg",
      "https://cdn.reptiles.ge/a.jpg",
      "https://cdn.reptiles.ge/b.jpg",
    ]);
    expect(gallerySrcs(next)).toEqual([
      "https://cdn.reptiles.ge/c.jpg",
      "https://cdn.reptiles.ge/a.jpg",
      "https://cdn.reptiles.ge/b.jpg",
    ]);
    const gallery = matter(next).data.gallery as Array<{
      credit?: { location?: string; photographer?: string };
      src: string;
    }>;
    expect(gallery[1]?.credit?.photographer).toBe("ანა");
    expect(gallery[2]?.credit).toEqual({
      location: "ყვარელი",
      photographer: "ბექა",
    });
    expect(next).toContain("commonName: ტესტი");
  });

  it("rejects a list that is not a permutation", () => {
    expect(() =>
      reorderGalleryInMdx(FIXTURE, [
        "https://cdn.reptiles.ge/a.jpg",
        "https://cdn.reptiles.ge/b.jpg",
      ]),
    ).toThrow(/every photo once/);
    expect(() =>
      reorderGalleryInMdx(FIXTURE, [
        "https://cdn.reptiles.ge/a.jpg",
        "https://cdn.reptiles.ge/b.jpg",
        "https://cdn.reptiles.ge/missing.jpg",
      ]),
    ).toThrow(/Unknown gallery src/);
  });

  it("reorders a real KA profile and keeps each credit on its src", () => {
    const raw = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/content/species/paralaudakia-caucasia/ka.mdx",
      ),
      "utf8",
    );
    const original = matter(raw).data.gallery as Array<{
      credit?: { photographer?: string };
      src: string;
    }>;
    const reversed = [...original].reverse();
    const next = reorderGalleryInMdx(
      raw,
      reversed.map((item) => item.src),
    );
    const gallery = matter(next).data.gallery as Array<{
      credit?: { photographer?: string };
      src: string;
    }>;
    expect(gallery.map((item) => item.src)).toEqual(
      reversed.map((item) => item.src),
    );
    for (const item of reversed) {
      const match = gallery.find((entry) => entry.src === item.src);
      expect(match?.credit?.photographer).toBe(item.credit?.photographer);
    }
  });

  it("can move a newly appended item to the front", () => {
    const withNew = appendGalleryItemToMdx(FIXTURE, {
      credit: { photographer: "ნიკა" },
      src: "https://cdn.reptiles.ge/d.jpg",
    });
    const next = reorderGalleryInMdx(withNew, [
      "https://cdn.reptiles.ge/d.jpg",
      "https://cdn.reptiles.ge/a.jpg",
      "https://cdn.reptiles.ge/b.jpg",
      "https://cdn.reptiles.ge/c.jpg",
    ]);
    expect(gallerySrcs(next)[0]).toBe("https://cdn.reptiles.ge/d.jpg");
    const gallery = matter(next).data.gallery as Array<{
      credit?: { photographer?: string };
      src: string;
    }>;
    expect(gallery[0]?.credit?.photographer).toBe("ნიკა");
  });
});
