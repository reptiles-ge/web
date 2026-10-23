import type { GalleryImage, PhotoCredit, Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { ContributorDirectory } from "@/lib/contributorCredits";

import { optimizedImgSrc } from "@/data/optimizedImages";
import { photoRights } from "@/lib/imageRights";
import { hasPhotoCoordinates } from "@/lib/photoCoordinates";
import { absoluteImageUrl } from "@/lib/site";
import { speciesPhotoAlt } from "@/lib/speciesMeta";

type SpeciesPhotoContext = Pick<Species, "commonName" | "scientificName">;

export function galleryImageObject(
  photo: GalleryImage,
  species: SpeciesPhotoContext,
  locale: AppLocale,
  contributors: ContributorDirectory,
) {
  const publishedSrc = optimizedImgSrc(photo.src);
  const url = absoluteImageUrl(publishedSrc);
  const credit = photo.credit;
  const name = speciesPhotoAlt(
    species.commonName,
    species.scientificName,
    credit,
    contributors,
  );
  const format = encodingFormat(publishedSrc);
  const contentLocation = photoContentLocation(credit);

  return {
    "@type": "ImageObject",
    caption: name,
    contentUrl: url,
    inLanguage: locale,
    name,
    url,
    ...(format ? { encodingFormat: format } : {}),
    ...photoRights(photo.src, credit, locale, contributors),
    ...(credit?.date ? { dateCreated: credit.date } : {}),
    ...(contentLocation ? { contentLocation } : {}),
  };
}

export function galleryImageObjects(
  photos: GalleryImage[],
  species: SpeciesPhotoContext,
  locale: AppLocale,
  contributors: ContributorDirectory,
) {
  const objects = [];
  for (const photo of photos) {
    if (!photo.src) continue;
    objects.push(galleryImageObject(photo, species, locale, contributors));
  }
  return objects;
}

function encodingFormat(src: string) {
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".avif")) return "image/avif";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
}

function photoContentLocation(credit?: PhotoCredit) {
  if (!credit?.location && !hasPhotoCoordinates(credit)) return undefined;
  return {
    "@type": "Place" as const,
    ...(credit.location ? { name: credit.location } : {}),
    ...(hasPhotoCoordinates(credit)
      ? {
          geo: {
            "@type": "GeoCoordinates" as const,
            latitude: credit.lat,
            longitude: credit.lng,
          },
        }
      : {}),
  };
}
