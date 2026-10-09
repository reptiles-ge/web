import type { SpeciesTranslation } from "@/data/speciesTypes";
import type { PhotoCredit, Species } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { localizeCreditPerson, localizeCreditPlace } from "@/data/creditNames";
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

  const credit = (value?: PhotoCredit) =>
    value
      ? {
          ...value,
          ...(value.location
            ? { location: localizeCreditPlace(value.location, locale) }
            : {}),
          ...(value.photographer
            ? { photographer: localizeCreditPerson(value.photographer, locale) }
            : {}),
        }
      : undefined;
  const imageCreditOut = credit(localizedCredit);
  const mobileImageCreditOut = credit(localizedMobileCredit);

  return {
    ...species,
    ...text,
    ...(species.audio?.location
      ? {
          audio: {
            ...species.audio,
            location: localizeCreditPlace(species.audio.location, locale),
          },
        }
      : {}),
    gallery: mergeGallery(species.gallery, gallery).map((item) =>
      item.credit ? { ...item, credit: credit(item.credit) } : item,
    ),
    ...(imageCreditOut ? { imageCredit: imageCreditOut } : {}),
    ...(mobileImageCreditOut
      ? { mobileImageCredit: mobileImageCreditOut }
      : {}),
  };
}
