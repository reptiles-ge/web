"use client";

import type { ReactNode } from "react";

import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import type { DangerLevel, Species } from "@/data/speciesTypes";

import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";

type SpeciesDangerProps = {
  label?: string;
  level?: DangerLevel;
  linked?: boolean;
  linkToDangerPage?: boolean;
  value?: string;
  variant?: "card" | "hero";
};

export function SpeciesDanger({
  label: labelOverride,
  level,
  linked = false,
  linkToDangerPage = true,
  value: valueOverride,
  variant = "hero",
}: SpeciesDangerProps) {
  const tCard = useTranslations("card");
  const tDanger = useTranslations("danger");
  const tone = levelTone(level);
  const label = labelOverride ?? tCard("dangerLevel");
  const value = valueOverride ?? (level ? tDanger(level) : "");

  if (!value) return null;

  if (variant === "card") {
    return (
      <DangerShell
        label={label}
        level={level}
        linked={linked && linkToDangerPage}
        value={value}
      >
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-white/50">
            <Shield aria-hidden="true" className="size-3 opacity-70" />
            {label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider",
              tone.chip,
            )}
          >
            <span
              aria-hidden="true"
              className={cn("size-1.5 rounded-full", tone.dot)}
            />
            {value}
          </span>
        </div>
      </DangerShell>
    );
  }

  return (
    <DangerShell
      label={label}
      level={level}
      linked={linked && linkToDangerPage}
      value={value}
    >
      <span
        className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 backdrop-blur-md"
        title={linked && linkToDangerPage ? undefined : `${label}: ${value}`}
      >
        <Shield aria-hidden="true" className="size-3.5 text-white/45" />
        <span className="text-[11px] tracking-[0.14em] text-white/45">
          {label}
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-white/15" />
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide",
            tone.valueHero,
          )}
        >
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", tone.dot)}
          />
          {value}
        </span>
      </span>
    </DangerShell>
  );
}

export function SpeciesRiskChip({
  linked = false,
  species,
  variant = "hero",
}: {
  linked?: boolean;
  species: Pick<Species, "danger" | "id">;
  variant?: "card" | "hero";
}) {
  const group = getSpeciesAtlasMeta(species.id).group;
  const chip = getSpeciesRiskChip(species, group);
  if (!chip) return null;

  return (
    <SpeciesDanger
      level={chip.level}
      linked={linked && usesDangerScale(group)}
      linkToDangerPage={usesDangerScale(group)}
      variant={variant}
    />
  );
}

function DangerShell({
  children,
  label,
  level,
  linked,
  value,
}: {
  children: ReactNode;
  label: string;
  level?: DangerLevel;
  linked: boolean;
  value: string;
}) {
  const tDanger = useTranslations("danger");

  if (!linked || !level) {
    return children;
  }

  return (
    <Link
      aria-label={tDanger("linkAria", { label, value })}
      className="inline-flex rounded-full outline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white/50"
      href={dangerPageHref(level)}
    >
      {children}
    </Link>
  );
}

function levelTone(level?: DangerLevel) {
  switch (level) {
    case "High":
      return {
        chip: "bg-destructive/15 text-destructive",
        dot: "bg-destructive",
        value: "text-destructive",
        valueHero: "text-[#f0a399]",
      };
    case "Moderate":
      return {
        chip: "bg-gold/20 text-gold",
        dot: "bg-gold",
        value: "text-gold",
        valueHero: "text-[#e0c078]",
      };
    default:
      return {
        chip: "bg-primary/15 text-primary",
        dot: "bg-primary",
        value: "text-primary",
        valueHero: "text-[#8fceae]",
      };
  }
}
