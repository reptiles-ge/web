import type { ReactNode } from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";
import type { AppLocale } from "@/i18n/routing";
import type {
  HalyomorphaFieldRecord,
  HalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";

export const HALYOMORPHA_REGION_QUERY_PARAM = "region";

export type { HalyomorphaFieldRecord };

export type HalyomorphaLazyMapProps = {
  children?: ReactNode;
  copy: HalyomorphaRangeMapCopy;
  dataRevision: string;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRegionIds: string[];
  regionNames: HalyomorphaRangeRegionName[];
  speciesId: string;
};

export type HalyomorphaRangeMapClientProps = {
  copy: HalyomorphaRangeMapCopy;
  hatchId: string;
  hoveredRegionId: null | RegionPathId;
  onHoverRegion: (regionId: null | RegionPathId) => void;
  onOverviewChange: (atOverview: boolean) => void;
  onSelectRecord: (recordId: null | string) => void;
  onSelectRegion: (regionId: RegionPathId) => void;
  range: HalyomorphaRangeRegionFeatureCollection;
  records: HalyomorphaFieldRecord[];
  regions: HalyomorphaRangeRegionLabel[];
  resetSignal: number;
  selectedRecord: HalyomorphaSelectedRecord | null;
  selectedRegionId: null | RegionPathId;
};

export type HalyomorphaRangeMapCopy = {
  closeLabel: string;
  confirmedStatusLabel: string;
  galleryAction: string;
  latestRecordsLabel: string;
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noRegionRecordsLabel: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  recordedOnlyStatusLabel: string;
  regionRecordsLabel: string;
  regionsMetricLabel: string;
  regionSummaryTitle: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
  zoomInLabel: string;
  zoomOutLabel: string;
};

export type HalyomorphaRangeRegionLabel = {
  count: number;
  id: RegionPathId;
  name: string;
};

export type HalyomorphaRangeRegionName = {
  id: RegionPathId;
  name: string;
  pageLabel: string;
};

export type HalyomorphaSelectedRecord = {
  id: string;
  reveal: boolean;
};
