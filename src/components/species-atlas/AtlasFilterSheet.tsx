"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Drawer } from "vaul";

import type { AppLocale } from "@/i18n/routing";

import { localizeRegionText, regions } from "@/data/mapRegions";
import {
  type AnimalGroup,
  type AtlasFilters,
  defaultAtlasFilters,
  type HabitatTag,
} from "@/data/speciesAtlas";
import { cn } from "@/lib/cn";

const GROUP_OPTIONS: Array<"all" | AnimalGroup> = [
  "all",
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "spider",
];

const DANGER_OPTIONS = ["all", "venomous", "harmless"] as const;

const HABITAT_OPTIONS: Array<"all" | HabitatTag> = [
  "all",
  "forest",
  "mountain",
  "wetland",
  "grassland",
];

type AtlasFilterSheetProps = {
  filters: AtlasFilters;
  locale: AppLocale;
  onApply: (next: AtlasFilters) => void;
  onClose: () => void;
  open: boolean;
};

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
      aria-haspopup="dialog"
      className="relative inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 md:hidden"
      onClick={onClick}
      type="button"
    >
      <SlidersHorizontal aria-hidden="true" className="size-3.5" />
      {t("filterButton")}
      {count > 0 ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white dark:text-ink">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function AtlasFilterSheet({
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

  return (
    <Drawer.Root
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open={open}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-80 bg-ink/55 backdrop-blur-[2px] md:hidden" />
        <Drawer.Content
          aria-labelledby={titleId}
          className="fixed inset-x-0 bottom-0 z-80 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-card outline-none md:hidden"
        >
          <div className="flex shrink-0 flex-col items-center px-5 pt-3">
            <Drawer.Handle className="mb-3 h-1 w-10 rounded-full bg-border" />
            <div className="flex w-full items-center justify-between gap-3 pb-4">
              <Drawer.Title
                className="font-display text-[18px] font-semibold text-foreground"
                id={titleId}
              >
                {t("filterTitle")}
              </Drawer.Title>
              <button
                aria-label={t("filterClose")}
                className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
            <SheetSection label={t("filters.type")}>
              {GROUP_OPTIONS.map((group) => (
                <SheetChip
                  active={draft.group === group}
                  key={group}
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
                  active={draft.danger === danger}
                  key={danger}
                  onClick={() => updateDraft("danger", danger)}
                >
                  {t(`danger.${danger}`)}
                </SheetChip>
              ))}
            </SheetSection>

            <SheetSection label={t("filters.habitat")}>
              {HABITAT_OPTIONS.map((habitat) => (
                <SheetChip
                  active={draft.habitat === habitat}
                  key={habitat}
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
                  active={draft.region === region.id}
                  key={region.id}
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
                className="rounded-full border border-border bg-background px-4 py-3.5 text-[14px] font-medium text-foreground transition-colors hover:border-primary/25"
                onClick={clearDraft}
                type="button"
              >
                {t("filterClear")}
              </button>
              <button
                className="rounded-full bg-primary px-4 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 dark:text-ink"
                onClick={save}
                type="button"
              >
                {t("filterApply")}
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SheetChip({
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
        "rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors",
        active
          ? "bg-primary text-white dark:text-ink"
          : "bg-secondary text-foreground/75",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function SheetSection({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="border-b border-border/70 py-5 last:border-b-0">
      <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
