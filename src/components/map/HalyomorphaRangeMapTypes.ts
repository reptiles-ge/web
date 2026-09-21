import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";

export type HalyomorphaFieldRecord = {
  accessibleLabel: string;
  author?: string;
  date?: string;
  formattedDate?: string;
  galleryHref: string;
  id: string;
  imageAlt: string;
  lat: number;
  lng: number;
  locality: string;
  thumbSrc: string;
};

export type HalyomorphaRangeMapCopy = {
  closeLabel: string;
  fieldRecordLabel: string;
  galleryAction: string;
  loadingLabel: string;
  mapAria: string;
  mapError: string;
  officialRegionLabel: string;
};

export type HalyomorphaRangeMapProps = {
  copy: HalyomorphaRangeMapCopy;
  fieldRecords: HalyomorphaFieldRecord[];
  officialRange: HalyomorphaRangeRegionFeatureCollection;
};
