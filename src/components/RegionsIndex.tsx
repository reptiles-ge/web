"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  localizeRegionText,
  regions,
  type Region,
} from "@/data/regions";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function RegionsIndex() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("regions");

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

      <main className="map-explorer relative overflow-hidden pt-[calc(7.5rem+var(--beta-banner-height,0px))]">
        <div
          className="pointer-events-none absolute inset-0 map-explorer-texture"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_65%)]" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-36">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link
              href="/#atlas"
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t("back")}
            </Link>
            <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 font-display text-balance-tight text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.05] text-foreground">
              {t("title")}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-balance-tight text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>

          <ul className="mx-auto mt-16 max-w-3xl divide-y divide-border/80 border-y border-border/80">
            {regions.map((region, index) => (
              <li key={region.id}>
                <Reveal delay={index * 30}>
                  <RegionListRow region={region} locale={locale} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function RegionListRow({
  region,
  locale,
}: {
  region: Region;
  locale: AppLocale;
}) {
  const t = useTranslations("regions");
  const name = localizeRegionText(region.name, locale);
  const description = localizeRegionText(region.description, locale);

  return (
    <Link
      href={`/regions/${region.id}`}
      className="group flex items-start justify-between gap-6 py-7 transition-colors sm:py-8"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-display text-[clamp(1.25rem,2.4vw,1.65rem)] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {name}
          </h2>
          <span className="text-[12px] tracking-wide text-muted-foreground">
            {t("speciesCount", { count: region.speciesIds.length })}
          </span>
        </div>
        <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <ArrowUpRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
