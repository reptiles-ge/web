import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";
import type { AppLocale } from "@/i18n/routing";
import type {
  HalyomorphaFieldRecord,
  HalyomorphaOccurrenceSummary,
  HalyomorphaRegionSummary,
} from "@/lib/halyomorphaOccurrences";

export const HALYOMORPHA_REGION_SELECT_EVENT = "halyomorpha-region-select";
export const HALYOMORPHA_REGION_QUERY_PARAM = "region";

export type { HalyomorphaFieldRecord };

export type HalyomorphaLazyMapProps = Pick<
  HalyomorphaRangeMapProps,
  "copy" | "locale" | "speciesId"
> & {
  officialRegionIds: string[];
};

export type HalyomorphaRangeMapCopy = {
  closeLabel: string;
  confirmedStatusLabel: string;
  fieldRecordLabel: string;
  galleryAction: string;
  iNaturalistRecordLabel: string;
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noPhotoLabel: string;
  noRegionRecordsLabel: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  recordedOnlyStatusLabel: string;
  regionLoadingLabel: string;
  regionRecordsLabel: string;
  regionSelectActionLabel: string;
  resetMapLabel: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
  statusColumnLabel: string;
};

export type HalyomorphaRangeMapProps = {
  copy: HalyomorphaRangeMapCopy;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRange: HalyomorphaRangeRegionFeatureCollection;
  regionNames: Pick<HalyomorphaRegionSummary, "id" | "name">[];
  speciesId: string;
};
