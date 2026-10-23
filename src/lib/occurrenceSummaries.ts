import type { GalleryImage, SpeciesFieldRecord } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { HALYOMORPHA_RANGE_GEOJSON } from "@/data/halyomorphaRangeRegions";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
  getHalyomorphaRegionRecords,
} from "@/lib/halyomorphaOccurrences";

type OccurrenceInput = {
  fieldRecords: SpeciesFieldRecord[];
  gallery: GalleryImage[];
  locale: AppLocale;
  speciesName: string;
};

export function getOccurrenceSummary({
  speciesId,
  ...input
}: OccurrenceInput & { speciesId: string }) {
  const records =
    input.fieldRecords.length > 0 ? getHalyomorphaFieldRecords(input) : [];
  return getHalyomorphaOccurrenceSummary(
    records,
    input.locale,
    confirmedRecordThresholdForSpecies(speciesId),
  );
}

export function getRegionOccurrenceRecords(input: OccurrenceInput) {
  if (input.fieldRecords.length === 0) return [];
  const records = getHalyomorphaFieldRecords(input);
  return HALYOMORPHA_RANGE_GEOJSON.features.flatMap((feature) =>
    getHalyomorphaRegionRecords(records, feature.properties.id),
  );
}
