import type { GalleryImage, SpeciesFieldRecord } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { HALYOMORPHA_RANGE_GEOJSON } from "@/data/halyomorphaRangeRegions";
import {
  DEFAULT_CONFIRMED_RECORD_THRESHOLD,
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
  confirmedThreshold = DEFAULT_CONFIRMED_RECORD_THRESHOLD,
  ...input
}: OccurrenceInput & { confirmedThreshold?: number }) {
  const records =
    input.fieldRecords.length > 0 ? getHalyomorphaFieldRecords(input) : [];
  return getHalyomorphaOccurrenceSummary(
    records,
    input.locale,
    confirmedThreshold,
  );
}

export function getRegionOccurrenceRecords(input: OccurrenceInput) {
  if (input.fieldRecords.length === 0) return [];
  const records = getHalyomorphaFieldRecords(input);
  return HALYOMORPHA_RANGE_GEOJSON.features.flatMap((feature) =>
    getHalyomorphaRegionRecords(records, feature.properties.id),
  );
}
