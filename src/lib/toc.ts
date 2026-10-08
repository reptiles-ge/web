export const SPECIES_SECTION_IDS = {
  atAGlance: "at-a-glance",
  biology: "biology",
  faq: "faq",
  gallery: "gallery",
  habitat: "habitat",
  identification: "identification",
  interaction: "human-interaction",
  lookalikes: "lookalikes",
  overview: "overview",
  range: "range",
  related: "related",
  sources: "sources",
  voice: "voice",
} as const;

export type SpeciesProfileSectionAvailability = {
  biology: boolean;
  faq: boolean;
  gallery: boolean;
  habitat: boolean;
  identification: boolean;
  range: boolean;
  sources: boolean;
};

export function speciesProfileSectionIds({
  biology,
  faq,
  gallery,
  habitat,
  identification,
  range,
  sources,
}: SpeciesProfileSectionAvailability) {
  return [
    SPECIES_SECTION_IDS.overview,
    ...(identification ? [SPECIES_SECTION_IDS.identification] : []),
    ...(gallery ? [SPECIES_SECTION_IDS.gallery] : []),
    ...(habitat
      ? [SPECIES_SECTION_IDS.habitat]
      : range
        ? [SPECIES_SECTION_IDS.range]
        : []),
    ...(biology ? [SPECIES_SECTION_IDS.biology] : []),
    ...(faq ? [SPECIES_SECTION_IDS.faq] : []),
    ...(sources ? [SPECIES_SECTION_IDS.sources] : []),
  ];
}

export const REGION_SECTION_IDS = {
  faq: "faq",
  habitats: "habitats",
  range: "range",
  related: "related",
  species: "species",
  venomous: "venomous",
} as const;
