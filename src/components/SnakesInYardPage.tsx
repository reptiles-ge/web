"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { ClusterFaqSection } from "@/components/ClusterFaqSection";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { SnakesInYardHero } from "@/components/SnakesInYardHero";
import { SnakesInYardSections } from "@/components/SnakesInYardSections";
import { Link } from "@/i18n/navigation";
import { getHubPageRelatedGuides } from "@/lib/clusterGuides";

type SnakesInYardPageProps = {
  coverSrc: string;
  heroSrc: string;
};

const FAQ_KEYS = [1, 2, 3, 4, 5, 6] as const;
const AGENCY_PHONE = "0322721600";
const AGENCY_PHONE_DISPLAY = "032 272 16 00";
const EMERGENCY_PHONE = "112";

export function SnakesInYardPage({ coverSrc, heroSrc }: SnakesInYardPageProps) {
  const t = useTranslations("snakesInYard");
  const locale = useLocale() as AppLocale;
  const relatedGuides = getHubPageRelatedGuides(
    "snakes",
    "/snakes-in-the-yard",
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <SnakesInYardHero heroSrc={heroSrc} />
        <SnakesInYardSections coverSrc={coverSrc} />

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("appearBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("appearEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("appearTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-border/80 sm:grid-cols-2">
              <Reveal>
                <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      {t("contactBiteEyebrow")}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.55rem)] font-semibold text-foreground">
                      {t("contactBiteTitle")}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                      {t("contactBiteBody")}
                    </p>
                  </div>
                  <a
                    className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                    href={`tel:${EMERGENCY_PHONE}`}
                  >
                    {t("contactBiteCta")}
                    <span className="font-display tracking-wide">
                      {EMERGENCY_PHONE}
                    </span>
                  </a>
                  <Link
                    className="mt-3 inline-flex items-center gap-2 self-start text-[13px] font-medium text-foreground/70 transition-colors hover:text-primary"
                    href="/snakes/gvelis-nakbeni"
                  >
                    {t("contactBiteGuideCta")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      {t("contactAgencyEyebrow")}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.55rem)] font-semibold text-foreground">
                      {t("contactAgencyTitle")}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                      {t("contactAgencyBody")}
                    </p>
                  </div>
                  <a
                    className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-5 py-3 text-[14px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    href={`tel:${AGENCY_PHONE}`}
                  >
                    {t("contactAgencyCta")}
                    <span className="font-display tracking-wide">
                      {AGENCY_PHONE_DISPLAY}
                    </span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("relatedGuidesBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("relatedGuidesEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("relatedGuidesTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <RelatedGuideGrid cards={relatedGuides} locale={locale} />
          </div>
        </section>

        <ClusterFaqSection
          intro={{
            body: t("faqIntro"),
            eyebrow: t("faqEyebrow"),
            title: t("faqTitle"),
          }}
          items={FAQ_KEYS.map((n) => ({
            answer: t(`faq${n}A`),
            question: t(`faq${n}Q`),
          }))}
          surface="background"
        />

        <ContentAttribution />

        <section className="relative flex min-h-[60svh] items-center overflow-hidden bg-ink py-24">
          <CoverImage
            alt=""
            aria-hidden
            className="object-cover opacity-45"
            sizes="100vw"
            src={heroSrc}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/88" />
          <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("ctaBody")}
                bodyClassName={CLUSTER_HERO_BODY}
                eyebrow={t("ctaEyebrow")}
                eyebrowClassName={CLUSTER_HERO_EYEBROW}
                title={t("ctaTitle")}
                titleClassName="mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-semibold leading-[1.05] text-white"
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="/species"
                >
                  {t("ctaAtlas")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                  href="/venomous-snakes"
                >
                  {t("ctaVenomous")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
