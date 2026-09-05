"use client";

import { m } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import type {
  Region,
  RegionTooltipSpecies,
} from "@/data/mapRegions";
import type { AppLocale } from "@/i18n/routing";

import { localizeRegionText } from "@/data/mapRegions";

type RegionTooltipProps = {
  position: null | { x: number; y: number };
  region: null | Region;
  species: RegionTooltipSpecies[];
};

export function RegionTooltip({
  position,
  region,
  species,
}: RegionTooltipProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("map");

  return (
    <AnimatePresence>
      {region && position ? (
        <m.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="pointer-events-none absolute z-20 hidden max-w-[240px] rounded-2xl border border-border/80 bg-card/95 px-4 py-3.5 shadow-[0_18px_40px_-24px_rgba(14,20,17,0.55)] backdrop-blur-md md:block"
          exit={{ opacity: 0, scale: 0.97, y: 6 }}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          key={region.id}
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, calc(-100% - 14px))",
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-[17px] leading-tight font-semibold text-foreground">
            {localizeRegionText(region.name, locale)}
          </p>
          <p className="mt-1 text-[12px] tracking-wide text-muted-foreground">
            {t("speciesCount", { count: region.speciesIds.length })}
          </p>
          {species.length > 0 ? (
            <ul className="mt-2.5 space-y-1.5 border-t border-border/70 pt-2.5">
              {species.map((item) => (
                <li className="leading-snug" key={item.id}>
                  <p className="truncate text-[12px] font-medium text-foreground/80">
                    {item.commonName}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground italic">
                    {item.scientificName}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2.5 border-t border-border/70 pt-2.5 text-[12px] text-muted-foreground">
              {t("emptyPreview")}
            </p>
          )}
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
