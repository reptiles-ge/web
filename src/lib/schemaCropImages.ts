import { schemaImageCrops } from "@/data/newsSchemaImages";

export function schemaCropImageObjects<Rights extends object>(
  src: null | string | undefined,
  rights: Rights,
) {
  if (!src) return [];
  return schemaImageCrops(src).map((crop) => ({
    "@type": "ImageObject" as const,
    contentUrl: crop.url,
    height: crop.height,
    url: crop.url,
    width: crop.width,
    ...rights,
  }));
}
