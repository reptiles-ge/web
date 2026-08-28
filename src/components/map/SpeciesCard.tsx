"use client";

import type { Species } from "@/data/species";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackSpeciesClick } from "@/lib/analytics";
import { speciesHref } from "@/lib/speciesRoutes";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

type SpeciesCardProps = {
  species: Species;
};

function safetyTone(level?: Species["danger"]) {
  switch (level) {
    case "High":
      return {
        dot: "bg-destructive",
        chip: "bg-destructive/12 text-destructive",
      };
    case "Moderate":
      return {
        dot: "bg-gold",
        chip: "bg-gold/15 text-gold",
      };
    default:
      return {
        dot: "bg-primary",
        chip: "bg-primary/12 text-primary",
      };
  }
}

export function SpeciesCard({ species }: SpeciesCardProps) {
  const locale = useLocale() as AppLocale;
  const tDanger = useTranslations("danger");
  const tMap = useTranslations("map");
  const riskChip = getSpeciesRiskChip(species);
  const tone = safetyTone(
    riskChip?.kind === "danger" ? riskChip.level : undefined,
  );
  const cover = species.mobileImage ?? species.image;
  const riskLabel = riskChip ? tDanger(riskChip.level) : null;

  return (
    <Link
      href={speciesHref(species.id, locale)}
      onClick={() =>
        trackSpeciesClick({
          species_id: species.id,
          source: "map_panel",
        })
      }
      className="group flex gap-3.5 rounded-2xl border border-border/80 bg-background/70 p-3 transition-all duration-300 hover:border-primary/35 hover:bg-background hover:shadow-[0_12px_28px_-20px_rgba(47,107,79,0.45)]"
    >
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-secondary">
        <Image
          src={cover}
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          fill
          loading="lazy"
          sizes="72px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[15px] font-semibold leading-tight text-foreground">
              {species.commonName}
            </h3>
            <p className="mt-0.5 truncate text-[12px] italic text-muted-foreground">
              {species.scientificName}
            </p>
          </div>
          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
        </div>
        {riskLabel ? (
          <span
            className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${tone.chip}`}
          >
            <span className={`size-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
            {riskLabel}
          </span>
        ) : null}
        <span className="sr-only">{tMap("viewSpecies")}</span>
      </div>
    </Link>
  );
}
