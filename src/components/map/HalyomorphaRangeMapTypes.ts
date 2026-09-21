import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";

export type HalyomorphaFieldRecord = {
  accessibleLabel: string;
  author?: string;
  date?: string;
  formattedDate?: string;
  galleryHref?: string;
  gallerySrc?: string;
  id: string;
  imageAlt: string;
  kind: "location" | "photo";
  lat: number;
  lng: number;
  locality: string;
  note?: string;
  source?: string;
  thumbSrc?: string;
  url?: string;
};

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
  resetMapLabel: string;
  sourceAction: string;
};

export type HalyomorphaRangeMapProps = {
  copy: HalyomorphaRangeMapCopy;
  fieldRecords: HalyomorphaFieldRecord[];
  officialRange: HalyomorphaRangeRegionFeatureCollection;
};
