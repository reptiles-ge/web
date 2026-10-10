"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";
import { Drawer } from "vaul";

import type { SpeciesListItem } from "@/data/speciesListItem";
import type { AppLocale } from "@/i18n/routing";

import {
  GROUP_OPTIONS,
  HABITAT_OPTIONS,
} from "@/components/species-atlas/atlasOptions";
import { HabitatIcon } from "@/components/species-atlas/HabitatIcon";
import { RiskSegment } from "@/components/species-atlas/RiskSegment";
import {
  type AtlasFilters,
  countAtlasSpecies,
  defaultAtlasFilters,
  filterAtlasSpecies,
} from "@/data/atlasFilters";
import { localizeRegionText, regions } from "@/data/mapRegions";
import { type HabitatTag } from "@/data/speciesAtlasMeta";
import { cn } from "@/lib/cn";

type AtlasFilterSheetProps = {
  catalog: SpeciesListItem[];
  filters: AtlasFilters;
  locale: AppLocale;
  onApply: (next: AtlasFilters) => void;
  onClose: () => void;
  open: boolean;
};

export function AtlasFilterSheet({
  catalog,
  filters,
  locale,
  onApply,
  onClose,
  open,
}: AtlasFilterSheetProps) {
  const t = useTranslations("speciesAtlas");
  const titleId = useId();
  const [draft, setDraft] = useState<AtlasFilters>(filters);
  const [syncedOpen, setSyncedOpen] = useState(open);
  const [syncedFilters, setSyncedFilters] = useState(filters);

  if (open !== syncedOpen) {
    setSyncedOpen(open);
    if (open) {
      setDraft(filters);
      setSyncedFilters(filters);
    }
  } else if (open && filters !== syncedFilters) {
    setSyncedFilters(filters);
    setDraft(filters);
  }

  function updateDraft<K extends keyof AtlasFilters>(
    key: K,
    value: AtlasFilters[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function clearDraft() {
    setDraft({
      ...defaultAtlasFilters,
      query: filters.query,
    });
  }

  function save() {
    onApply({
      ...draft,
      query: filters.query,
    });
    onClose();
  }

  const draftWithQuery = { ...draft, query: filters.query };
  const resultCount = open
    ? filterAtlasSpecies(catalog, draftWithQuery).length
    : 0;
  const count = <K extends keyof AtlasFilters>(
    key: K,
    value: AtlasFilters[K],
  ) => (open ? countAtlasSpecies(catalog, draftWithQuery, key, value) : 0);

  return (
    <Drawer.Root
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open={open}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-80 bg-[rgba(14,20,17,0.5)] lg:hidden" />
        <Drawer.Content
          aria-labelledby={titleId}
          className="fixed inset-x-0 bottom-0 z-80 flex max-h-[93dvh] flex-col rounded-t-[28px] bg-card shadow-[0_-20px_60px_rgba(14,20,17,0.3)] outline-none lg:hidden"
        >
          <div className="shrink-0 px-5 pt-2.5">
            <Drawer.Handle className="mx-auto h-[5px] w-10 rounded-full bg-border" />
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <Drawer.Title
                className="font-display text-[22px] font-bold tracking-[-0.01em] text-foreground"
                id={titleId}
              >
                {t("filterTitle")}
              </Drawer.Title>
              <button
                aria-label={t("filterClose")}
                className="flex size-11 items-center justify-center rounded-full bg-background text-foreground"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-5">
            <SheetSection first label={t("filters.type")}>
              <div className="flex flex-wrap gap-2">
                {GROUP_OPTIONS.map((group) => {
                  const active = draft.group === group;
                  const groupCount = count("group", group);
                  return (
                    <button
                      aria-pressed={active}
                      className={cn(
                        "inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium whitespace-nowrap",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-secondary bg-card text-foreground",
                        groupCount === 0 && !active && "opacity-45",
                      )}
                      key={group}
                      onClick={() => updateDraft("group", group)}
                      type="button"
                    >
                      {group === "all"
                        ? t("filters.all")
                        : t(`groups.${group}`)}
                      <span className="text-[12px] tabular-nums opacity-70">
                        {groupCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SheetSection>

            <SheetSection label={t("filters.danger")}>
              <RiskSegment
                label={t("filters.danger")}
                onChange={(next) => updateDraft("danger", next)}
                value={draft.danger}
              />
              <p className="mt-2.5 text-[12.5px] leading-normal text-muted-foreground">
                {t("dangerNote")}
              </p>
            </SheetSection>

            <SheetSection label={t("filters.habitat")}>
              <div className="grid grid-cols-2 gap-2">
                {HABITAT_OPTIONS.filter(
                  (habitat): habitat is HabitatTag => habitat !== "all",
                ).map((habitat) => {
                  const active = draft.habitat === habitat;
                  return (
                    <button
                      aria-pressed={active}
                      className={cn(
                        "flex min-h-14 items-center gap-2.5 rounded-[18px] border px-3.5 text-left text-foreground",
                        active
                          ? "border-primary bg-secondary"
                          : "border-secondary bg-card",
                      )}
                      key={habitat}
                      onClick={() =>
                        updateDraft("habitat", active ? "all" : habitat)
                      }
                      type="button"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-[10px] text-primary",
                          active ? "bg-card" : "bg-secondary",
                        )}
                      >
                        <HabitatIcon habitat={habitat} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] leading-tight font-semibold">
                          {t(`habitats.${habitat}`)}
                        </span>
                        <span className="mt-px block text-[11.5px] text-muted-foreground">
                          {t("speciesCount", {
                            count: count("habitat", habitat),
                          })}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </SheetSection>

            <SheetSection label={t("filters.region")}>
              <div
                aria-label={t("filters.region")}
                className="grid grid-cols-2 gap-1.5"
                role="radiogroup"
              >
                {[
                  { id: "all", label: t("filters.allRegions") },
                  ...regions.map((region) => ({
                    id: region.id,
                    label: localizeRegionText(region.name, locale),
                  })),
                ].map((option) => {
                  const active = draft.region === option.id;
                  return (
                    <button
                      aria-checked={active}
                      className={cn(
                        "flex min-h-11 items-center justify-between gap-2 rounded-[14px] border px-3 text-left text-[13px] font-medium",
                        option.id === "all" && "col-span-2",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-secondary bg-card text-foreground",
                      )}
                      key={option.id}
                      onClick={() => updateDraft("region", option.id)}
                      role="radio"
                      type="button"
                    >
                      <span className="min-w-0 truncate">{option.label}</span>
                      <span className="shrink-0 text-[11.5px] tabular-nums opacity-70">
                        {count("region", option.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SheetSection>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 border-t border-secondary bg-card px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <button
              className="h-[52px] shrink-0 rounded-full bg-background px-4 text-[15px] font-medium text-foreground"
              onClick={clearDraft}
              type="button"
            >
              {t("filterClear")}
            </button>
            <button
              className={cn(
                "h-[52px] flex-1 rounded-full text-[15.5px] font-semibold text-white dark:text-ink",
                resultCount > 0 ? "bg-primary" : "bg-muted-foreground",
              )}
              onClick={save}
              type="button"
            >
              {t("filterShowResults", { count: resultCount })}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SheetSection({
  children,
  first = false,
  label,
}: {
  children: ReactNode;
  first?: boolean;
  label: string;
}) {
  return (
    <div
      className={cn("pt-5 pb-[18px]", !first && "border-t border-secondary")}
    >
      <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}
