"use client";

import {
  ArrowDownWideNarrow,
  LayoutGrid,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useId, useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { AtlasDropdown } from "@/components/species-atlas/AtlasDropdown";
import { AtlasFilterSheet } from "@/components/species-atlas/AtlasFilterSheet";
import {
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import { AtlasSpeciesGrid } from "@/components/species-atlas/AtlasSpeciesGrid";
import { HabitatIcon } from "@/components/species-atlas/HabitatIcon";
import { RiskSegment } from "@/components/species-atlas/RiskSegment";
import {
  ATLAS_SORT_OPTIONS,
  type AtlasFilters,
  type AtlasSort,
  type AtlasView,
  countAtlasSpecies,
} from "@/data/atlasFilters";
import { localizeRegionText, regions } from "@/data/mapRegions";
import { type HabitatTag } from "@/data/speciesAtlasMeta";
import { type SpeciesListItem } from "@/data/speciesListItem";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

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
  onUpdateFilter: UpdateFilter;
  regionMenuOpen: boolean;
  sort: AtlasSort;
  view: AtlasView;
};

type FilterToken = { clear: () => void; key: string; label: string };

type RegionOption = { count: number; id: string; label: string };

type UpdateFilter = <K extends keyof AtlasFilters>(
  key: K,
  value: AtlasFilters[K],
) => void;

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

  const regionOptions = useMemo(
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
        <div className="relative z-5 lg:rounded-[30px] lg:bg-card lg:px-[18px] lg:pt-[18px] lg:pb-3.5 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]">
          <div className="flex items-center gap-2 px-5 lg:gap-2.5 lg:px-0">
            <SearchField
              onUpdateFilter={onUpdateFilter}
              query={filters.query}
            />
            <MobileFilterButton
              facetCount={facetCount}
              onOpenFilters={onOpenFilters}
            />
            <DesktopControls
              onChangeSort={onChangeSort}
              onChangeView={onChangeView}
              onRegionMenuChange={onRegionMenuChange}
              onUpdateFilter={onUpdateFilter}
              region={filters.region}
              regionMenuOpen={regionMenuOpen}
              regionOptions={regionOptions}
              sort={sort}
              view={view}
            />
          </div>
          <GroupChips
            catalog={catalog}
            filters={filters}
            onUpdateFilter={onUpdateFilter}
          />
          <DesktopFacets filters={filters} onUpdateFilter={onUpdateFilter} />
        </div>

        <ResultsBar
          count={filtered.length}
          hasActiveFilters={hasActiveFilters}
          onChangeSort={onChangeSort}
          onResetFilters={onResetFilters}
          sort={sort}
          tokens={tokens}
        />

        {tokens.length > 0 ? (
          <MobileTokens onResetFilters={onResetFilters} tokens={tokens} />
        ) : null}

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
            <EmptyPanel group={filters.group} onReset={onResetFilters} />
          )}
        </div>
      </div>
    </section>
  );
}

function DesktopControls({
  onChangeSort,
  onChangeView,
  onRegionMenuChange,
  onUpdateFilter,
  region,
  regionMenuOpen,
  regionOptions,
  sort,
  view,
}: {
  onChangeSort: (sort: AtlasSort) => void;
  onChangeView: (view: AtlasView) => void;
  onRegionMenuChange: (open: boolean) => void;
  onUpdateFilter: UpdateFilter;
  region: string;
  regionMenuOpen: boolean;
  regionOptions: RegionOption[];
  sort: AtlasSort;
  view: AtlasView;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <div className="hidden items-center gap-2.5 lg:flex">
      <AtlasDropdown
        icon={<MapPin aria-hidden="true" className="size-4 text-primary" />}
        label={t("filters.region")}
        minWidthClassName="min-w-[220px]"
        onChange={(next) => onUpdateFilter("region", next)}
        onOpenChange={onRegionMenuChange}
        open={regionMenuOpen}
        options={regionOptions}
        value={region}
      />
      <SortDropdown
        label={t("sortLabel")}
        onChange={onChangeSort}
        options={ATLAS_SORT_OPTIONS.map((id) => ({
          id,
          label: t(`sort.${id}`),
        }))}
        value={sort}
      />
      <div
        aria-label={t("viewLabel")}
        className="flex gap-0.5 rounded-full bg-background p-1"
        role="group"
      >
        <ViewButton
          active={view === "grid"}
          label={t("view.grid")}
          onClick={() => onChangeView("grid")}
        >
          <LayoutGrid aria-hidden="true" className="size-4" />
        </ViewButton>
        <ViewButton
          active={view === "list"}
          label={t("view.list")}
          onClick={() => onChangeView("list")}
        >
          <List aria-hidden="true" className="size-4" />
        </ViewButton>
      </div>
    </div>
  );
}

