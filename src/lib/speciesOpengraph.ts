import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  cdnOgExt,
  cdnOgImageUrl,
  cdnOgSpeciesIds,
} from "@/lib/site";
import { resolveSpeciesId } from "@/lib/speciesRoutes";

export const speciesOgAlt = "ქართული გველგესლები — Reptiles";
export const speciesOgSize = {
  width: 1200,
  height: 630,
};
export const speciesOgContentType = "image/jpeg";

async function readLocalImage(relativePath: string) {
  try {
    const buffer = await readFile(join(process.cwd(), "public", relativePath));
    return buffer;
  } catch {
    return null;
  }
}

async function fetchCdnOg(speciesId: string) {
  const response = await fetch(cdnOgImageUrl(speciesId), {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!response.ok) {
    return null;
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function speciesOpengraphResponse(param: string) {
  const id = resolveSpeciesId(param) ?? param;

  if (cdnOgSpeciesIds.has(id)) {
    const buffer = await fetchCdnOg(id);
    if (buffer) {
      const ext = cdnOgExt(id);
      return new Response(buffer, {
        headers: {
          "Content-Type": ext === "jpg" ? "image/jpeg" : "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  const localHero = await readLocalImage(`images/${id}.jpg`);
  if (localHero) {
    return new Response(localHero, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const fallback = await fetchCdnOg("vipera-dinniki");
  if (!fallback) {
    throw new Error(`Failed to load OG image for ${id}`);
  }

  return new Response(fallback, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
