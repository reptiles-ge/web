"use client";

import type { Region } from "@/data/regions";
import { getRegionSpecies, localizeRegionText } from "@/data/regions";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { m } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type RegionTooltipProps = {
  region: Region | null;
  position: { x: number; y: number } | null;
};

export function RegionTooltip({ region, position }: RegionTooltipProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("map");

  const species = region
    ? getRegionSpecies(region)
        .map((item) => localizeSpecies(item, locale))
        .slice(0, 3)
    : [];

  return (
    <AnimatePresence>
      {region && position ? (
        <m.div
          key={region.id}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute z-20 hidden max-w-[240px] rounded-2xl border border-border/80 bg-card/95 px-4 py-3.5 shadow-[0_18px_40px_-24px_rgba(14,20,17,0.55)] backdrop-blur-md md:block"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, calc(-100% - 14px))",
          }}
        >
          <p className="font-display text-[17px] font-semibold leading-tight text-foreground">
            {localizeRegionText(region.name, locale)}
          </p>
          <p className="mt-1 text-[12px] tracking-wide text-muted-foreground">
            {t("speciesCount", { count: region.speciesIds.length })}
          </p>
          {species.length > 0 ? (
            <ul className="mt-2.5 space-y-1.5 border-t border-border/70 pt-2.5">
              {species.map((item) => (
                <li key={item.id} className="leading-snug">
                  <p className="truncate text-[12px] font-medium text-foreground/80">
                    {item.commonName}
                  </p>
                  <p className="truncate text-[11px] italic text-muted-foreground">
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
