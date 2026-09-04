"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { getRegionContent } from "@/data/regionContent";
import {
  getCatalogRegionStats,
  localizeRegionText,
  type Region,
  regions,
} from "@/data/regions";
import { Link } from "@/i18n/navigation";
import { regionHref } from "@/lib/speciesRoutes";

const REGIONS_HERO = "https://cdn.reptiles.ge/regions-hero-1.jpg";

export function RegionsIndex() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("regions");
  const stats = getCatalogRegionStats();

  return (
    <div className="min-h-screen bg-background">
      <div>
        <section
          className="relative flex min-h-[58svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[62svh] lg:pb-16"
          style={{
            paddingTop: "7rem",
          }}
        >
          <CoverImage
            alt={t("heroImageAlt")}
            className="object-cover object-[50%_45%]"
            priority
            sizes="100vw"
            src={REGIONS_HERO}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_25%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <div>
              <Link
                className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white sm:mb-6"
                href={{ hash: "atlas", pathname: "/" }}
              >
                <ArrowLeft className="size-3.5" />
                {t("back")}
              </Link>
              <p className="text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
                {t("eyebrow")}
              </p>
              <h1 className="text-balance-tight mt-3 max-w-3xl font-display text-display-hero font-semibold text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-5 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8">
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
            </div>
          </div>
        </section>

        <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
          <div
            aria-hidden="true"
            className="map-explorer-texture pointer-events-none absolute inset-0"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("mapEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-display-title font-semibold text-foreground">
                {t("mapTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                {t("mapSubtitle")}
              </p>
            </div>
            <div className="mt-12 lg:mt-16">
              <GeorgiaMap mapContext="region_page" selectionMode="navigate" />
            </div>
            <p className="mt-8 text-center text-[12px] tracking-wide text-muted-foreground">
              {t("mapHint")}
            </p>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("clusterEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
                {t("clusterTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("clusterBody")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                  href="/snakes/gavrtseleba"
                >
                  {t("clusterSnakes")}
                  <ArrowUpRight className="size-3.5 opacity-50" />
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                  href="/lizards/saxeoebebi"
                >
                  {t("clusterLizards")}
                  <ArrowUpRight className="size-3.5 opacity-50" />
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                  href="/turtles/saxeoebebi"
                >
                  {t("clusterTurtles")}
                  <ArrowUpRight className="size-3.5 opacity-50" />
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                  href="/amphibians/saxeoebebi"
                >
                  {t("clusterAmphibians")}
                  <ArrowUpRight className="size-3.5 opacity-50" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("directoryEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
                {t("directoryTitle")}
              </h2>
            </div>

            <ul className="mt-14 divide-y divide-border/80 border-y border-border/80">
              {regions.map((region) => (
                <li key={region.id}>
                  <div>
                    <RegionDirectoryRow locale={locale} region={region} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div>
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("seo.eyebrow")}
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-display-title font-semibold text-foreground">
                {t("seo.title")}
              </h2>
              <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
                <p>{t("seo.p1")}</p>
                <p>{t("seo.p2")}</p>
                <p>{t("dataGapBody")}</p>
              </div>
              <ul className="mt-8 max-w-3xl space-y-2 border-l-2 border-primary/25 pl-4">
                <li>
                  <Link
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                    href="/species"
                  >
                    {t("seo.links.species")}
                    <ArrowUpRight className="size-3.5 opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                    href="/venomous-snakes"
                  >
                    {t("seo.links.venomous")}
                    <ArrowUpRight className="size-3.5 opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                    href="/snakes/gavrtseleba"
                  >
                    {t("seo.links.range")}
                    <ArrowUpRight className="size-3.5 opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                    href="/"
                  >
                    {t("seo.links.home")}
                    <ArrowUpRight className="size-3.5 opacity-50" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RegionDirectoryRow({
  locale,
  region,
}: {
  locale: AppLocale;
  region: Region;
}) {
  const t = useTranslations("regions");
  const content = getRegionContent(region.id);
  const name = localizeRegionText(region.name, locale);
  const biome = localizeRegionText(content.biome, locale);
  const overview = localizeRegionText(content.overview, locale);

  return (
    <Link
      className="group flex items-start justify-between gap-6 py-8 transition-colors sm:py-9"
      href={regionHref(region.id)}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-display-card font-semibold text-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
          <span className="text-[12px] tracking-wide text-muted-foreground">
            {t("speciesCount", { count: region.speciesIds.length })}
          </span>
        </div>
        <p className="mt-2 text-[11px] font-medium tracking-[0.2em] text-primary/80 uppercase">
          {biome}
        </p>
        <p className="mt-3 line-clamp-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          {overview}
        </p>
      </div>
      <ArrowUpRight className="mt-2 size-4 shrink-0 text-muted-foreground/40 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </Link>
  );
}
