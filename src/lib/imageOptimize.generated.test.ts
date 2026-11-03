import type { ManifestEntry } from "@reptiles-ge/img-compression";

import { LocalStorageAdapter } from "@reptiles-ge/img-compression/storage";
import { describe, expect, it } from "vitest";

import {
  buildGeneratedImages,
  formatGeneratedImages,
  readGeneratedImages,
} from "@/lib/imageOptimize";

const CDN = "https://cdn.reptiles.ge";
const PREFIX = `${CDN}/optimized/`;
const storage = new LocalStorageAdapter({ baseUrl: CDN, root: "/tmp/unused" });

const manifestEntry = (key: string, derivativeBytes = 100): ManifestEntry => {
  const base = key.replace(/\.[^.]+$/, "");
  return {
    configFingerprint: "fp",
    derivatives: [400, 800].flatMap((width) =>
      (["avif", "webp"] as const).map((format) => ({
        byteSize: derivativeBytes,
        format,
        height: width / 2,
        key: `optimized/${base}-${width}.${format}`,
        width,
      })),
    ),
    height: 400,
    originalKey: key,
    originalSize: 1000,
    sourceHash: "hash",
    updatedAt: "2026-11-03T00:00:00.000Z",
    width: 800,
  };
};

describe("buildGeneratedImages", () => {
  it("keeps entries the current sources cannot resolve when the previous file had them", () => {
    const { images } = buildGeneratedImages({
      entries: {
        "a.jpg": manifestEntry("a.jpg"),
        "images/news/b.jpg": manifestEntry("images/news/b.jpg"),
      },
      prefix: PREFIX,
      previous: new Map([["images/news/b.jpg", `${CDN}/images/news/b.jpg`]]),
      sources: new Map([["a.jpg", `${CDN}/a.jpg`]]),
      storage,
    });

    expect(Object.keys(images)).toEqual([
      `${CDN}/a.jpg`,
      `${CDN}/images/news/b.jpg`,
    ]);
    expect(images[`${CDN}/images/news/b.jpg`]?.path).toBe("images/news/b");
  });

  it("prefers the current source over the previous one", () => {
    const { images } = buildGeneratedImages({
      entries: {
        "images/home/hero.jpg": manifestEntry("images/home/hero.jpg"),
      },
      prefix: PREFIX,
      previous: new Map([
        ["images/home/hero.jpg", `${CDN}/images/home/hero.jpg`],
      ]),
      sources: new Map([["images/home/hero.jpg", "/images/home/hero.jpg"]]),
      storage,
    });

    expect(Object.keys(images)).toEqual(["/images/home/hero.jpg"]);
  });

  it("skips keys no source knows and derivatives that beat nothing", () => {
    const { images, skippedNoGain } = buildGeneratedImages({
      entries: {
        "gone.jpg": manifestEntry("gone.jpg"),
        "heavy.jpg": manifestEntry("heavy.jpg", 5000),
      },
      prefix: PREFIX,
      previous: new Map([["heavy.jpg", `${CDN}/heavy.jpg`]]),
      sources: new Map(),
      storage,
    });

    expect(images).toEqual({});
    expect(skippedNoGain).toBe(1);
  });

  it("resolves external keys through the storage url", () => {
    const { images } = buildGeneratedImages({
      entries: { "external/x.jpg": manifestEntry("external/x.jpg") },
      prefix: PREFIX,
      previous: new Map(),
      sources: new Map(),
      storage,
    });

    expect(Object.keys(images)).toEqual([`${CDN}/external/x.jpg`]);
  });
});

describe("readGeneratedImages", () => {
  it("reads back what the generator writes", () => {
    const images = {
      [`${CDN}/a.jpg`]: {
        formats: ["avif", "webp"] as ("avif" | "webp")[],
        height: 400,
        path: "a",
        width: 800,
        widths: [400, 800],
      },
    };
    const raw = `export const optimizedBaseUrl = "${PREFIX}";

export const optimizedImages: Record<string, OptimizedImageEntry> = ${formatGeneratedImages(images)};
`;

    expect(readGeneratedImages(raw)).toEqual(images);
  });

  it("refuses a file without the images export", () => {
    expect(() => readGeneratedImages("export const x = 1;")).toThrow(
      "not in the expected format",
    );
  });
});
