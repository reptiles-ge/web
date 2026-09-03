import type { GalleryImage, Species, SpeciesStat } from "@/data/species";

import { type AnimalGroup, groupHasVenomConcept } from "@/data/speciesAtlas";

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
  "იხ. ჩამონათვალი",
  "იხ. ჩეკლისტი",
  "იხ. iucn / ეროვნული მონაცემები",
  "იხ. tarkhnishvili et al. 2026",
];

const PLACEHOLDER_BODY_MARKERS = [
  "იხილეთ ჩამონათვალ",
  "იხილეთ ჩეკლისტ",
  "see checklist account",
  "იხილეთ tarkhnishvili",
  "see tarkhnishvili et al. 2026",
  "არ არის გამოგონილი",
  "is not invented",
  "administrative regions are not inferred",
  "რეგიონები არ არის გამოგონილი",
];

export function getSpeciesHeroSources(species: Species) {
  const gallery: GalleryImage[] = hasRealSpeciesPhotos(species)
    ? (species.gallery.length > 0
        ? species.gallery
        : [{ credit: species.imageCredit, src: species.image }]
      ).filter((item) => !isPlaceholderMedia(item.src))
    : [];
  const primary = gallery[0];
  const mobileHeroSrc =
    species.mobileImage && !isPlaceholderMedia(species.mobileImage)
      ? species.mobileImage
      : null;
  const desktopHeroSrc =
    species.image && !isPlaceholderMedia(species.image)
      ? species.image
      : (primary?.src ?? null);

  return { desktopHeroSrc, gallery, mobileHeroSrc, primary };
}

export function hasRealSpeciesPhotos(species: Species) {
  if (!isPlaceholderMedia(species.image)) return true;
  if (species.mobileImage && !isPlaceholderMedia(species.mobileImage)) {
    return true;
  }
  return species.gallery.some((item) => !isPlaceholderMedia(item.src));
}

export function isPlaceholderMedia(src: null | string | undefined) {
  if (!src) return true;
  return PLACEHOLDER_MEDIA.some((item) => src.includes(item));
}

export function isPlaceholderStatValue(value: string) {
  const normalized = value.trim().toLowerCase();
  return PLACEHOLDER_STAT_VALUES.some((item) => normalized === item);
}

const SAFETY_STAT_LABELS = new Set([
  "Handling",
  "Human risk",
  "İnsan riski",
  "Tutma",
  "Venom",
  "Zehir",
  "Обращение",
  "Риск для человека",
  "Яд",
  "ადამიანის რისკი",
  "მოპყრობა",
  "შხამი",
]);

export function filterDisplayStats(stats: SpeciesStat[], group?: AnimalGroup) {
  return stats.filter((stat) => {
    const value = stat.value.trim();
    if (!value) return false;
    if (isPlaceholderStatValue(value)) return false;
    if (
      group &&
      !groupHasVenomConcept(group) &&
      SAFETY_STAT_LABELS.has(stat.label)
    ) {
      return false;
    }
    return true;
  });
}

const SIZE_LABELS = new Set([
  "Boyut",
  "Length",
  "Size",
  "Uzunluk",
  "Длина",
  "Размер",
  "ზომა",
  "სიგრძე",
]);
const HABITAT_LABELS = new Set([
  "Habitat",
  "Yaşam alanı",
  "Местообитание",
  "ჰაბიტატი",
]);
const ACTIVITY_LABELS = new Set([
  "Activity",
  "Aktivite",
  "Gürcistan'daki durum",
  "Mevsim",
  "Season",
  "Status in Georgia",
  "Активность",
  "Сезон",
  "Статус в Грузии",
  "აქტიურობა",
  "სეზონი",
  "სტატუსი საქართველოში",
]);

export function getSpeciesActivityStat(species: Species) {
  return getStatByLabels(species, ACTIVITY_LABELS);
}

export function getSpeciesHabitatStat(species: Species) {
  return getStatByLabels(species, HABITAT_LABELS);
}

export function getSpeciesSizeStat(species: Species) {
  return getStatByLabels(species, SIZE_LABELS);
}

export function hasRealIdentification(
  identification: Species["identification"],
) {
  if (!identification) return false;
  const traits: string[] = [];
  for (const trait of identification.traits) {
    const trimmed = trait.trim();
    if (trimmed) traits.push(trimmed);
  }
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

export function isPlaceholderBody(text: string) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return true;
  return PLACEHOLDER_BODY_MARKERS.some((marker) => normalized.includes(marker));
}

function getStatByLabels(species: Species, labels: Set<string>) {
  const found = filterDisplayStats(species.stats).find((stat) =>
    labels.has(stat.label),
  );
  return found?.value ?? null;
}
