"use client";

import { Reveal } from "@/components/Reveal";
import { SpeciesCard } from "@/components/SpeciesCard";
import { getFeaturedSpecies } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

export function SpeciesCarousel() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("carousel");
  const tAtlas = useTranslations("speciesAtlas");
  const featured = useMemo(
    () => getFeaturedSpecies().map((item) => localizeSpecies(item, locale)),
    [locale],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      setProgress(max > 0 ? (track.scrollLeft / max) * 100 : 0);
    }

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 400, behavior: "smooth" });
  }

  return (
    <section id="species" className="relative bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-balance-tight text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.02]">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal className="flex flex-wrap items-center gap-3" delay={120}>
            <Link
              href="/species"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              {tAtlas("breadcrumbSpecies")}
              <ArrowUpRight className="size-3.5" />
            </Link>
            <button
              type="button"
              aria-label={t("prev")}
              onClick={() => scrollByCard(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("next")}
              onClick={() => scrollByCard(1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowRight className="size-4" />
            </button>
          </Reveal>
        </div>
        <div className="mt-8 h-px w-full bg-border">
          <div
            className="h-px bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div
        ref={trackRef}
        className="species-carousel-track no-scrollbar mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pr-6 lg:pr-10"
      >
        {featured.map((item) => (
          <div key={item.id} className="snap-start">
            <SpeciesCard species={item} />
          </div>
        ))}
        <div className="w-2 shrink-0" />
      </div>
    </section>
  );
}
