import type { RegionPathId } from "@/data/georgia-paths";

import georgiaRegions from "../../public/geodata/georgia-regions-v1.json";

export type HalyomorphaRangeRegionFeature = {
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: {
    id: RegionPathId;
    isOfficialRange: boolean;
    shapeName: string;
  };
  type: "Feature";
};

export type HalyomorphaRangeRegionFeatureCollection = {
  features: HalyomorphaRangeRegionFeature[];
  type: "FeatureCollection";
};

export const HALYOMORPHA_RANGE_GEOJSON =
  georgiaRegions as HalyomorphaRangeRegionFeatureCollection;
