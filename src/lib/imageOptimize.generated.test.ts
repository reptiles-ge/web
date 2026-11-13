import type { ManifestEntry } from "@reptiles-ge/img-compression";

import { LocalStorageAdapter } from "@reptiles-ge/img-compression/storage";
import { describe, expect, it } from "vitest";

import { compactOptimizedAsset } from "@/lib/imageOptimize";

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

describe("compactOptimizedAsset", () => {
  it("compacts the derivatives into widths and formats", () => {
    expect(
      compactOptimizedAsset(
        "images/news/b.jpg",
        manifestEntry("images/news/b.jpg"),
        storage,
        PREFIX,
      ),
    ).toEqual({
      formats: ["avif", "webp"],
      height: 400,
      path: "images/news/b",
      width: 800,
      widths: [400, 800],
    });
  });

  it("answers null when no derivative beats the original", () => {
    expect(
      compactOptimizedAsset(
        "heavy.jpg",
        manifestEntry("heavy.jpg", 5000),
        storage,
        PREFIX,
      ),
    ).toBeNull();
  });

  it("refuses derivatives outside the optimized prefix", () => {
    expect(() =>
      compactOptimizedAsset(
        "a.jpg",
        manifestEntry("a.jpg"),
        storage,
        `${CDN}/elsewhere/`,
      ),
    ).toThrow("Derivative naming changed");
  });

  it("refuses an entry missing a width in one format", () => {
    const entry = manifestEntry("a.jpg");
    expect(() =>
      compactOptimizedAsset(
        "a.jpg",
        { ...entry, derivatives: entry.derivatives.slice(0, 3) },
        storage,
        PREFIX,
      ),
    ).toThrow("missing the 800px webp derivative");
  });
});
