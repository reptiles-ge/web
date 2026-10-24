import { LocalStorageAdapter } from "@reptiles-ge/img-compression/storage";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { uploadStandalonePhotos } from "@/lib/adminPhotos";
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
      const manifestText = await readFile(
        path.join(dataDir, "image-manifest.json"),
        "utf8",
      );
      expect(manifestText.endsWith("}\n")).toBe(true);
      const manifest = JSON.parse(manifestText) as {
        entries: Record<string, unknown>;
      };
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
