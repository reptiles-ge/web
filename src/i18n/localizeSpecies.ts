import { speciesEn } from "@/data/species-en";
import {
  mergeGallery,
  overlayPhotoCredit,
  type Species,
} from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

export function localizeSpecies(species: Species, locale: AppLocale): Species {
  if (locale === "ka") return species;
  const translation = speciesEn[species.id];
  if (!translation) return species;

  const {
    gallery,
    imageCredit,
    mobileImageCredit,
    ...text
  } = translation;

  const localizedCredit = overlayPhotoCredit(species.imageCredit, imageCredit);
  const localizedMobileCredit = overlayPhotoCredit(
    species.mobileImageCredit,
    mobileImageCredit,
  );

  return {
    ...species,
    ...text,
    gallery: mergeGallery(species.gallery, gallery),
    ...(localizedCredit ? { imageCredit: localizedCredit } : {}),
    ...(localizedMobileCredit
      ? { mobileImageCredit: localizedMobileCredit }
      : {}),
  };
}
