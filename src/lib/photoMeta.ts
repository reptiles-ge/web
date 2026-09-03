import type { GalleryImage, PhotoCredit, Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import { absoluteImageUrl } from "@/lib/site";
import { speciesPhotoAlt } from "@/lib/speciesMeta";

type SpeciesPhotoContext = Pick<
  Species,
  "commonName" | "scientificName" | "location"
>;

function encodingFormat(src: string) {
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
}

function personNode(credit: PhotoCredit) {
  if (!credit.photographer) return undefined;
  return {
    "@type": "Person",
    name: credit.photographer,
    ...(credit.url ? { url: credit.url } : {}),
  };
}

export function galleryImageObject(
  photo: GalleryImage,
  species: SpeciesPhotoContext,
  locale: AppLocale,
) {
  const url = absoluteImageUrl(photo.src);
  const credit = photo.credit;
  const name = speciesPhotoAlt(
    species.commonName,
    species.scientificName,
    species.location,
    credit,
  );
  const format = encodingFormat(photo.src);
  const creator = credit ? personNode(credit) : undefined;

  return {
    "@type": "ImageObject",
    contentUrl: url,
    url,
    name,
    caption: name,
    inLanguage: locale,
    ...(format ? { encodingFormat: format } : {}),
    ...(creator
      ? {
          creator,
          copyrightHolder: creator,
          creditText: credit?.photographer,
        }
      : {}),
    ...(credit?.date ? { dateCreated: credit.date } : {}),
    ...(credit?.location
      ? {
          contentLocation: {
            "@type": "Place",
            name: credit.location,
          },
        }
      : {}),
  };
}

export function galleryImageObjects(
  photos: GalleryImage[],
  species: SpeciesPhotoContext,
  locale: AppLocale,
) {
  const objects = [];
  for (const photo of photos) {
    if (!photo.src) continue;
    objects.push(galleryImageObject(photo, species, locale));
  }
  return objects;
}
