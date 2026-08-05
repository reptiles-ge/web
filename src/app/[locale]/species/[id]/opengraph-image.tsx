import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  cdnOgImageUrl,
  cdnOgSpeciesIds,
  localOgSpeciesIds,
} from "@/lib/site";

export const alt = "ქართული გველგესლები — Reptiles";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/jpeg";

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

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (localOgSpeciesIds.has(id)) {
    const buffer = await readLocalImage(`images/og/${id}.jpg`);
    if (buffer) {
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  if (cdnOgSpeciesIds.has(id)) {
    const buffer = await fetchCdnOg(id);
    if (buffer) {
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/webp",
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
