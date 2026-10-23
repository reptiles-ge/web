import type {
  PhotoCredit,
  Species,
  SpeciesTranslation,
} from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { localizeCreditPerson, localizeCreditPlace } from "@/data/creditNames";
import { mergeGallery, overlayPhotoCredit } from "@/data/speciesMedia";

export function applySpeciesTranslation(
  species: Species,
  translation: SpeciesTranslation,
  locale: AppLocale,
): Species {
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
