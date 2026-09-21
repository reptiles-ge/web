import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";
import type { AppLocale } from "@/i18n/routing";
import type {
  HalyomorphaFieldRecord,
  HalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";

export type { HalyomorphaFieldRecord };

export type HalyomorphaRangeMapCopy = {
  closeLabel: string;
  fieldRecordLabel: string;
  galleryAction: string;
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noPhotoLabel: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  regionLoadingLabel: string;
  regionRecordsLabel: string;
  resetMapLabel: string;
  sourceAction: string;
};

export type HalyomorphaRangeMapProps = {
  copy: HalyomorphaRangeMapCopy;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRange: HalyomorphaRangeRegionFeatureCollection;
};
