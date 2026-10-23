import {
  DANGER_OPTIONS,
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import {
  ATLAS_SORT_OPTIONS,
  type AtlasFilters,
  type AtlasSort,
  defaultAtlasFilters,
} from "@/data/atlasFilters";
import { regions } from "@/data/mapRegions";

export type AtlasQuery = {
  filters: AtlasFilters;
  page: number;
  sort: AtlasSort;
};

export const defaultAtlasQuery: AtlasQuery = {
  filters: defaultAtlasFilters,
  page: 1,
  sort: "featured",
};

const QUERY_MAX_LENGTH = 100;
const PAGE = /^[1-9]\d{0,3}$/;
const REGION_IDS = new Set<string>(regions.map((region) => region.id));

export function atlasQueryParams({ filters, page, sort }: AtlasQuery) {
  const params = new URLSearchParams();
  if (filters.group !== "all") params.set("group", filters.group);
  if (filters.danger !== "all") params.set("danger", filters.danger);
  if (filters.habitat !== "all") params.set("habitat", filters.habitat);
  if (filters.region !== "all") params.set("region", filters.region);
  const q = filters.query.trim();
  if (q) params.set("q", q);
  if (sort !== defaultAtlasQuery.sort) params.set("sort", sort);
  if (page !== 1) params.set("page", String(page));
  return params;
}

export function parseAtlasQueryParams(
  params: URLSearchParams,
): AtlasQuery | null {
  const group = params.get("group") ?? "all";
  const danger = params.get("danger") ?? "all";
  const habitat = params.get("habitat") ?? "all";
  const region = params.get("region") ?? "all";
  const query = params.get("q")?.trim() ?? "";
  const sort = params.get("sort") ?? defaultAtlasQuery.sort;
  const page = params.get("page") ?? "1";
  if (
    !isOneOf(GROUP_OPTIONS, group) ||
    !isOneOf(DANGER_OPTIONS, danger) ||
    !isOneOf(HABITAT_OPTIONS, habitat) ||
    (region !== "all" && !REGION_IDS.has(region)) ||
    query.length > QUERY_MAX_LENGTH ||
    !isOneOf(ATLAS_SORT_OPTIONS, sort) ||
    !PAGE.test(page)
  ) {
    return null;
  }
  return {
    filters: { danger, group, habitat, query, region },
    page: Number(page),
    sort,
  };
}

function isOneOf<T extends string>(
  options: readonly T[],
  value: string,
): value is T {
  return (options as readonly string[]).includes(value);
}
