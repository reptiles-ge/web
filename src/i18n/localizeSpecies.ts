import type { Species, SpeciesTranslation } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { speciesEn } from "@/data/species-en";
import { speciesRu } from "@/data/species-ru";
import { speciesTr } from "@/data/species-tr";
import { applySpeciesTranslation } from "@/i18n/speciesTranslation";

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
  return applySpeciesTranslation(species, translation, locale);
}

export function speciesUpdatedAt(species: Species, locale: AppLocale) {
  if (locale === "ka") return species.updatedAt;
  return TRANSLATIONS[locale][species.id]?.updatedAt ?? species.updatedAt;
}
