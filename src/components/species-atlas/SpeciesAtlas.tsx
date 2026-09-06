"use client";

import { useLocale } from "next-intl";
import {
  parseAsString,
  parseAsStringEnum,
  throttle,
  useQueryState,
} from "nuqs";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import type { RegionTooltipSpecies } from "@/data/mapRegions";
import type { SpeciesListItem } from "@/data/speciesListItem";

import { AtlasBrowse } from "@/components/species-atlas/AtlasBrowse";
import { AtlasMap } from "@/components/species-atlas/AtlasMap";
import {
  DANGER_OPTIONS,
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
  REGION_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import { AtlasRecent } from "@/components/species-atlas/AtlasRecent";
import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
} from "@/data/speciesAtlasMeta";
import {
  type AtlasFilters,
  countAtlasFacets,
  defaultAtlasFilters,
  filterAtlasSpecies,
} from "@/data/atlasFilters";
import { trackEvent, truncateSearchTerm } from "@/lib/analytics";

export function SpeciesAtlas({
  catalog,
  recent,
  tooltipSpeciesByRegion,
}: {
  catalog: SpeciesListItem[];
  recent: SpeciesListItem[];
  tooltipSpeciesByRegion: Record<string, RegionTooltipSpecies[]>;
}) {
  const locale = useLocale() as AppLocale;

  const [group, setGroup] = useQueryState(
    "type",
    parseAsStringEnum([...GROUP_OPTIONS]).withDefault(
      defaultAtlasFilters.group,
    ),
  );
  const [danger, setDanger] = useQueryState(
    "danger",
    parseAsStringEnum([...DANGER_OPTIONS]).withDefault(
      defaultAtlasFilters.danger,
    ),
  );
  const [habitat, setHabitat] = useQueryState(
    "habitat",
    parseAsStringEnum([...HABITAT_OPTIONS]).withDefault(
      defaultAtlasFilters.habitat,
    ),
  );
  const [region, setRegion] = useQueryState(
    "region",
    parseAsStringEnum([...REGION_OPTIONS]).withDefault(
      defaultAtlasFilters.region,
    ),
  );
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(defaultAtlasFilters.query),
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const filters = useMemo<AtlasFilters>(
    () => ({ danger, group, habitat, query, region }),
    [group, danger, habitat, region, query],
  );
  const deferredQuery = useDeferredValue(filters.query);
  const skipAtlasFilter = useRef(true);
  const lastQuery = useRef(filters.query);

  const activeFilters: AtlasFilters = useMemo(
    () => ({
      ...filters,
      query: deferredQuery,
    }),
    [filters, deferredQuery],
  );

  const filtered = useMemo(
    () => filterAtlasSpecies(catalog, activeFilters),
    [catalog, activeFilters],
  );

  useEffect(() => {
    if (skipAtlasFilter.current) {
      skipAtlasFilter.current = false;
      lastQuery.current = filters.query;
      return;
    }
    const queryChanged = lastQuery.current !== filters.query;
    lastQuery.current = filters.query;
    const delay = queryChanged ? 500 : 0;
    const timer = window.setTimeout(() => {
      const isDefault =
        filters.group === defaultAtlasFilters.group &&
        filters.danger === defaultAtlasFilters.danger &&
        filters.habitat === defaultAtlasFilters.habitat &&
        filters.region === defaultAtlasFilters.region &&
        !filters.query.trim();
      trackEvent("atlas_filter", {
        action: isDefault ? "reset" : "apply",
        danger_filter: filters.danger,
        group_filter: filters.group,
        habitat_filter: filters.habitat,
        region_filter: filters.region,
        result_count: filtered.length,
        search_term: filters.query.trim()
          ? truncateSearchTerm(filters.query)
          : undefined,
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [filters, filtered.length]);

  const groupCounts = useMemo(() => {
    const counts: Record<"all" | AnimalGroup, number> = {
      all: catalog.length,
      amphibian: 0,
      bird: 0,
      lizard: 0,
      mammal: 0,
      snake: 0,
      spider: 0,
      turtle: 0,
    };
    for (const item of catalog) {
      counts[getSpeciesAtlasMeta(item.id).group] += 1;
    }
    return counts;
  }, [catalog]);

  const facetCount = countAtlasFacets(filters);

  function updateFilter<K extends keyof AtlasFilters>(
    key: K,
    value: AtlasFilters[K],
  ) {
    switch (key) {
      case "danger":
        setDanger(value as AtlasFilters["danger"], {
          history: "replace",
          scroll: false,
          shallow: true,
        });
        break;
      case "group":
        setGroup(value as AtlasFilters["group"], {
          history: "replace",
          scroll: false,
          shallow: true,
        });
        break;
      case "habitat":
        setHabitat(value as AtlasFilters["habitat"], {
          history: "replace",
          scroll: false,
          shallow: true,
        });
        break;
      case "query":
        setQuery(value as AtlasFilters["query"], {
          history: "replace",
          limitUrlUpdates: throttle(200),
          scroll: false,
          shallow: true,
        });
        break;
      case "region":
        setRegion(value as AtlasFilters["region"], {
          history: "replace",
          scroll: false,
          shallow: true,
        });
        break;
    }
  }

  function resetFilters() {
    setGroup(defaultAtlasFilters.group, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setDanger(defaultAtlasFilters.danger, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setHabitat(defaultAtlasFilters.habitat, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setRegion(defaultAtlasFilters.region, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setQuery(defaultAtlasFilters.query, {
      history: "replace",
      limitUrlUpdates: throttle(200),
      scroll: false,
      shallow: true,
    });
  }

  function applyFilters(next: AtlasFilters) {
    setGroup(next.group, { history: "replace", scroll: false, shallow: true });
    setDanger(next.danger, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setHabitat(next.habitat, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setRegion(next.region, {
      history: "replace",
      scroll: false,
      shallow: true,
    });
    setQuery(next.query, {
      history: "replace",
      limitUrlUpdates: throttle(200),
      scroll: false,
      shallow: true,
    });
  }

  const hasActiveFilters = facetCount > 0 || filters.query.trim().length > 0;

  return (
    <>
      <AtlasBrowse
        facetCount={facetCount}
        filtered={filtered}
        filterOpen={filterOpen}
        filters={filters}
        groupCounts={groupCounts}
        hasActiveFilters={hasActiveFilters}
        locale={locale}
        onApplyFilters={applyFilters}
        onCloseFilters={() => setFilterOpen(false)}
        onOpenFilters={() => setFilterOpen(true)}
        onResetFilters={resetFilters}
        onUpdateFilter={updateFilter}
      />
      <AtlasMap tooltipSpeciesByRegion={tooltipSpeciesByRegion} />
      <AtlasRecent species={recent} />
    </>
  );
}
