"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import {
  AtlasFilterButton,
  AtlasFilterSheet,
} from "@/components/species-atlas/AtlasFilterSheet";
import {
  DANGER_OPTIONS,
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import { AtlasSpeciesGrid } from "@/components/species-atlas/AtlasSpeciesGrid";
import { type AtlasFilters } from "@/data/atlasFilters";
import { localizeRegionText, regions } from "@/data/mapRegions";
import { type AnimalGroup } from "@/data/speciesAtlasMeta";
import { type SpeciesListItem } from "@/data/speciesListItem";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type AtlasBrowseProps = {
  facetCount: number;
  filtered: SpeciesListItem[];
  filterOpen: boolean;
  filters: AtlasFilters;
  groupCounts: Record<"all" | AnimalGroup, number>;
  hasActiveFilters: boolean;
  locale: AppLocale;
  onApplyFilters: (next: AtlasFilters) => void;
  onCloseFilters: () => void;
  onOpenFilters: () => void;
  onResetFilters: () => void;
  onUpdateFilter: <K extends keyof AtlasFilters>(
    key: K,
    value: AtlasFilters[K],
  ) => void;
};

export function AtlasBrowse({
  facetCount,
  filtered,
  filterOpen,
  filters,
  groupCounts,
  hasActiveFilters,
  locale,
  onApplyFilters,
  onCloseFilters,
  onOpenFilters,
  onResetFilters,
  onUpdateFilter,
}: AtlasBrowseProps) {
  const t = useTranslations("speciesAtlas");

  return (
    <section
      className="border-b border-border bg-background py-16 lg:py-24"
      id="explorer"
    >
      <div className="mx-auto max-w-350 px-6 lg:px-10">
        <div>
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("explorerEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-display-title font-semibold text-foreground">
              {t("explorerTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {t("explorerSubtitle")}
            </p>
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          <div className="flex items-center gap-3">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">{t("searchPlaceholder")}</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground md:left-0"
              />
              <input
                className="w-full border-0 border-b border-border bg-transparent py-3 pr-8 pl-7 text-[15px] text-foreground transition-[border-color] outline-none placeholder:text-muted-foreground/70 focus:border-foreground"
                onChange={(event) =>
                  onUpdateFilter("query", event.target.value)
                }
                placeholder={t("searchPlaceholder")}
                type="search"
                value={filters.query}
              />
              {filters.query ? (
                <button
                  aria-label={t("clearSearch")}
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => onUpdateFilter("query", "")}
                  type="button"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </label>
            <AtlasFilterButton count={facetCount} onClick={onOpenFilters} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 md:mt-6">
            <p aria-live="polite" className="text-[13px] text-muted-foreground">
              {t("resultsCount", { count: filtered.length })}
            </p>
            {hasActiveFilters ? (
              <button
                className="text-[13px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                onClick={onResetFilters}
                type="button"
              >
                {t("resetFilters")}
              </button>
            ) : null}
          </div>

          <div className="mt-8 hidden md:block">
            <div
              aria-label={t("filters.type")}
              className="no-scrollbar flex gap-6 overflow-x-auto sm:gap-8"
              role="tablist"
            >
              {GROUP_OPTIONS.map((group) => {
                const active = filters.group === group;
                const count = groupCounts[group];
                return (
                  <button
                    aria-selected={active}
                    className={cn(
                      "group/tab relative shrink-0 pb-4 transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    key={group}
                    onClick={() => onUpdateFilter("group", group)}
                    role="tab"
                    type="button"
                  >
                    <span className="font-display text-[1.15rem] font-semibold tracking-tight sm:text-[1.35rem]">
                      {group === "all"
                        ? t("filters.allSpecies")
                        : t(`groups.${group}`)}
                    </span>
                    <span
                      className={cn(
                        "ml-2 align-top text-[12px] tabular-nums",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                    <span
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-px transition-colors",
                        active
                          ? "bg-foreground"
                          : "bg-transparent group-hover/tab:bg-border",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border" />

            <LensRow label={t("filters.danger")}>
              {DANGER_OPTIONS.map((danger) => (
                <LensOption
                  active={filters.danger === danger}
                  key={danger}
                  onClick={() => onUpdateFilter("danger", danger)}
                >
                  {t(`danger.${danger}`)}
                </LensOption>
              ))}
            </LensRow>

            <LensRow label={t("filters.habitat")}>
              {HABITAT_OPTIONS.map((habitat) => (
                <LensOption
                  active={filters.habitat === habitat}
                  key={habitat}
                  onClick={() => onUpdateFilter("habitat", habitat)}
                >
                  {habitat === "all"
                    ? t("filters.all")
                    : t(`habitats.${habitat}`)}
                </LensOption>
              ))}
            </LensRow>

            <div className="flex flex-col gap-2.5 border-t border-border/70 py-4 sm:flex-row sm:items-baseline sm:gap-8">
              <p className="w-24 shrink-0 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase sm:pt-0.5">
                {t("filters.region")}
              </p>
              <RegionDropdown
                label={t("filters.region")}
                locale={locale}
                onChange={(value) => onUpdateFilter("region", value)}
                value={filters.region}
              />
            </div>
          </div>
        </div>

        <AtlasFilterSheet
          filters={filters}
          locale={locale}
          onApply={onApplyFilters}
          onClose={onCloseFilters}
          open={filterOpen}
        />

        {filtered.length > 0 ? (
          <AtlasSpeciesGrid locale={locale} species={filtered} />
        ) : (
          <ComingSoonPanel
            group={filters.group !== "all" ? filters.group : null}
            onReset={onResetFilters}
          />
        )}
      </div>
    </section>
  );
}

function ComingSoonPanel({
  group,
  onReset,
}: {
  group: "all" | AnimalGroup | null;
  onReset: () => void;
}) {
  const t = useTranslations("speciesAtlas");
  const title =
    group && group !== "all"
      ? t("emptyGroupTitle", { group: t(`groups.${group}`) })
      : t("emptyTitle");

  return (
    <div className="mt-12 rounded-media border border-border bg-card px-6 py-14 text-center sm:px-10">
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {t("emptyEyebrow")}
      </p>
      <h3 className="mx-auto mt-4 max-w-lg font-display text-display-card font-semibold">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        {t("emptyBody")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
          onClick={onReset}
          type="button"
        >
          {t("resetFilters")}
        </button>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30"
          href="/contact"
        >
          {t("suggestSpecies")}
        </Link>
      </div>
    </div>
  );
}

function LensOption({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "text-[14px] transition-colors",
        active
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function LensRow({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-border/70 py-4 sm:flex-row sm:items-baseline sm:gap-8">
      <p className="w-24 shrink-0 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase sm:pt-0.5">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {children}
      </div>
    </div>
  );
}

function RegionDropdown({
  label,
  locale,
  onChange,
  value,
}: {
  label: string;
  locale: AppLocale;
  onChange: (value: string) => void;
  value: string;
}) {
  const t = useTranslations("speciesAtlas");
  const listId = useId();
  const [open, setOpen] = useState(false);
  const options = useMemo(
    () => [
      { id: "all", name: t("filters.allRegions") },
      ...regions.map((region) => ({
        id: region.id,
        name: localizeRegionText(region.name, locale),
      })),
    ],
    [locale, t],
  );
  const selected = options.find((option) => option.id === value) ?? options[0];

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div
      className="relative inline-block min-w-56"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className="inline-flex w-full items-center justify-between gap-3 rounded-full border border-border bg-card px-4 py-2.5 text-left text-[14px] font-medium text-foreground transition-colors hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        type="button"
      >
        <span className="truncate">{selected?.name}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open ? "rotate-180" : "",
          )}
        />
      </button>

      {open ? (
        <div
          className="absolute top-full left-0 z-30 mt-2 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-[8px] border border-border bg-card shadow-2xl shadow-ink/10"
          id={listId}
          role="listbox"
        >
          <div className="max-h-80 overflow-y-auto py-1">
            {options.map((option) => {
              const active = option.id === value;
              return (
                <button
                  aria-selected={active}
                  className={cn(
                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[14px] transition-colors",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  key={option.id}
                  onClick={() => choose(option.id)}
                  role="option"
                  type="button"
                >
                  <Check
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 shrink-0",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{option.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
