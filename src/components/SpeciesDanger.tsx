"use client";

import type { DangerLevel } from "@/data/species";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

type SpeciesDangerProps = {
  level: DangerLevel;
  variant?: "hero" | "card";
};

function levelTone(level: DangerLevel) {
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

export function SpeciesDanger({ level, variant = "hero" }: SpeciesDangerProps) {
  const tCard = useTranslations("card");
  const tDanger = useTranslations("danger");
  const tone = levelTone(level);
  const label = tCard("dangerLevel");
  const value = tDanger(level);

  if (variant === "card") {
    return (
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-white/40">
          <Shield className="size-3 opacity-70" aria-hidden="true" />
          {label}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider ${tone.chip}`}
        >
          <span className={`size-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          {value}
        </span>
      </div>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 backdrop-blur-md"
      title={`${label}: ${value}`}
    >
      <Shield className="size-3.5 text-white/45" aria-hidden="true" />
      <span className="text-[11px] tracking-[0.14em] text-white/45">{label}</span>
      <span className="h-3 w-px bg-white/15" aria-hidden="true" />
      <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide ${tone.valueHero}`}>
        <span className={`size-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
        {value}
      </span>
    </span>
  );
}
