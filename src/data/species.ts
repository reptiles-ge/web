import { species } from "./species.generated";

export type DangerLevel = "Harmless" | "Moderate" | "High";

export type SpeciesStat = {
  label: string;
  value: string;
};

export type SpeciesFaq = {
  question: string;
  answer: string;
};

export type SpeciesIdentification = {
  summary: string;
  traits: string[];
};

export type PhotoCredit = {
  photographer: string;
  url?: string;
};

export type GalleryImage = {
  src: string;
  credit?: PhotoCredit;
};

export type SpeciesSource = {
  name: string;
  url?: string;
};

export type Species = {
  id: string;
  commonName: string;
  scientificName: string;
  genus: string;
  family: string;
  location: string;
  description: string;
  overview: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservation: string;
  danger: DangerLevel;
  image: string;
  imageCredit?: PhotoCredit;
  mobileImage?: string;
  mobileImageCredit?: PhotoCredit;
  gallery: GalleryImage[];
  stats: SpeciesStat[];
  facts: string[];
  identification?: SpeciesIdentification;
  faq?: SpeciesFaq[];
  updatedAt: string;
  sources: SpeciesSource[];
};

export const defaultSpeciesSources: SpeciesSource[] = [
  {
    name: "Scientific publications",
  },
];

export type SpeciesTranslation = {
  commonName: string;
  location: string;
  description: string;
  overview: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservation: string;
  stats: SpeciesStat[];
  facts: string[];
  identification?: SpeciesIdentification;
  faq?: SpeciesFaq[];
};

export function gallerySrcs(gallery: GalleryImage[]): string[] {
  return gallery.map((item) => item.src);
}

export function resolvePhotoCredit(
  ...credits: Array<PhotoCredit | undefined>
): PhotoCredit | undefined {
  return credits.find(Boolean);
}

export const dangerLabels: Record<DangerLevel, string> = {
  Harmless: "უვნებელი",
  Moderate: "საშუალო",
  High: "მაღალი",
};

export const images = {
  hero: "https://cdn.reptiles.ge/hero-img.webp",
  detail: "https://cdn.reptiles.ge/vipera-dinnik-3.webp",
  cta: "https://cdn.reptiles.ge/landing-cta-cover.jpeg",
};

export const featuredSpeciesIds = [
  "vipera-dinniki",
  "macrovipera-lebetina",
  "vipera-kaznakovi",
  "vipera-transcaucasiana",
  "vipera-darevskii",
  "vipera-renardi",
  "coronella-austriaca",
  "elaphe-urartica",
  "elaphe-dione",
  "natrix-tessellata",
  "natrix-natrix",
  "dolichophis-schmidti",
  "platyceps-najadum",
  "telescopus-fallax",
  "pseudopus-apodus",
] as const;

export const catalogSpeciesIds = [...featuredSpeciesIds] as const;

export { species };

export function getSpeciesById(id: string) {
  return species.find((item) => item.id === id);
}

export function getFeaturedSpecies() {
  return featuredSpeciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
}

export function getCatalogSpecies() {
  return catalogSpeciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
}

export function dangerClass(danger: DangerLevel) {
  switch (danger) {
    case "High":
      return "bg-destructive/15 text-destructive";
    case "Moderate":
      return "bg-gold/20 text-gold";
    default:
      return "bg-primary/15 text-primary";
  }
}
