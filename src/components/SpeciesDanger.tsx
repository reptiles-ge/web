"use client";

import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import type { DangerLevel, Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type SpeciesDangerProps = {
  level?: DangerLevel;
  variant?: "hero" | "card";
  linked?: boolean;
  label?: string;
  value?: string;
  linkToDangerPage?: boolean;
};

function levelTone(level?: DangerLevel) {
  switch (level) {
    case "High":
      return {
        dot: "bg-destructive",
        value: "text-destructive",
        valueHero: "text-[#f0a399]",
        chip: "bg-destructive/15 text-destructive",
      };
    case "Moderate":
      return {
        dot: "bg-gold",
        value: "text-gold",
        valueHero: "text-[#e0c078]",
        chip: "bg-gold/20 text-gold",
      };
    default:
      return {
        dot: "bg-primary",
        value: "text-primary",
        valueHero: "text-[#8fceae]",
        chip: "bg-primary/15 text-primary",
      };
  }
}

function DangerShell({
  linked,
  level,
  label,
  value,
  children,
}: {
  linked: boolean;
  level?: DangerLevel;
  label: string;
  value: string;
  children: ReactNode;
}) {
  const tDanger = useTranslations("danger");

  if (!linked || !level) {
    return children;
  }

  return (
    <Link
      href={dangerPageHref(level)}
      className="inline-flex rounded-full outline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
      aria-label={tDanger("linkAria", { label, value })}
    >
      {children}
    </Link>
  );
}

export function SpeciesDanger({
  level,
  variant = "hero",
  linked = false,
  label: labelOverride,
  value: valueOverride,
  linkToDangerPage = true,
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
        linked={linked && linkToDangerPage}
        level={level}
        label={label}
        value={value}
      >
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-white/40">
            <Shield className="size-3 opacity-70" aria-hidden="true" />
            {label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider",
              tone.chip,
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", tone.dot)}
              aria-hidden="true"
            />
            {value}
          </span>
        </div>
      </DangerShell>
    );
  }

  return (
    <DangerShell
      linked={linked && linkToDangerPage}
      level={level}
      label={label}
      value={value}
    >
      <span
        className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 backdrop-blur-md"
        title={linked && linkToDangerPage ? undefined : `${label}: ${value}`}
      >
        <Shield className="size-3.5 text-white/45" aria-hidden="true" />
        <span className="text-[11px] tracking-[0.14em] text-white/45">
          {label}
        </span>
        <span className="h-3 w-px bg-white/15" aria-hidden="true" />
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide",
            tone.valueHero,
          )}
        >
          <span
            className={cn("size-1.5 rounded-full", tone.dot)}
            aria-hidden="true"
          />
          {value}
        </span>
      </span>
    </DangerShell>
  );
}

export function SpeciesRiskChip({
  species,
  variant = "hero",
  linked = false,
}: {
  species: Species;
  variant?: "hero" | "card";
  linked?: boolean;
}) {
  const group = getSpeciesAtlasMeta(species.id).group;
  const chip = getSpeciesRiskChip(species, group);
  if (!chip) return null;

  return (
    <SpeciesDanger
      level={chip.level}
      variant={variant}
      linked={linked && usesDangerScale(group)}
      linkToDangerPage={usesDangerScale(group)}
    />
  );
}
