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
import { type ReactNode, useId, useState } from "react";

import { AtlasDropdown } from "@/components/species-atlas/AtlasDropdown";
import {
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import { HabitatIcon } from "@/components/species-atlas/HabitatIcon";
import { RiskSegment } from "@/components/species-atlas/RiskSegment";
import {
  ATLAS_SORT_OPTIONS,
  type AtlasFilters,
  type AtlasSort,
  type AtlasView,
  countAtlasSpecies,
} from "@/data/atlasFilters";
import { type HabitatTag } from "@/data/speciesAtlasMeta";
import { type SpeciesListItem } from "@/data/speciesListItem";
import { cn } from "@/lib/cn";

export type AtlasRegionOption = { count: number; id: string; label: string };

export type UpdateAtlasFilter = <K extends keyof AtlasFilters>(
  key: K,
  value: AtlasFilters[K],
) => void;

type AtlasToolbarProps = {
  catalog: SpeciesListItem[];
  facetCount: number;
  filters: AtlasFilters;
  onChangeSort: (sort: AtlasSort) => void;
  onChangeView: (view: AtlasView) => void;
  onOpenFilters: () => void;
  onRegionMenuChange: (open: boolean) => void;
  onUpdateFilter: UpdateAtlasFilter;
  regionMenuOpen: boolean;
  regionOptions: AtlasRegionOption[];
  sort: AtlasSort;
  view: AtlasView;
};

export function AtlasToolbar({
  catalog,
  facetCount,
  filters,
  onChangeSort,
  onChangeView,
  onOpenFilters,
  onRegionMenuChange,
  onUpdateFilter,
  regionMenuOpen,
  regionOptions,
  sort,
  view,
}: AtlasToolbarProps) {
  const t = useTranslations("speciesAtlas");

  return (
    <div className="relative z-5 lg:rounded-[30px] lg:bg-card lg:px-[18px] lg:pt-[18px] lg:pb-3.5 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]">
      <div className="flex items-center gap-2 px-5 lg:gap-2.5 lg:px-0">
        <AtlasSearchField
          onChange={(query) => onUpdateFilter("query", query)}
          query={filters.query}
        />

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

        <div className="hidden items-center gap-2.5 lg:flex">
          <AtlasDropdown
            icon={<MapPin aria-hidden="true" className="size-4 text-primary" />}
            label={t("filters.region")}
            minWidthClassName="min-w-[220px]"
            onChange={(next) => onUpdateFilter("region", next)}
            onOpenChange={onRegionMenuChange}
            open={regionMenuOpen}
            options={regionOptions}
            value={filters.region}
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
      </div>

      <AtlasGroupTabs
        catalog={catalog}
        filters={filters}
        onPick={(group) => onUpdateFilter("group", group)}
      />

      <AtlasFacetRow filters={filters} onUpdateFilter={onUpdateFilter} />
    </div>
  );
}

function AtlasFacetRow({
  filters,
  onUpdateFilter,
}: {
  filters: AtlasFilters;
  onUpdateFilter: UpdateAtlasFilter;
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

function AtlasGroupTabs({
  catalog,
  filters,
  onPick,
}: {
  catalog: SpeciesListItem[];
  filters: AtlasFilters;
  onPick: (group: AtlasFilters["group"]) => void;
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
            onClick={() => onPick(group)}
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

function AtlasSearchField({
  onChange,
  query,
}: {
  onChange: (query: string) => void;
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("searchPlaceholder")}
        type="search"
        value={query}
      />
      {query ? (
        <button
          aria-label={t("clearSearch")}
          className="tap-target flex size-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground lg:size-9 lg:bg-card"
          onClick={() => onChange("")}
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
