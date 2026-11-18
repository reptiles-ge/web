"use client";

import { useTranslations } from "next-intl";

import type { RegionSpeciesCardItem } from "@/data/regions";

import { cn } from "@/lib/cn";

type TagTone = "high" | "introduced" | "moderate";

const TAG_TONES: Record<TagTone, { chip: string; dot: string }> = {
  high: {
    chip: "bg-(--rg-venom-bg) text-(--nw-danger-fg)",
    dot: "bg-(--rg-alert)",
  },
  introduced: {
    chip: "bg-(--nw-line-soft) text-(--nw-soft)",
    dot: "bg-(--nw-muted)",
  },
  moderate: {
    chip: "bg-(--nw-warn-bg) text-(--nw-warn-fg)",
    dot: "bg-(--nw-warn-dot)",
  },
};

export function RegionSpeciesTag({
  className,
  compact = false,
  species,
}: {
  className?: string;
  compact?: boolean;
  species: RegionSpeciesCardItem;
}) {
  const t = useTranslations("regions");
  const tDanger = useTranslations("danger");
  const level = regionRiskLevel(species);
  if (!level && !species.introduced) return null;

  const tone = level ? TAG_TONES[level === "High" ? "high" : "moderate"] : null;
  const { chip, dot } = tone ?? TAG_TONES.introduced;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-[5px] rounded-full px-[9px] text-[11px] font-semibold whitespace-nowrap lg:h-[26px] lg:gap-1.5 lg:px-2.5 lg:text-[11.5px]",
        chip,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot)} />
      {level && compact ? (
        <>
          <span className="lg:hidden">{t(`riskShort.${level}`)}</span>
          <span className="hidden lg:inline">{tDanger(level)}</span>
        </>
      ) : null}
      {level && !compact ? tDanger(level) : null}
      {level ? null : t("introduced")}
    </span>
  );
}

function regionRiskLevel({ danger }: RegionSpeciesCardItem) {
  return danger === "High" || danger === "Moderate" ? danger : null;
}
