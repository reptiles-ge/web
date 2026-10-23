"use client";

import { useLocale } from "next-intl";
import {
  parseAsString,
  parseAsStringEnum,
  throttle,
  useQueryState,
} from "nuqs";
import { useEffect, useMemo, useRef, useState } from "react";

import type { RegionTooltipSpecies } from "@/data/mapRegions";
import type { SpeciesListItem } from "@/data/speciesListItem";
import type { AppLocale } from "@/i18n/routing";
import type { AtlasPage } from "@/lib/atlasList";

import { OptimizedImagesProvider } from "@/components/OptimizedImagesProvider";
import { AtlasBrowse } from "@/components/species-atlas/AtlasBrowse";
import { AtlasMap } from "@/components/species-atlas/AtlasMap";
import {
  DANGER_OPTIONS,
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import { AtlasRecent } from "@/components/species-atlas/AtlasRecent";
import { AtlasTiles } from "@/components/species-atlas/AtlasTiles";
import { useAtlasPage } from "@/components/species-atlas/useAtlasResults";
import {
  type AtlasFilters,
  type AtlasRegionLabel,
  type AtlasSort,
  type AtlasView,
  countAtlasFacets,
  defaultAtlasFilters,
} from "@/data/atlasFilters";
import { trackEvent, truncateSearchTerm } from "@/lib/analytics";

type AtlasData = {
  initial: AtlasPage;
  recent: SpeciesListItem[];
  regionCount: number;
  regionLabels: AtlasRegionLabel[];
  tooltipSpeciesByRegion: Record<string, RegionTooltipSpecies[]>;
  venomousCount: number;
  venomousImage: string;
};

type UpdateAtlasFilter = <K extends keyof AtlasFilters>(
  key: K,
  value: AtlasFilters[K],
) => void;

export function SpeciesAtlas(props: AtlasData) {
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
  const regionParser = useMemo(
    () =>
      parseAsStringEnum([
        defaultAtlasFilters.region,
        ...props.regionLabels.map((label) => label.id),
      ]).withDefault(defaultAtlasFilters.region),
    [props.regionLabels],
  );
  const [region, setRegion] = useQueryState("region", regionParser);
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(defaultAtlasFilters.query),
  );

  const filters = useMemo<AtlasFilters>(
    () => ({ danger, group, habitat, query, region }),
    [group, danger, habitat, region, query],
  );

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

  return (
    <SpeciesAtlasView
      {...props}
      applyFilters={applyFilters}
      filters={filters}
      resetFilters={resetFilters}
      updateFilter={updateFilter}
    />
  );
}

export function SpeciesAtlasFallback(props: AtlasData) {
  return (
    <SpeciesAtlasView
      {...props}
      applyFilters={noop}
      filters={defaultAtlasFilters}
      resetFilters={noop}
      updateFilter={noop}
    />
  );
}

const EMPTY_ENTRIES = {};

function noop() {}

function SpeciesAtlasView({
  applyFilters,
  filters,
  initial,
  recent,
  regionCount,
  regionLabels,
  resetFilters,
  tooltipSpeciesByRegion,
  updateFilter,
  venomousCount,
  venomousImage,
}: AtlasData & {
  applyFilters: (next: AtlasFilters) => void;
  filters: AtlasFilters;
  resetFilters: () => void;
  updateFilter: UpdateAtlasFilter;
}) {
  const locale = useLocale() as AppLocale;

  const [filterOpen, setFilterOpen] = useState(false);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [sort, setSort] = useState<AtlasSort>("featured");
  const [view, setView] = useState<AtlasView>("grid");
  const [page, setPage] = useState(1);
  const resultsKey = JSON.stringify([filters, sort]);
  const [pageResultsKey, setPageResultsKey] = useState(resultsKey);
  if (pageResultsKey !== resultsKey) {
    setPageResultsKey(resultsKey);
    setPage(1);
  }
  const skipAtlasFilter = useRef(true);
  const lastQuery = useRef(filters.query);
  const {
    failed,
    loading,
    page: results,
    retry,
  } = useAtlasPage(locale, { filters, page, sort }, initial);

  useEffect(() => {
    if (loading) return;
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
        result_count: results.total,
        search_term: filters.query.trim()
          ? truncateSearchTerm(filters.query)
          : undefined,
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [filters, loading, results.total]);

  const facetCount = countAtlasFacets(filters);

  const hasActiveFilters = facetCount > 0 || filters.query.trim().length > 0;

  function openRegionMenu() {
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      setFilterOpen(true);
      return;
    }
    setRegionMenuOpen(true);
    document
      .getElementById("explorer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="bg-background pb-8 lg:pb-10">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-[60px]">
          <AtlasTiles
            filters={filters}
            groupTotals={initial.facets.group}
            onPickRegion={openRegionMenu}
            onPickVenomous={() =>
              updateFilter(
                "danger",
                filters.danger === "venomous" ? "all" : "venomous",
              )
            }
            regionCount={regionCount}
            venomousCount={venomousCount}
            venomousImage={venomousImage}
          />
        </div>
      </div>
      <OptimizedImagesProvider entries={results.entries ?? EMPTY_ENTRIES}>
        <AtlasBrowse
          facetCount={facetCount}
          filterOpen={filterOpen}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          locale={locale}
          onApplyFilters={applyFilters}
          onChangeSort={setSort}
          onChangeView={setView}
          onCloseFilters={() => setFilterOpen(false)}
          onOpenFilters={() => setFilterOpen(true)}
          onPageChange={setPage}
          onRegionMenuChange={setRegionMenuOpen}
          onResetFilters={resetFilters}
          onRetry={retry}
          onUpdateFilter={updateFilter}
          regionLabels={regionLabels}
          regionMenuOpen={regionMenuOpen}
          results={results}
          resultsFailed={failed}
          resultsLoading={loading}
          sort={sort}
          view={view}
        />
      </OptimizedImagesProvider>
      <AtlasMap tooltipSpeciesByRegion={tooltipSpeciesByRegion} />
      <AtlasRecent species={recent} />
    </>
  );
}
