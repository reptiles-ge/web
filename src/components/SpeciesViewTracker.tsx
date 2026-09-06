"use client";

import { useEffect } from "react";

import { type AnimalGroup } from "@/data/speciesAtlasMeta";
import { trackEvent } from "@/lib/analytics";

export function SpeciesViewTracker({
  galleryCount,
  group,
  hasIdentification,
  hasRange,
  scientificName,
  speciesId,
}: {
  galleryCount: number;
  group: AnimalGroup;
  hasIdentification: boolean;
  hasRange: boolean;
  scientificName: string;
  speciesId: string;
}) {
  useEffect(() => {
    trackEvent("species_view", {
      group,
      has_gallery: galleryCount > 0,
      has_identification: hasIdentification,
      has_range: hasRange,
      page_type: "species",
      scientific_name: scientificName,
      species_id: speciesId,
    });
  }, [
    galleryCount,
    group,
    hasIdentification,
    hasRange,
    scientificName,
    speciesId,
  ]);

  return null;
}
