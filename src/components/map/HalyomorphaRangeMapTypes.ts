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

export type HalyomorphaRangeMapCopy = {
  closeLabel: string;
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
  regionLoadingLabel: string;
  regionRecordsLabel: string;
  regionSelectActionLabel: string;
  resetMapLabel: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
};

export type HalyomorphaRangeMapProps = {
  copy: HalyomorphaRangeMapCopy;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRange: HalyomorphaRangeRegionFeatureCollection;
  regionNames: Pick<HalyomorphaRegionSummary, "id" | "name">[];
};