function DesktopFacets({
  filters,
  onUpdateFilter,
}: {
  filters: AtlasFilters;
  onUpdateFilter: UpdateFilter;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <div className="mt-3 hidden flex-wrap items-center gap-[18px] border-t border-secondary pt-3 lg:flex">
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {t("filters.danger")}
        </span>
        <RiskSegment
          compact
          label={t("filters.danger")}
          onChange={(next) => onUpdateFilter("danger", next)}
          value={filters.danger}
        />
      </div>
      <span aria-hidden="true" className="h-[26px] w-px bg-border" />
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {t("filters.habitat")}
        </span>
        <div
          aria-label={t("filters.habitat")}
          className="flex flex-wrap gap-1.5"
          role="group"
        >
          {HABITAT_OPTIONS.filter(
            (habitat): habitat is HabitatTag => habitat !== "all",
          ).map((habitat) => {
            const active = filters.habitat === habitat;
            return (
              <button
                aria-pressed={active}
                className={cn(
                  "tap-target inline-flex h-[38px] items-center gap-[7px] rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                  active
                    ? "border-primary bg-secondary text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/40",
                )}
                key={habitat}
                onClick={() =>
                  onUpdateFilter("habitat", active ? "all" : habitat)
                }
                type="button"
              >
                <HabitatIcon className="size-[15px]" habitat={habitat} />
                {t(`habitats.${habitat}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmptyPanel({
  group,
  onReset,
}: {
  group: AtlasFilters["group"];
  onReset: () => void;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <div className="mt-3.5 rounded-3xl bg-card px-5 py-9 text-center lg:mt-[18px] lg:rounded-[32px] lg:px-8 lg:py-14 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]">
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {t("emptyEyebrow")}
      </p>
      <h3 className="mx-auto mt-2.5 max-w-[560px] font-display text-[20px] leading-tight font-semibold text-foreground lg:mt-3.5 lg:text-[28px]">
        {group === "all"
          ? t("emptyTitle")
          : t("emptyGroupTitle", { group: t(`groups.${group}`) })}
      </h3>
      <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-muted-foreground lg:mt-3 lg:text-[15px]">
        {t("emptyBody")}
      </p>
      <div className="mt-[18px] flex flex-col justify-center gap-2.5 sm:flex-row lg:mt-6">
        <button
          className="h-[50px] rounded-full bg-primary px-[22px] text-[15px] font-medium text-white lg:h-12 lg:text-[14.5px] dark:text-ink"
          onClick={onReset}
          type="button"
        >
          {t("resetFilters")}
        </button>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-[22px] text-[14.5px] font-medium text-foreground transition-colors hover:border-primary/30"
          href="/contact"
        >
          {t("suggestSpecies")}
        </Link>
      </div>
    </div>
  );
}

function GroupChips({
  catalog,
  filters,
  onUpdateFilter,
}: {
  catalog: SpeciesListItem[];
  filters: AtlasFilters;
  onUpdateFilter: UpdateFilter;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <div
      aria-label={t("filters.type")}
      className="no-scrollbar mt-2.5 flex gap-1 overflow-x-auto px-5 pb-1 lg:mt-3.5 lg:px-0 lg:pb-0"
      role="group"
    >
      {GROUP_OPTIONS.map((group) => {
        const active = filters.group === group;
        const count = countAtlasSpecies(catalog, filters, "group", group);
        return (
          <button
            aria-pressed={active}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium whitespace-nowrap transition-colors lg:gap-[7px] lg:px-[15px]",
              active
                ? "bg-foreground text-background"
                : "bg-card text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] hover:bg-secondary lg:bg-transparent lg:shadow-none",
              count === 0 && !active && "opacity-40",
            )}
            key={group}
            onClick={() => onUpdateFilter("group", group)}
            type="button"
          >
            {group === "all" ? t("filters.all") : t(`groups.${group}`)}
            <span className="text-[12px] tabular-nums opacity-70">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

function MobileFilterButton({
  facetCount,
  onOpenFilters,
}: {
  facetCount: number;
  onOpenFilters: () => void;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <button
      aria-haspopup="dialog"
      className="relative flex h-[50px] shrink-0 items-center gap-2 rounded-full bg-foreground px-4 text-[14px] font-medium text-background lg:hidden"
      onClick={onOpenFilters}
      type="button"
    >
      <SlidersHorizontal aria-hidden="true" className="size-4" />
      {t("filterButton")}
      {facetCount > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6fad88] px-[5px] text-[11.5px] font-bold text-[#0e1411]">
          {facetCount}
        </span>
      ) : null}
    </button>
  );
}

function MobileTokens({
  onResetFilters,
  tokens,
}: {
  onResetFilters: () => void;
  tokens: FilterToken[];
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <div className="no-scrollbar mt-1 flex gap-1.5 overflow-x-auto px-5 py-1.5 lg:hidden">
      {tokens.map((token) => (
        <TokenButton key={token.key} token={token} />
      ))}
      <button
        className="tap-target h-[34px] shrink-0 px-2.5 text-[13px] font-medium text-primary"
        onClick={onResetFilters}
        type="button"
      >
        {t("filterClear")}
      </button>
    </div>
  );
}

function ResultCount({ count }: { count: number }) {
  const t = useTranslations("speciesAtlas");
  return (
    <>
      {t.rich("resultsCount", {
        count,
        strong: (chunks) => (
          <strong className="font-bold text-foreground">{chunks}</strong>
        ),
      })}
    </>
  );
}

function ResultsBar({
  count,
  hasActiveFilters,
  onChangeSort,
  onResetFilters,
  sort,
  tokens,
}: {
  count: number;
  hasActiveFilters: boolean;
  onChangeSort: (sort: AtlasSort) => void;
  onResetFilters: () => void;
  sort: AtlasSort;
  tokens: FilterToken[];
}) {
  const t = useTranslations("speciesAtlas");
  const sortIndex = ATLAS_SORT_OPTIONS.indexOf(sort);

  return (
    <div className="mt-3.5 flex min-h-9 items-center justify-between gap-2.5 px-5 lg:mt-[22px] lg:gap-4 lg:px-0">
      <div className="flex flex-wrap items-center gap-2">
        <p
          aria-live="polite"
          className="text-[14.5px] text-foreground/80 lg:mr-2 lg:ml-1 lg:text-[15px]"
        >
          <ResultCount count={count} />
        </p>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          {tokens.map((token) => (
            <TokenButton key={token.key} token={token} />
          ))}
        </div>
      </div>
      {hasActiveFilters ? (
        <button
          className="hidden px-1 py-2 text-[14px] font-medium text-primary lg:block"
          onClick={onResetFilters}
          type="button"
        >
          {t("resetFilters")}
        </button>
      ) : null}
      <button
        aria-label={`${t("sortLabel")}: ${t(`sort.${sort}`)}`}
        className="inline-flex h-11 items-center gap-1.5 rounded-full bg-card px-3.5 text-[13px] font-medium text-foreground lg:hidden"
        onClick={() =>
          onChangeSort(
            ATLAS_SORT_OPTIONS[(sortIndex + 1) % ATLAS_SORT_OPTIONS.length] ??
              "featured",
          )
        }
        type="button"
      >
        <ArrowDownWideNarrow
          aria-hidden="true"
          className="size-3.5 text-muted-foreground"
        />
        {t(`sort.${sort}`)}
      </button>
    </div>
  );
}

function SearchField({
  onUpdateFilter,
  query,
}: {
  onUpdateFilter: UpdateFilter;
  query: string;
}) {
  const t = useTranslations("speciesAtlas");
  const searchId = useId();

  return (
    <search className="flex h-[50px] min-w-0 flex-1 items-center gap-2.5 rounded-full bg-card pr-1.5 pl-4 shadow-[0_1px_2px_rgba(14,20,17,0.05)] lg:h-[52px] lg:gap-3 lg:bg-background lg:pr-2 lg:pl-[18px] lg:shadow-none">
      <Search
        aria-hidden="true"
        className="size-[17px] shrink-0 text-muted-foreground lg:size-[18px]"
      />
      <label className="sr-only" htmlFor={searchId}>
        {t("searchPlaceholder")}
      </label>
      <input
        autoComplete="off"
        className="h-full min-w-0 flex-1 appearance-none bg-transparent text-[16px] font-medium text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        enterKeyHint="search"
        id={searchId}
        onChange={(event) => onUpdateFilter("query", event.target.value)}
        placeholder={t("searchPlaceholder")}
        type="search"
        value={query}
      />
      {query ? (
        <button
          aria-label={t("clearSearch")}
          className="tap-target flex size-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground lg:size-9 lg:bg-card"
          onClick={() => onUpdateFilter("query", "")}
          type="button"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </search>
  );
}

function SortDropdown({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: AtlasSort) => void;
  options: Array<{ id: AtlasSort; label: string }>;
  value: AtlasSort;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AtlasDropdown
      alignRight
      icon={
        <ArrowDownWideNarrow
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      }
      label={label}
      onChange={(next) => onChange(next as AtlasSort)}
      onOpenChange={setOpen}
      open={open}
      options={options}
      value={value}
      widthClassName="w-[220px]"
    />
  );
}

function TokenButton({ token }: { token: FilterToken }) {
  const t = useTranslations("speciesAtlas");
  return (
    <button
      aria-label={t("removeFilter", { label: token.label })}
      className="tap-target inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-foreground pr-1.5 pl-3 text-[13px] font-medium whitespace-nowrap text-background lg:h-8 lg:pr-2 lg:text-[12.5px]"
      onClick={token.clear}
      type="button"
    >
      {token.label}
      <span className="flex size-6 items-center justify-center rounded-full bg-background/15 lg:size-5">
        <X aria-hidden="true" className="size-[11px]" />
      </span>
    </button>
  );
}

function useFilterTokens(
  filters: AtlasFilters,
  regionOptions: RegionOption[],
  onUpdateFilter: UpdateFilter,
): FilterToken[] {
  const t = useTranslations("speciesAtlas");
  const tokens: FilterToken[] = [];
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

function ViewButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "tap-target flex size-10 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-card text-foreground shadow-[0_1px_3px_rgba(14,20,17,0.12)]"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
