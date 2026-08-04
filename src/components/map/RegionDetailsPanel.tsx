"use client";

import { SpeciesCard } from "@/components/map/SpeciesCard";
import type { Region } from "@/data/regions";
import { getRegionSpecies, localizeRegionText } from "@/data/regions";
import type { Species } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type RegionDetailsPanelProps = {
  region: Region | null;
  onClose: () => void;
};

export function RegionDetailsPanel({ region, onClose }: RegionDetailsPanelProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("map");
  const open = Boolean(region);
  const [isDesktop, setIsDesktop] = useState(false);

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

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const species = region
    ? getRegionSpecies(region).map((item) => localizeSpecies(item, locale))
    : [];

  return (
    <AnimatePresence>
      {region ? (
        <>
          <motion.button
            type="button"
            aria-label={t("close")}
            className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px] dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="region-panel-title"
            initial={
              isDesktop
                ? { opacity: 0, x: 40 }
                : { opacity: 0, y: "100%" }
            }
            animate={
              isDesktop ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
            }
            exit={
              isDesktop
                ? { opacity: 0, x: 32 }
                : { opacity: 0, y: "100%" }
            }
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[86svh] flex-col rounded-t-[28px] border border-border bg-card shadow-[0_-24px_60px_-36px_rgba(14,20,17,0.5)] dark:border-white/10 dark:bg-[#121714] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-full lg:max-w-[440px] lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-[-24px_0_60px_-40px_rgba(14,20,17,0.45)]"
          >
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border dark:bg-white/15 lg:hidden" />
            <PanelContent
              region={region}
              species={species}
              locale={locale}
              onClose={onClose}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

type PanelContentProps = {
  region: Region;
  species: Species[];
  locale: AppLocale;
  onClose: () => void;
};

function PanelContent({
  region,
  species,
  locale,
  onClose,
}: PanelContentProps) {
  const t = useTranslations("map");

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-2 lg:pt-0">
      <div className="flex items-start justify-between gap-4 border-b border-border/80 px-6 py-5 dark:border-white/10">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {t("regionLabel")}
          </p>
          <h2
            id="region-panel-title"
            className="mt-2 font-display text-[clamp(1.55rem,3vw,2rem)] font-semibold leading-tight text-foreground"
          >
            {localizeRegionText(region.name, locale)}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground dark:border-white/12 dark:hover:border-white/25"
          aria-label={t("close")}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <motion.p
          key={`${region.id}-desc`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-[15px] leading-relaxed text-muted-foreground"
        >
          {localizeRegionText(region.description, locale)}
        </motion.p>

        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {t("species")}
          </p>
          <p className="mt-1 text-[13px] text-foreground/70">
            {t("speciesCount", { count: species.length })}
          </p>
        </div>

        {species.length > 0 ? (
          <motion.div
            key={`${region.id}-list`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.06, delayChildren: 0.12 },
              },
            }}
            className="mt-5 space-y-3 pb-4"
          >
            {species.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <SpeciesCard species={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`${region.id}-empty`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mt-6 flex flex-col items-center rounded-[24px] border border-dashed border-border bg-secondary/40 px-6 py-12 text-center dark:border-white/12 dark:bg-white/[0.03]"
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
