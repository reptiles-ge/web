import { LocalStorageAdapter } from "@reptiles-ge/img-compression/storage";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { creditFromInput, uploadStandalonePhotos } from "@/lib/adminPhotos";
import { applyOptimizeCatalog } from "@/lib/imageOptimize";

describe("uploadStandalonePhotos", () => {
  it("returns CDN URLs for the compressed original and derivatives while reporting invalid files", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "reptiles-cdn-upload-"));
    try {
      const storage = new LocalStorageAdapter({
        baseUrl: "https://cdn.reptiles.ge",
        root,
      });
      const bytes = await readFile("public/images/logo-88.webp");
      const result = await uploadStandalonePhotos(
        [
          { bytes, filename: "Outside Photo.webp", name: "  " },
          { bytes, filename: "Camera 123.webp", name: "გიურზა" },
          { bytes: Buffer.from("not an image"), filename: "broken.jpg" },
        ],
        storage,
      );

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.filename).toBe("broken.jpg");
      expect(result.uploaded).toHaveLength(2);
      expect(result.catalog).toHaveLength(2);
      const photo = result.uploaded[0];
      expect(photo?.url).toMatch(
        /^https:\/\/cdn\.reptiles\.ge\/external\/outside-photo-[\da-f-]+\.jpg$/,
      );
      expect(photo?.derivatives.map((item) => item.format)).toContain("avif");
      expect(photo?.derivatives.map((item) => item.format)).toContain("webp");
      expect(result.uploaded[1]?.url).toBe(
        "https://cdn.reptiles.ge/external/giurza.jpg",
      );
      expect(result.uploaded[1]?.filename).toBe("გიურზა");
      expect(
        await storage.get(
          photo?.url.replace("https://cdn.reptiles.ge/", "") ?? "",
        ),
      ).not.toBeNull();
      for (const derivative of photo?.derivatives ?? []) {
        expect(
          await storage.get(
            derivative.url.replace("https://cdn.reptiles.ge/", ""),
          ),
        ).not.toBeNull();
      }

      const dataDir = path.join(root, "src/data");
      await mkdir(dataDir, { recursive: true });
      await writeFile(
        path.join(dataDir, "optimizedImages.generated.ts"),
        'export const optimizedBaseUrl = "https://cdn.reptiles.ge/optimized/";\nexport const optimizedImages: Record<string, OptimizedImageEntry> = {};\n',
      );
      await applyOptimizeCatalog(root, result.catalog);
      const manifest = JSON.parse(
        await readFile(path.join(dataDir, "image-manifest.json"), "utf8"),
      ) as { entries: Record<string, unknown> };
      expect(manifest.entries[result.catalog[0]?.key ?? ""]).toBeDefined();
      const generated = await readFile(
        path.join(dataDir, "optimizedImages.generated.ts"),
        "utf8",
      );
      expect(generated).toContain(JSON.stringify(photo?.url));
      expect(generated).toContain(JSON.stringify(result.uploaded[1]?.url));

      const duplicate = await uploadStandalonePhotos(
        [{ bytes, filename: "other.webp", name: "გიურზა" }],
        storage,
      );
      expect(duplicate.uploaded).toEqual([]);
      expect(duplicate.catalog).toEqual([]);
      expect(duplicate.errors[0]?.message).toMatch(/უკვე არსებობს/);
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});

describe("creditFromInput", () => {
  it("stores the photographer url on both locales", () => {
    const input = {
      photographer: "ანა",
      photographerEn: "Ana",
      url: "https://example.com/ana",
    };
    expect(creditFromInput(input, "ka")).toEqual({
      photographer: "ანა",
      url: "https://example.com/ana",
    });
    expect(creditFromInput(input, "en")).toEqual({
      photographer: "Ana",
      url: "https://example.com/ana",
    });
  });

  it("omits a blank url", () => {
    expect(creditFromInput({ photographer: "ანა", url: "  " }, "ka")).toEqual({
      photographer: "ანა",
    });
  });

  it("rejects a non-http photographer url", () => {
    expect(() =>
      creditFromInput(
        { photographer: "ანა", url: "javascript:alert(1)" },
        "ka",
      ),
    ).toThrow(/http/);
  });

  it("sets georgia-field when marked and location is present", () => {
    expect(
      creditFromInput(
        {
          georgiaField: true,
          location: "ვაშლოვანი",
          photographer: "ანა",
        },
        "ka",
      ),
    ).toEqual({
      location: "ვაშლოვანი",
      photoConfidence: "georgia-field",
      photographer: "ანა",
    });
  });

  it("requires location for georgia-field photos", () => {
    expect(() =>
      creditFromInput({ georgiaField: true, photographer: "ანა" }, "ka"),
    ).toThrow(/ადგილი/);
  });

  it("omits photoConfidence when not georgia-field", () => {
    expect(
      creditFromInput({ location: "Armenia", photographer: "ანა" }, "ka"),
    ).toEqual({
      location: "Armenia",
      photographer: "ანა",
    });
  });

  it("stores lat/lng on both locales", () => {
    expect(
      creditFromInput(
        {
          lat: "41.81667",
          lng: "45.35",
          location: "ვაშლოვანი",
          photographer: "ანა",
        },
        "ka",
      ),
    ).toEqual({
      lat: 41.81667,
      lng: 45.35,
      location: "ვაშლოვანი",
      photographer: "ანა",
    });
  });

  it("requires both lat and lng together", () => {
    expect(() =>
      creditFromInput({ lat: "41.8", photographer: "ანა" }, "ka"),
    ).toThrow(/კოორდინატები/);
  });
});
