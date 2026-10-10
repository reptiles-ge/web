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
  type AtlasFilters,
  type AtlasSort,
  type AtlasView,
  countAtlasSpecies,
} from "@/data/atlasFilters";
import { localizeRegionText, regions } from "@/data/mapRegions";
import { type SpeciesListItem } from "@/data/speciesListItem";

type AtlasBrowseProps = {
  catalog: SpeciesListItem[];
  facetCount: number;
  filtered: SpeciesListItem[];
  filterOpen: boolean;
  filters: AtlasFilters;
  hasActiveFilters: boolean;
  locale: AppLocale;
  onApplyFilters: (next: AtlasFilters) => void;
  onChangeSort: (sort: AtlasSort) => void;
  onChangeView: (view: AtlasView) => void;
  onCloseFilters: () => void;
  onOpenFilters: () => void;
  onRegionMenuChange: (open: boolean) => void;
  onResetFilters: () => void;
  onUpdateFilter: UpdateAtlasFilter;
  regionMenuOpen: boolean;
  sort: AtlasSort;
  view: AtlasView;
};

export function AtlasBrowse({
  catalog,
  facetCount,
  filtered,
  filterOpen,
  filters,
  hasActiveFilters,
  locale,
  onApplyFilters,
  onChangeSort,
  onChangeView,
  onCloseFilters,
  onOpenFilters,
  onRegionMenuChange,
  onResetFilters,
  onUpdateFilter,
  regionMenuOpen,
  sort,
  view,
}: AtlasBrowseProps) {
  const t = useTranslations("speciesAtlas");

  const regionOptions = useMemo<AtlasRegionOption[]>(
    () => [
      {
        count: countAtlasSpecies(catalog, filters, "region", "all"),
        id: "all",
        label: t("filters.allRegions"),
      },
      ...regions.map((region) => ({
        count: countAtlasSpecies(catalog, filters, "region", region.id),
        id: region.id,
        label: localizeRegionText(region.name, locale),
      })),
    ],
    [catalog, filters, locale, t],
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
          catalog={catalog}
          facetCount={facetCount}
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
          count={filtered.length}
          hasActiveFilters={hasActiveFilters}
          onChangeSort={onChangeSort}
          onResetFilters={onResetFilters}
          sort={sort}
          tokens={tokens}
        />

        <AtlasFilterSheet
          catalog={catalog}
          filters={filters}
          locale={locale}
          onApply={onApplyFilters}
          onClose={onCloseFilters}
          open={filterOpen}
        />

        <div className="px-5 lg:px-0">
          {filtered.length > 0 ? (
            <AtlasSpeciesGrid locale={locale} species={filtered} view={view} />
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
