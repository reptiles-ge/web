import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { getSpeciesById } from "@/data/species";
import {
  FALLBACK_OG_IMAGE_URL,
  OG_IMAGE_TYPE,
  speciesOgImageUrl,
} from "@/lib/site";
import { resolveSpeciesId } from "@/lib/speciesRoutes";

export const speciesOgAlt = "Reptiles — Georgia";
export const speciesOgSize = {
  height: 630,
  width: 1200,
};
export const speciesOgContentType = OG_IMAGE_TYPE;

export async function speciesOpengraphResponse(param: string) {
  const id = resolveSpeciesId(param) ?? param;
  const item = getSpeciesById(id);
  const url = speciesOgImageUrl(id, item?.image);

  const fromCdn = await fetchOg(url);
  if (fromCdn) return jpegResponse(fromCdn);

  const localHero = await readLocalImage(`images/${id}.jpg`);
  if (localHero) return jpegResponse(localHero);

  if (url !== FALLBACK_OG_IMAGE_URL) {
    const fallback = await fetchOg(FALLBACK_OG_IMAGE_URL);
    if (fallback) return jpegResponse(fallback);
  }

  throw new Error(`Failed to load OG image for ${id}`);
}

async function fetchOg(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!response.ok) {
    return null;
  }

  return Buffer.from(await response.arrayBuffer());
}

function jpegResponse(buffer: Buffer) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": OG_IMAGE_TYPE,
    },
  });
}

async function readLocalImage(relativePath: string) {
  try {
    const buffer = await readFile(join(process.cwd(), "public", relativePath));
    return buffer;
  } catch {
    return null;
  }
}
