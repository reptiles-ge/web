"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { AppLocale } from "@/i18n/routing";

import { AtlasFilterSheet } from "@/components/species-atlas/AtlasFilterSheet";
import {
  AtlasEmptyPanel,
  type AtlasFilterToken,
  AtlasResultsBar,
} from "@/components/species-atlas/AtlasResultsBar";
import { AtlasSpeciesGrid } from "@/components/species-atlas/AtlasSpeciesGrid";
import {
  type AtlasRegionOption,
  AtlasToolbar,
  type UpdateAtlasFilter,
} from "@/components/species-atlas/AtlasToolbar";
import {
  atlasFacetCount,
  type AtlasFilters,
  type AtlasRegionLabel,
  type AtlasSort,
  type AtlasView,
} from "@/data/atlasFilters";
import { type AtlasPage } from "@/lib/atlasList";

type AtlasBrowseProps = {
  facetCount: number;
  filterOpen: boolean;
  filters: AtlasFilters;
  hasActiveFilters: boolean;
  locale: AppLocale;
  onApplyFilters: (next: AtlasFilters) => void;
  onChangeSort: (sort: AtlasSort) => void;
  onChangeView: (view: AtlasView) => void;
  onCloseFilters: () => void;
  onOpenFilters: () => void;
  onPageChange: (page: number) => void;
  onRegionMenuChange: (open: boolean) => void;
  onResetFilters: () => void;
  onRetry: () => void;
  onUpdateFilter: UpdateAtlasFilter;
  regionLabels: AtlasRegionLabel[];
  regionMenuOpen: boolean;
  results: AtlasPage;
  resultsFailed: boolean;
  resultsLoading: boolean;
  sort: AtlasSort;
  view: AtlasView;
};

export function AtlasBrowse({
  facetCount,
  filterOpen,
  filters,
  hasActiveFilters,
  locale,
  onApplyFilters,
  onChangeSort,
  onChangeView,
  onCloseFilters,
  onOpenFilters,
  onPageChange,
  onRegionMenuChange,
  onResetFilters,
  onRetry,
  onUpdateFilter,
  regionLabels,
  regionMenuOpen,
  results,
  resultsFailed,
  resultsLoading,
  sort,
  view,
}: AtlasBrowseProps) {
  const { facets, total } = results;
  const t = useTranslations("speciesAtlas");

  const regionOptions = useMemo<AtlasRegionOption[]>(
    () => [
      {
        count: atlasFacetCount(facets, "region", "all"),
        id: "all",
        label: t("filters.allRegions"),
      },
      ...regionLabels.map((region) => ({
        count: atlasFacetCount(facets, "region", region.id),
        id: region.id,
        label: region.label,
      })),
    ],
    [facets, regionLabels, t],
  );

  const tokens = useFilterTokens(filters, regionOptions, onUpdateFilter);

  return (
    <section
      className="scroll-mt-24 bg-background pb-10 lg:pb-24"
      id="explorer"
    >
      <div className="mx-auto max-w-[1440px] lg:px-[60px]">
        <h2 className="sr-only">{t("explorerTitle")}</h2>
        <AtlasToolbar
          facetCount={facetCount}
          facets={facets}
          filters={filters}
          onChangeSort={onChangeSort}
          onChangeView={onChangeView}
          onOpenFilters={onOpenFilters}
          onRegionMenuChange={onRegionMenuChange}
          onUpdateFilter={onUpdateFilter}
          regionMenuOpen={regionMenuOpen}
          regionOptions={regionOptions}
          sort={sort}
          view={view}
        />

        <AtlasResultsBar
          count={total}
          hasActiveFilters={hasActiveFilters}
          onChangeSort={onChangeSort}
          onResetFilters={onResetFilters}
          sort={sort}
          tokens={tokens}
        />

        <AtlasFilterSheet
          facets={facets}
          filters={filters}
          onApply={onApplyFilters}
          onClose={onCloseFilters}
          open={filterOpen}
          regionLabels={regionLabels}
          total={total}
        />

        <div className="px-5 lg:px-0">
          {resultsFailed ? (
            <p
              className="mt-3.5 flex flex-wrap items-center gap-3 rounded-2xl bg-card px-4 py-3 text-[14px] text-foreground lg:mt-[18px]"
              role="alert"
            >
              {t("loadError")}
              <button
                className="font-medium text-primary underline underline-offset-4"
                onClick={onRetry}
                type="button"
              >
                {t("loadRetry")}
              </button>
            </p>
          ) : null}
          {total > 0 ? (
            <AtlasSpeciesGrid
              loading={resultsLoading}
              locale={locale}
              onPageChange={onPageChange}
              page={results.page}
              regionLabels={regionLabels}
              species={results.items}
              total={total}
              view={view}
            />
          ) : (
            <AtlasEmptyPanel group={filters.group} onReset={onResetFilters} />
          )}
        </div>
      </div>
    </section>
  );
}

function useFilterTokens(
  filters: AtlasFilters,
  regionOptions: AtlasRegionOption[],
  onUpdateFilter: UpdateAtlasFilter,
): AtlasFilterToken[] {
  const t = useTranslations("speciesAtlas");
  const tokens: AtlasFilterToken[] = [];

  if (filters.group !== "all") {
    tokens.push({
      clear: () => onUpdateFilter("group", "all"),
      key: "group",
      label: t(`groups.${filters.group}`),
    });
  }
  if (filters.danger !== "all") {
    tokens.push({
      clear: () => onUpdateFilter("danger", "all"),
      key: "danger",
      label: t(`danger.${filters.danger}`),
    });
  }
  if (filters.habitat !== "all") {
    tokens.push({
      clear: () => onUpdateFilter("habitat", "all"),
      key: "habitat",
      label: t(`habitats.${filters.habitat}`),
    });
  }
  if (filters.region !== "all") {
    tokens.push({
      clear: () => onUpdateFilter("region", "all"),
      key: "region",
      label:
        regionOptions.find((option) => option.id === filters.region)?.label ??
        filters.region,
    });
  }
  if (filters.query.trim()) {
    tokens.push({
      clear: () => onUpdateFilter("query", ""),
      key: "query",
      label: `„${filters.query.trim()}“`,
    });
  }

  return tokens;
}
