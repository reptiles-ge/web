import { speciesEn } from "@/data/species-en";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

export function localizeSpecies(species: Species, locale: AppLocale): Species {
  if (locale === "ka") return species;
  const translation = speciesEn[species.id];
  if (!translation) return species;
  return {
    ...species,
    ...translation,
  };
}
