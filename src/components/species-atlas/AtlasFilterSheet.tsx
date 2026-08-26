"use client";

import {
  defaultAtlasFilters,
  type AnimalGroup,
  type AtlasFilters,
  type HabitatTag,
} from "@/data/speciesAtlas";
import { localizeRegionText, regions } from "@/data/regions";
import type { AppLocale } from "@/i18n/routing";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const GROUP_OPTIONS: Array<AnimalGroup | "all"> = [
  "all",
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
];

const DANGER_OPTIONS = ["all", "venomous", "harmless"] as const;

const HABITAT_OPTIONS: Array<HabitatTag | "all"> = [
  "all",
  "forest",
  "mountain",
  "wetland",
  "grassland",
];

export function countAtlasFacets(filters: AtlasFilters) {
  let count = 0;
  if (filters.group !== "all") count += 1;
  if (filters.danger !== "all") count += 1;
  if (filters.habitat !== "all") count += 1;
  if (filters.region !== "all") count += 1;
  return count;
}

type AtlasFilterSheetProps = {
  open: boolean;
  filters: AtlasFilters;
  locale: AppLocale;
  onClose: () => void;
  onApply: (next: AtlasFilters) => void;
};

export function AtlasFilterSheet({
  open,
  filters,
  locale,
  onClose,
  onApply,
}: AtlasFilterSheetProps) {
  const t = useTranslations("speciesAtlas");
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<AtlasFilters>(filters);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setDraft(filters);
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

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

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label={t("filterClose")}
        className="absolute inset-0 bg-ink/55 backdrop-blur-[2px] animate-[search-sheet-backdrop-in_220ms_ease-out]"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-card shadow-[0_-18px_60px_rgba(14,20,17,0.28)] animate-[search-sheet-in_320ms_cubic-bezier(0.22,1,0.36,1)]">
        <div className="flex shrink-0 flex-col items-center px-5 pt-3">
          <span
            className="mb-3 h-1 w-10 rounded-full bg-border"
            aria-hidden="true"
          />
          <div className="flex w-full items-center justify-between gap-3 pb-4">
            <h2
              id={titleId}
              className="font-display text-[18px] font-semibold text-foreground"
            >
              {t("filterTitle")}
            </h2>
            <button
              type="button"
              aria-label={t("filterClose")}
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          <SheetSection label={t("filters.type")}>
            {GROUP_OPTIONS.map((group) => (
              <SheetChip
                key={group}
                active={draft.group === group}
                onClick={() => updateDraft("group", group)}
              >
                {group === "all"
                  ? t("filters.allSpecies")
                  : t(`groups.${group}`)}
              </SheetChip>
            ))}
          </SheetSection>

          <SheetSection label={t("filters.danger")}>
            {DANGER_OPTIONS.map((danger) => (
              <SheetChip
                key={danger}
                active={draft.danger === danger}
                onClick={() => updateDraft("danger", danger)}
              >
                {t(`danger.${danger}`)}
              </SheetChip>
            ))}
          </SheetSection>

          <SheetSection label={t("filters.habitat")}>
            {HABITAT_OPTIONS.map((habitat) => (
              <SheetChip
                key={habitat}
                active={draft.habitat === habitat}
                onClick={() => updateDraft("habitat", habitat)}
              >
                {habitat === "all"
                  ? t("filters.all")
                  : t(`habitats.${habitat}`)}
              </SheetChip>
            ))}
          </SheetSection>

          <SheetSection label={t("filters.region")}>
            <SheetChip
              active={draft.region === "all"}
              onClick={() => updateDraft("region", "all")}
            >
              {t("filters.allRegions")}
            </SheetChip>
            {regions.map((region) => (
              <SheetChip
                key={region.id}
                active={draft.region === region.id}
                onClick={() => updateDraft("region", region.id)}
              >
                {localizeRegionText(region.name, locale)}
              </SheetChip>
            ))}
          </SheetSection>
        </div>

        <div className="shrink-0 border-t border-border bg-card px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={clearDraft}
              className="rounded-full border border-border bg-background px-4 py-3.5 text-[14px] font-medium text-foreground transition-colors hover:border-primary/25"
            >
              {t("filterClear")}
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-primary px-4 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 dark:text-ink"
            >
              {t("filterApply")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function AtlasFilterButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 md:hidden"
      aria-haspopup="dialog"
    >
      <SlidersHorizontal className="size-3.5" aria-hidden="true" />
      {t("filterButton")}
      {count > 0 ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white dark:text-ink">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function SheetSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/70 py-5 last:border-b-0">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SheetChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors ${
        active
          ? "bg-primary text-white dark:text-ink"
          : "bg-secondary text-foreground/75"
      }`}
    >
      {children}
    </button>
  );
}
