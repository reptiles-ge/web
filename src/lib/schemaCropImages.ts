import { schemaImageCrops } from "@/data/schemaImages";

export function schemaCropImageObjects<Rights extends object>(
  src: null | string | undefined,
  rights: Rights,
) {
  if (!src) return [];
  return schemaImageCrops(src).map((crop) =>
    schemaImageObject(
      crop.url,
      { height: crop.height, width: crop.width },
      rights,
    ),
  );
}

export function schemaImageObject<Rights extends object>(
  url: string,
  dimensions: { height?: number; width?: number },
  rights: Rights,
) {
  return {
    "@type": "ImageObject" as const,
    contentUrl: url,
    url,
    ...dimensions,
    ...rights,
  };
}
