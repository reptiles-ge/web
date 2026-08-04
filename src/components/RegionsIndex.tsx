"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getRegionContent } from "@/data/regionContent";
import {
  getCatalogRegionStats,
  localizeRegionText,
  regions,
  type Region,
} from "@/data/regions";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function RegionsIndex() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("regions");
  const stats = getCatalogRegionStats();

  return (
    <div className="min-h-screen bg-background">
      <header
        className="fixed inset-x-0 z-50"
        style={{ top: "var(--beta-banner-height, 0px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
            style={{
              background: "color-mix(in oklab, var(--ink) 55%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
            }}
          />
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo
              size={44}
              priority
              showWordmark
              wordmarkClassName="hidden text-[17px] text-white sm:inline"
            />
          </Link>
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <SpeciesSearch variant="dark" />
            <ThemeToggle variant="dark" />
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </header>

      <main>
        <section className="relative h-[58svh] min-h-[380px] w-full overflow-hidden bg-ink lg:h-[62svh]">
          <Image
            src={images.cta}
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_25%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
            <Reveal>
              <Link
                href="/#atlas"
                className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5" />
                {t("back")}
              </Link>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-balance-tight text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] text-white">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/70 backdrop-blur-md">
                  {t("statRegions", { count: stats.regionCount })}
                </span>
                <span className="rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/70 backdrop-blur-md">
                  {t("statSpecies", { count: stats.speciesCount })}
                </span>
                <span className="rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/70 backdrop-blur-md">
                  {t("statVenomous", { count: stats.venomousCount })}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0 map-explorer-texture"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("mapEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05] text-foreground">
                {t("mapTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                {t("mapSubtitle")}
              </p>
            </Reveal>
            <div className="mt-12 lg:mt-16">
              <GeorgiaMap selectionMode="navigate" />
            </div>
            <p className="mt-8 text-center text-[12px] tracking-wide text-muted-foreground/80">
              {t("mapHint")}
            </p>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("directoryEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
                {t("directoryTitle")}
              </h2>
            </Reveal>

            <ul className="mt-14 divide-y divide-border/80 border-y border-border/80">
              {regions.map((region, index) => (
                <li key={region.id}>
                  <Reveal delay={index * 25}>
                    <RegionDirectoryRow region={region} locale={locale} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

function RegionDirectoryRow({
  region,
  locale,
}: {
  region: Region;
  locale: AppLocale;
}) {
  const t = useTranslations("regions");
  const content = getRegionContent(region.id);
  const name = localizeRegionText(region.name, locale);
  const biome = localizeRegionText(content.biome, locale);
  const overview = localizeRegionText(content.overview, locale);

  return (
    <Link
      href={`/regions/${region.id}`}
      className="group flex items-start justify-between gap-6 py-8 transition-colors sm:py-9"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-[clamp(1.3rem,2.5vw,1.75rem)] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
          <span className="text-[12px] tracking-wide text-muted-foreground">
            {t("speciesCount", { count: region.speciesIds.length })}
          </span>
        </div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary/80">
          {biome}
        </p>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground line-clamp-2">
          {overview}
        </p>
      </div>
      <ArrowUpRight className="mt-2 size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
