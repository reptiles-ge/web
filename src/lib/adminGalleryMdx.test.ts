import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  appendGalleryItemToMdx,
  reorderGalleryInMdx,
  setCoverInMdx,
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

const COVER_FIXTURE = `---
id: test-species
image: "https://cdn.reptiles.ge/old.jpg"
imageCredit:
  photographer: ძველი
mobileImage: "https://cdn.reptiles.ge/old-m.jpg"
mobileImageCredit:
  photographer: მობილური
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

describe("setCoverInMdx", () => {
  it("sets desktop cover and credit without touching mobile", () => {
    const next = setCoverInMdx(COVER_FIXTURE, "desktop", {
      credit: { photographer: "ანა" },
      src: "https://cdn.reptiles.ge/a.jpg",
    });
    const data = matter(next).data as {
      image: string;
      imageCredit: { photographer: string };
      mobileImage: string;
      mobileImageCredit: { photographer: string };
    };
    expect(data.image).toBe("https://cdn.reptiles.ge/a.jpg");
    expect(data.imageCredit.photographer).toBe("ანა");
    expect(data.mobileImage).toBe("https://cdn.reptiles.ge/old-m.jpg");
    expect(data.mobileImageCredit.photographer).toBe("მობილური");
  });

  it("sets the same photo as both covers", () => {
    const next = setCoverInMdx(COVER_FIXTURE, "both", {
      credit: { location: "ყვარელი", photographer: "ბექა" },
      src: "https://cdn.reptiles.ge/b.jpg",
    });
    const data = matter(next).data as {
      image: string;
      imageCredit: { location: string; photographer: string };
      mobileImage: string;
      mobileImageCredit: { location: string; photographer: string };
    };
    expect(data.image).toBe("https://cdn.reptiles.ge/b.jpg");
    expect(data.mobileImage).toBe("https://cdn.reptiles.ge/b.jpg");
    expect(data.imageCredit).toEqual({
      location: "ყვარელი",
      photographer: "ბექა",
    });
    expect(data.mobileImageCredit).toEqual(data.imageCredit);
  });

  it("removes cover credit when the gallery item has none", () => {
    const next = setCoverInMdx(COVER_FIXTURE, "desktop", {
      src: "https://cdn.reptiles.ge/c.jpg",
    });
    const data = matter(next).data as {
      image: string;
      imageCredit?: { photographer?: string };
    };
    expect(data.image).toBe("https://cdn.reptiles.ge/c.jpg");
    expect(data.imageCredit).toBeUndefined();
  });

  it("does not invent overlay cover keys", () => {
    const overlay = `---
id: test-species
image: "https://cdn.reptiles.ge/old.jpg"
imageCredit:
  photographer: Old
commonName: Test
---

text
`;
    const next = setCoverInMdx(
      overlay,
      "both",
      {
        credit: { photographer: "ანა" },
        src: "https://cdn.reptiles.ge/a.jpg",
      },
      false,
    );
    const data = matter(next).data as {
      image: string;
      imageCredit: { photographer: string };
      mobileImage?: string;
    };
    expect(data.image).toBe("https://cdn.reptiles.ge/a.jpg");
    expect(data.imageCredit.photographer).toBe("ანა");
    expect(data.mobileImage).toBeUndefined();
  });

  it("sets a gallery photo as the cover on a real KA profile", () => {
    const raw = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/content/species/paralaudakia-caucasia/ka.mdx",
      ),
      "utf8",
    );
    const next = setCoverInMdx(raw, "desktop", {
      credit: { date: "2026-08-22", photographer: "ზაქრო სონგულაშვილი" },
      src: "https://cdn.reptiles.ge/paralaudakia-caucasia-zakro-1.jpg",
    });
    const data = matter(next).data as {
      image: string;
      imageCredit: { photographer: string };
      mobileImage: string;
    };
    expect(data.image).toBe(
      "https://cdn.reptiles.ge/paralaudakia-caucasia-zakro-1.jpg",
    );
    expect(data.imageCredit.photographer).toBe("ზაქრო სონგულაშვილი");
    expect(data.mobileImage).toBe(
      "https://cdn.reptiles.ge/paralaudakia-caucasia-mobile.jpg",
    );
  });
});
