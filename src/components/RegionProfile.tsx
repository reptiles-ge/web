"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { SpeciesCard as MapSpeciesCard } from "@/components/map/SpeciesCard";
import { Reveal } from "@/components/Reveal";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  getRegionSpecies,
  localizeRegionText,
  type Region,
} from "@/data/regions";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

type RegionProfileProps = {
  region: Region;
};

export function RegionProfile({ region }: RegionProfileProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("regions");
  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const description = localizeRegionText(region.description, locale);
  const species = useMemo(
    () =>
      getRegionSpecies(region).map((item) => localizeSpecies(item, locale)),
    [region, locale],
  );

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
              background:
                "color-mix(in oklab, var(--background) 78%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
              borderBottom: "1px solid var(--border)",
            }}
          />
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo
              size={44}
              priority
              showWordmark
              wordmarkClassName="hidden text-[17px] text-foreground sm:inline"
            />
          </Link>
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <SpeciesSearch variant="light" />
            <ThemeToggle variant="light" />
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden pt-[calc(7.5rem+var(--beta-banner-height,0px))]">
        <div
          className="pointer-events-none absolute inset-0 map-explorer-texture opacity-50"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_0%,color-mix(in_oklab,var(--primary)_11%,transparent),transparent_65%)]" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-20 lg:px-10 lg:pb-28">
          <Reveal>
            <Link
              href="/regions"
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t("allRegions")}
            </Link>
            <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {t("regionEyebrow")}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-balance-tight text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.05] text-foreground">
              {t("regionTitle", { name, nameIn })}
            </h1>
            <p className="mt-5 max-w-2xl text-balance-tight text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>

          <div className="mt-14 lg:mt-16">
            <GeorgiaMap
              highlightedIds={[region.id]}
              interactive={false}
            />
          </div>
        </div>

        <section className="relative border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("speciesEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05] text-foreground">
                {t("speciesTitle", { name, nameIn })}
              </h2>
              <p className="mt-4 text-[14px] text-muted-foreground">
                {t("speciesCount", { count: species.length })}
              </p>
            </Reveal>

            {species.length > 0 ? (
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {species.map((item, index) => (
                  <li key={item.id}>
                    <Reveal delay={index * 50}>
                      <MapSpeciesCard species={item} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-10 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                {t("empty")}
              </p>
            )}

            <Reveal className="mt-14">
              <Link
                href="/regions"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
              >
                {t("browseRegions")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
