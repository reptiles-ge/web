import matter from "gray-matter";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  appendGalleryItemToMdx,
  removeGalleryItemFromMdx,
  removeGalleryItemFromSpecies,
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

});

describe("removeGalleryItemFromMdx", () => {
  it("removes a middle item without dropping other credits", () => {
    const next = removeGalleryItemFromMdx(
      FIXTURE,
      "https://cdn.reptiles.ge/b.jpg",
    );
    expect(gallerySrcs(next)).toEqual([
      "https://cdn.reptiles.ge/a.jpg",
      "https://cdn.reptiles.ge/c.jpg",
    ]);
    const gallery = matter(next).data.gallery as Array<{
      credit?: { photographer?: string };
      src: string;
    }>;
    expect(gallery[0]?.credit?.photographer).toBe("ანა");
    expect(gallery[1]?.credit).toBeUndefined();
    expect(next).toContain("commonName: ტესტი");
  });

  it("empties the last overlay item", () => {
    const overlay = `---
gallery:
  - src: "https://cdn.reptiles.ge/a.jpg"
    credit:
      photographer: Ana
commonName: Test
---

text
`;
    const next = removeGalleryItemFromMdx(
      overlay,
      "https://cdn.reptiles.ge/a.jpg",
    );
    expect(matter(next).data.gallery).toEqual([]);
    expect(next).toContain("commonName: Test");
  });

  it("rejects an unknown src", () => {
    expect(() =>
      removeGalleryItemFromMdx(FIXTURE, "https://cdn.reptiles.ge/missing.jpg"),
    ).toThrow(/Unknown gallery src/);
  });
});

describe("removeGalleryItemFromSpecies", () => {
  it("removes overlay credits and reassigns the cover", () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), "reptiles-admin-remove-"),
    );
    try {
      const dir = path.join(root, "src/content/species/test-species");
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, "ka.mdx"),
        `---
id: test-species
image: "https://cdn.reptiles.ge/a.jpg"
imageCredit:
  photographer: ანა
mobileImage: "https://cdn.reptiles.ge/a.jpg"
mobileImageCredit:
  photographer: ანა
gallery:
  - src: "https://cdn.reptiles.ge/a.jpg"
    credit:
      photographer: ანა
  - src: "https://cdn.reptiles.ge/b.jpg"
    credit:
      photographer: ბექა
      location: ყვარელი
commonName: ტესტი
---

ტექსტი
`,
        "utf8",
      );
      fs.writeFileSync(
        path.join(dir, "en.mdx"),
        `---
id: test-species
image: "https://cdn.reptiles.ge/a.jpg"
imageCredit:
  photographer: Ana
gallery:
  - src: "https://cdn.reptiles.ge/a.jpg"
    credit:
      photographer: Ana
  - src: "https://cdn.reptiles.ge/b.jpg"
    credit:
      photographer: Beka
      location: Kvareli
commonName: Test
---

text
`,
        "utf8",
      );

      const result = removeGalleryItemFromSpecies(
        "test-species",
        "https://cdn.reptiles.ge/a.jpg",
        root,
      );
      expect(result.coverReassigned).toBe(true);
      expect(result.image).toBe("https://cdn.reptiles.ge/b.jpg");
      expect(result.mobileImage).toBe("https://cdn.reptiles.ge/b.jpg");

      const ka = matter(fs.readFileSync(path.join(dir, "ka.mdx"), "utf8"))
        .data as {
        gallery: Array<{ credit?: { photographer?: string }; src: string }>;
        image: string;
        imageCredit: { photographer: string };
        mobileImage: string;
      };
      expect(ka.gallery.map((item) => item.src)).toEqual([
        "https://cdn.reptiles.ge/b.jpg",
      ]);
      expect(ka.gallery[0]?.credit?.photographer).toBe("ბექა");
      expect(ka.image).toBe("https://cdn.reptiles.ge/b.jpg");
      expect(ka.imageCredit.photographer).toBe("ბექა");
      expect(ka.mobileImage).toBe("https://cdn.reptiles.ge/b.jpg");

      const en = matter(fs.readFileSync(path.join(dir, "en.mdx"), "utf8"))
        .data as {
        gallery: Array<{ credit?: { photographer?: string }; src: string }>;
        image: string;
        imageCredit: { photographer: string };
      };
      expect(en.gallery.map((item) => item.src)).toEqual([
        "https://cdn.reptiles.ge/b.jpg",
      ]);
      expect(en.gallery[0]?.credit?.photographer).toBe("Beka");
      expect(en.image).toBe("https://cdn.reptiles.ge/b.jpg");
      expect(en.imageCredit.photographer).toBe("Beka");
    } finally {
      fs.rmSync(root, { force: true, recursive: true });
    }
  });

  it("refuses the last gallery photo", () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), "reptiles-admin-remove-last-"),
    );
    try {
      const dir = path.join(root, "src/content/species/test-species");
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, "ka.mdx"),
        `---
id: test-species
gallery:
  - src: "https://cdn.reptiles.ge/a.jpg"
commonName: ტესტი
---

ტექსტი
`,
        "utf8",
      );
      expect(() =>
        removeGalleryItemFromSpecies(
          "test-species",
          "https://cdn.reptiles.ge/a.jpg",
          root,
        ),
      ).toThrow(/last gallery photo/);
    } finally {
      fs.rmSync(root, { force: true, recursive: true });
    }
  });
});
