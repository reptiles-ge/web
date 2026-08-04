import { speciesEn } from "@/data/species-en";
import type { Species } from "@/data/species";
import type { Locale } from "@/i18n/types";

export function localizeSpecies(species: Species, locale: Locale): Species {
  if (locale === "ka") return species;
  const translation = speciesEn[species.id];
  if (!translation) return species;
  return {
    ...species,
    ...translation,
  };
}
