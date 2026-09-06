import type { SpeciesTranslation } from "@/data/speciesTypes";
import type { Species } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { speciesEn } from "@/data/species-en";
import { speciesRu } from "@/data/species-ru";
import { speciesTr } from "@/data/species-tr";
import { mergeGallery, overlayPhotoCredit } from "@/data/speciesMedia";

const TRANSLATIONS: Record<
  Exclude<AppLocale, "ka">,
  Record<string, SpeciesTranslation>
> = {
  en: speciesEn,
  ru: speciesRu,
  tr: speciesTr,
};

export function localizeSpecies(species: Species, locale: AppLocale): Species {
  if (locale === "ka") return species;
  const translation = TRANSLATIONS[locale][species.id];
  if (!translation) return species;

  const { gallery, imageCredit, mobileImageCredit, ...text } = translation;

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
