import { cdnOgImageUrl } from "@/lib/site";

export const alt = "ქართული გველგესლები — Reptiles";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/webp";

const ogSpeciesIds = new Set([
  "vipera-dinniki",
  "macrovipera-lebetina",
  "vipera-ammodytes",
  "vipera-kaznakovi",
  "pseudopus-apodus",
  "coronella-austriaca",
  "elaphe-urartica",
  "natrix-tessellata",
  "dolichophis-schmidti",
]);

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const speciesId = ogSpeciesIds.has(id) ? id : "vipera-dinniki";
  const response = await fetch(cdnOgImageUrl(speciesId), {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load OG image for ${speciesId}`);
  }

  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
