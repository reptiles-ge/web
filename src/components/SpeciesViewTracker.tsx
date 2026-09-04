"use client";

import { useEffect } from "react";

import { getRegionsForSpecies } from "@/data/regions";
import { type AnimalGroup } from "@/data/speciesAtlas";
import { trackEvent } from "@/lib/analytics";

export function SpeciesViewTracker({
  galleryCount,
  group,
  hasIdentification,
  scientificName,
  speciesId,
}: {
  galleryCount: number;
  group: AnimalGroup;
  hasIdentification: boolean;
  scientificName: string;
  speciesId: string;
}) {
  useEffect(() => {
    trackEvent("species_view", {
      group,
      has_gallery: galleryCount > 0,
      has_identification: hasIdentification,
      has_range: getRegionsForSpecies(speciesId).length > 0,
      page_type: "species",
      scientific_name: scientificName,
      species_id: speciesId,
    });
  }, [galleryCount, group, hasIdentification, scientificName, speciesId]);

  return null;
}
