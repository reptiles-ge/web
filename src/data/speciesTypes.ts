export type DangerLevel = "Harmless" | "High" | "Moderate";

export type PhotoConfidence = "georgia-field" | "placeholder" | "range-typical";

export type GalleryImage = {
  credit?: PhotoCredit;
  photoConfidence?: PhotoConfidence;
  src: string;
};

export type PhotoCredit = {
  date?: string;
  location?: string;
  photographer?: string;
  photoConfidence?: PhotoConfidence;
  url?: string;
};

export type Species = {
  audio?: SpeciesAudio;
  behavior: string;
  commonName: string;
  conservation: string;
  danger?: DangerLevel;
  description: string;
  diet: string;
  facts: string[];
  family: string;
  faq?: SpeciesFaq[];
  gallery: GalleryImage[];
  genus: string;
  habitat: string;
  id: string;
  identification?: SpeciesIdentification;
  image: string;
  imageCredit?: PhotoCredit;
  interaction?: string;
  location: string;
  mobileImage?: string;
  mobileImageCredit?: PhotoCredit;
  overview: string;
  publishedAt: string;
  scientificName: string;
  sources: SpeciesSource[];
  stats: SpeciesStat[];
  updatedAt: string;
};

export type SpeciesAudio = {
  date?: string;
  location?: string;
  recordist?: string;
  src: string;
  url?: string;
};

export type SpeciesFaq = {
  answer: string;
  question: string;
};

export type SpeciesIdentification = {
  summary: string;
  traits: string[];
};

export type SpeciesSource = {
  name: string;
  url?: string;
};

export type SpeciesStat = {
  label: string;
  value: string;
};

export type SpeciesTranslation = {
  behavior: string;
  commonName: string;
  conservation: string;
  description: string;
  diet: string;
  facts: string[];
  faq?: SpeciesFaq[];
  gallery?: GalleryImage[];
  habitat: string;
  identification?: SpeciesIdentification;
  imageCredit?: PhotoCredit;
  interaction?: string;
  location: string;
  mobileImageCredit?: PhotoCredit;
  overview: string;
  stats: SpeciesStat[];
};
