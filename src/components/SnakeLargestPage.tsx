"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  LARGE_SNAKE_IDS,
  LARGE_SNAKE_LIZARD_ID,
  orderSpeciesByIds,
} from "@/lib/clusterGuides";
import { getSpeciesSizeStat } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";

export function SnakeLargestPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeLargest");
  const locale = useLocale() as AppLocale;
  const snakes = orderSpeciesByIds(species, LARGE_SNAKE_IDS);
  const lizard = species.find((item) => item.id === LARGE_SNAKE_LIZARD_ID);

  return (
    <ClusterPageFrame
      ctaHash="#list"
      guideId={guideId}
      heroObjectClass="object-[50%_72%]"
      heroSrc={heroSrc}
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>{t("guideP2")}</p>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="list"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("listBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("listEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("listTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>
          <ol className="mt-12 divide-y divide-border border-y border-border">
            {snakes.map((item, index) => (
              <Reveal delay={Math.min(index * 40, 280)} key={item.id}>
                <LargestRow
                  dash={t("emDash")}
                  index={index}
                  locale={locale}
                  species={item}
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
                <ClusterSectionIntro
                  body={t("lizardBody")}
                  bodyClassName="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
                  eyebrow={t("lizardEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("lizardTitle")}
                  titleClassName={CLUSTER_TITLE_GUIDE}
                >
                  <p className="mt-4 text-[14px] text-muted-foreground">
                    {getSpeciesSizeStat(lizard) ?? t("emDash")}
                  </p>
                  <Link
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white dark:text-ink"
                    href={speciesHref(lizard.id, locale)}
                  >
                    {lizard.commonName}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </ClusterSectionIntro>
              </Reveal>
              <Reveal delay={60}>
                <Link
                  className="relative block aspect-16/10 overflow-hidden rounded-[28px] bg-ink"
                  href={speciesHref(lizard.id, locale)}
                >
                  <CoverImage
                    alt={speciesImageAlt(
                      lizard.commonName,
                      lizard.scientificName,
                      lizard.location,
                    )}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    src={lizard.image}
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
  dash,
  index,
  locale,
  species,
}: {
  dash: string;
  index: number;
  locale: AppLocale;
  species: Species;
}) {
  const size = getSpeciesSizeStat(species) ?? dash;
  return (
    <li>
      <Link
        className="group grid gap-5 py-7 sm:grid-cols-[7.5rem_1fr_auto] sm:items-center sm:gap-8 lg:grid-cols-[9rem_1fr_auto]"
        href={speciesHref(species.id, locale)}
      >
        <span className="relative aspect-5/4 overflow-hidden rounded-2xl bg-ink sm:aspect-square sm:rounded-[22px]">
          <CoverImage
            alt={speciesImageAlt(
              species.commonName,
              species.scientificName,
              species.location,
            )}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, 144px"
            src={species.mobileImage ?? species.image}
          />
        </span>
        <span className="min-w-0">
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mt-2 block font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
            {species.commonName}
          </span>
          <span className="mt-1 block text-[13px] text-muted-foreground italic">
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
