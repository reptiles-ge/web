import type { Species, SpeciesStat } from "@/data/species";

const PLACEHOLDER_MEDIA = [
  "/images/species-placeholder.png",
  "/images/species-placeholder.svg",
  "/images/species-placeholder.jpg",
  "https://cdn.reptiles.ge/species-placeholder.png",
  "https://cdn.reptiles.ge/species-placeholder.svg",
  "https://cdn.reptiles.ge/species-placeholder.jpg",
];

const PLACEHOLDER_STAT_VALUES = [
  "see checklist",
  "see species account",
  "see iucn / national data",
  "see tarkhnishvili et al. 2026",
  "იხ. ჩეკლისტი",
  "იხ. iucn / ეროვნული მონაცემები",
  "იხ. tarkhnishvili et al. 2026",
];

const PLACEHOLDER_BODY_MARKERS = [
  "იხილეთ ჩეკლისტ",
  "see checklist account",
  "იხილეთ tarkhnishvili",
  "see tarkhnishvili et al. 2026",
  "არ არის გამოგონილი",
  "is not invented",
  "administrative regions are not inferred",
  "რეგიონები არ არის გამოგონილი",
];

export function isPlaceholderMedia(src: string | undefined | null) {
  if (!src) return true;
  return PLACEHOLDER_MEDIA.some((item) => src.includes(item));
}

export function hasRealSpeciesPhotos(species: Species) {
  if (!isPlaceholderMedia(species.image)) return true;
  if (species.mobileImage && !isPlaceholderMedia(species.mobileImage)) {
    return true;
  }
  return species.gallery.some((item) => !isPlaceholderMedia(item.src));
}

export function isPlaceholderStatValue(value: string) {
  const normalized = value.trim().toLowerCase();
  return PLACEHOLDER_STAT_VALUES.some((item) => normalized === item);
}

export function filterDisplayStats(stats: SpeciesStat[]) {
  return stats.filter((stat) => {
    const value = stat.value.trim();
    if (!value) return false;
    return !isPlaceholderStatValue(value);
  });
}

export function isPlaceholderBody(text: string) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return true;
  return PLACEHOLDER_BODY_MARKERS.some((marker) =>
    normalized.includes(marker),
  );
}

export function hasRealIdentification(
  identification: Species["identification"],
) {
  if (!identification) return false;
  const traits = identification.traits
    .map((trait) => trait.trim())
    .filter(Boolean);
  if (traits.length === 0) return false;
  const metaOnly = traits.every((trait) => {
    const lower = trait.toLowerCase();
    return (
      lower.includes("checklist-confirmed") ||
      lower.includes("candidate species") ||
      lower.includes("introduced in georgia") ||
      /^\d{4}$/.test(trait) ||
      /, \d{4}$/.test(trait) ||
      /^[A-Z][a-z]+idae$/.test(trait)
    );
  });
  return !metaOnly;
}
