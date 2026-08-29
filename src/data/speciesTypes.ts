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
  photographer?: string;
  url?: string;
  location?: string;
  date?: string;
};

export type GalleryImage = {
  src: string;
  credit?: PhotoCredit;
};

export type SpeciesSource = {
  name: string;
  url?: string;
};

export type SpeciesAudio = {
  src: string;
  recordist?: string;
  url?: string;
  location?: string;
  date?: string;
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
  interaction?: string;
  danger?: DangerLevel;
  image: string;
  imageCredit?: PhotoCredit;
  mobileImage?: string;
  mobileImageCredit?: PhotoCredit;
  gallery: GalleryImage[];
  stats: SpeciesStat[];
  facts: string[];
  identification?: SpeciesIdentification;
  audio?: SpeciesAudio;
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
  interaction?: string;
  stats: SpeciesStat[];
  facts: string[];
  identification?: SpeciesIdentification;
  faq?: SpeciesFaq[];
  gallery?: GalleryImage[];
  imageCredit?: PhotoCredit;
  mobileImageCredit?: PhotoCredit;
};
