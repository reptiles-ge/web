"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Leaf, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { Region } from "@/data/mapRegions";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { SpeciesCard } from "@/components/map/SpeciesCard";
import { getRegionSpecies, localizeRegionText } from "@/data/regions";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { cycleTab } from "@/lib/focusTrap";
import { regionHref } from "@/lib/regionHref";

type PanelContentProps = {
  locale: AppLocale;
  onClose: () => void;
  region: Region;
  species: Species[];
};

type RegionDetailsPanelProps = {
  onClose: () => void;
  region: null | Region;
};

export function RegionDetailsPanel({
  onClose,
  region,
}: RegionDetailsPanelProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("map");
  const open = Boolean(region);
  const [isDesktop, setIsDesktop] = useState(false);
  const onCloseRef = useRef(onClose);
  const panelRef = useRef<HTMLElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    function sync() {
      setIsDesktop(media.matches);
    }
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;

    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      cycleTab(event, [panelRef.current]);
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus();
    };
  }, [open]);

  const species = region
    ? getRegionSpecies(region).map((item) => localizeSpecies(item, locale))
    : [];

  return (
    <AnimatePresence>
      {region ? (
        <>
          <m.button
            animate={{ opacity: 1 }}
            aria-label={t("close")}
            className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.25 }}
            type="button"
          />

          <m.aside
            animate={isDesktop ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
            aria-labelledby="region-panel-title"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[86svh] flex-col rounded-t-[28px] border border-border bg-card shadow-[0_-24px_60px_-36px_rgba(14,20,17,0.5)] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-full lg:max-w-[440px] lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-[-24px_0_60px_-40px_rgba(14,20,17,0.45)]"
            exit={isDesktop ? { opacity: 0, x: 32 } : { opacity: 0, y: "100%" }}
            initial={
              isDesktop ? { opacity: 0, x: 40 } : { opacity: 0, y: "100%" }
            }
            ref={panelRef}
            role="dialog"
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border lg:hidden" />
            <PanelContent
              locale={locale}
              onClose={onClose}
              region={region}
              species={species}
            />
          </m.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function PanelContent({ locale, onClose, region, species }: PanelContentProps) {
  const t = useTranslations("map");

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-2 lg:pt-0">
      <div className="flex items-start justify-between gap-4 border-b border-border/80 px-6 py-5">
        <div>
          <p className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {t("regionLabel")}
          </p>
          <h2
            className="mt-2 font-display text-display-card font-semibold text-foreground"
            id="region-panel-title"
          >
            {localizeRegionText(region.name, locale)}
          </h2>
          <Link
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
            href={regionHref(region.id)}
          >
            {t("viewRegion")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <button
          aria-label={t("close")}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <m.p
          animate={{ opacity: 1, y: 0 }}
          className="text-[15px] leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          key={`${region.id}-desc`}
          transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {localizeRegionText(region.description, locale)}
        </m.p>

        <div className="mt-8">
          <p className="text-[11px] font-medium tracking-[0.24em] text-muted-foreground uppercase">
            {t("species")}
          </p>
          <p className="mt-1 text-[13px] text-foreground/70">
            {t("speciesCount", { count: species.length })}
          </p>
        </div>

        {species.length > 0 ? (
          <m.div
            animate="show"
            className="mt-5 space-y-3 pb-4"
            initial="hidden"
            key={`${region.id}-list`}
            variants={{
              hidden: {},
              show: {
                transition: { delayChildren: 0.12, staggerChildren: 0.06 },
              },
            }}
          >
            {species.map((item) => (
              <m.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                    y: 0,
                  },
                }}
              >
                <SpeciesCard species={item} />
              </m.div>
            ))}
          </m.div>
        ) : (
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center rounded-card border border-dashed border-border bg-secondary/40 px-6 py-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            key={`${region.id}-empty`}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Leaf className="size-5" strokeWidth={1.5} />
            </div>
            <p className="mt-5 font-display text-[18px] font-medium text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-muted-foreground">
              {t("emptyBody")}
            </p>
          </m.div>
        )}
      </div>
    </div>
  );
}
