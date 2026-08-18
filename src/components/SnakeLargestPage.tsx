"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  LARGE_SNAKE_IDS,
  LARGE_SNAKE_LIZARD_ID,
  orderSpeciesByIds,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { getSpeciesSizeStat } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function SnakeLargestPage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeLargest");
  const locale = useLocale() as AppLocale;
  const snakes = orderSpeciesByIds(species, LARGE_SNAKE_IDS);
  const lizard = species.find((item) => item.id === LARGE_SNAKE_LIZARD_ID);

  return (
    <ClusterPageFrame guideId={guideId} heroSrc={heroSrc} ctaHash="#list">
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("guideEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("guideTitle")}
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("guideP1")}</p>
                <p>{t("guideP2")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="list"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("listEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("listTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("listBody")}
            </p>
          </Reveal>
          <ol className="mt-12 divide-y divide-border border-y border-border">
            {snakes.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 40, 280)}>
                <LargestRow
                  species={item}
                  locale={locale}
                  index={index}
                  dash={t("emDash")}
                />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {lizard ? (
        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("lizardEyebrow")}
                </p>
                <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("lizardTitle")}
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("lizardBody")}
                </p>
                <p className="mt-4 text-[14px] text-muted-foreground">
                  {getSpeciesSizeStat(lizard) ?? t("emDash")}
                </p>
                <Link
                  href={speciesHref(lizard.id, locale)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white dark:text-ink"
                >
                  {lizard.commonName}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Reveal>
              <Reveal delay={60}>
                <Link
                  href={speciesHref(lizard.id, locale)}
                  className="relative block aspect-[16/10] overflow-hidden rounded-[28px] bg-ink"
                >
                  <Image
                    src={lizard.image}
                    alt={speciesImageAlt(
                      lizard.commonName,
                      lizard.scientificName,
                      lizard.location,
                    )}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}
    </ClusterPageFrame>
  );
}

function LargestRow({
  species,
  locale,
  index,
  dash,
}: {
  species: Species;
  locale: AppLocale;
  index: number;
  dash: string;
}) {
  const size = getSpeciesSizeStat(species) ?? dash;
  return (
    <li>
      <Link
        href={speciesHref(species.id, locale)}
        className="group grid gap-5 py-7 sm:grid-cols-[7.5rem_1fr_auto] sm:items-center sm:gap-8 lg:grid-cols-[9rem_1fr_auto]"
      >
        <span className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-ink sm:aspect-square sm:rounded-[22px]">
          <Image
            src={species.mobileImage ?? species.image}
            alt={speciesImageAlt(
              species.commonName,
              species.scientificName,
              species.location,
            )}
            fill
            sizes="(max-width: 640px) 100vw, 144px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </span>
        <span className="min-w-0">
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mt-2 block font-display text-[clamp(1.35rem,2.5vw,1.85rem)] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {species.commonName}
          </span>
          <span className="mt-1 block text-[13px] italic text-muted-foreground">
            {species.scientificName}
          </span>
          <span className="mt-3 block text-[14px] text-muted-foreground">
            {size}
          </span>
        </span>
        <ArrowUpRight className="size-4 self-start text-muted-foreground/50 transition-colors group-hover:text-primary sm:self-center" />
      </Link>
    </li>
  );
}
