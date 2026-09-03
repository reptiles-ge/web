"use client";

import { ArrowRight, ArrowUpRight, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterNumberedSteps } from "@/components/ClusterNumberedSteps";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_HERO_TITLE,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";

type VenomousSnakesGuidesProps = {
  heroSrc: string;
  locale: AppLocale;
  relatedGuides: HubClusterCard[];
};

export function VenomousSnakesGuides({
  heroSrc,
  locale,
  relatedGuides,
}: VenomousSnakesGuidesProps) {
  const t = useTranslations("venomousSnakes");

  return (
    <>
      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <ClusterSectionIntro
                body={t("safetyLead")}
                bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
                eyebrow={t("safetyEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("safetyTitle")}
                titleClassName={CLUSTER_TITLE_GUIDE}
              >
                <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Shield aria-hidden="true" className="size-3.5 shrink-0" />
                  {t("safetyDisclaimer")}
                </p>
              </ClusterSectionIntro>
            </Reveal>
            <ClusterNumberedSteps
              steps={([1, 2, 3, 4] as const).map((n) => ({
                body: t(`safetyStep${n}Body`),
                title: t(`safetyStep${n}Title`),
              }))}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <Reveal>
              <ClusterSectionIntro
                body={t("yardBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("yardEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("yardTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <Reveal delay={80}>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                href="/snakes-in-the-yard"
              >
                {t("yardCta")}
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
            <VenomousGuideTile
              body={t("idBody")}
              cta={t("idCta")}
              delay={0}
              eyebrow={t("idEyebrow")}
              href="/snakes/shxamiani-gvelis-amocnoba"
              title={t("idTitle")}
            />
            <VenomousGuideTile
              body={t("biteBody")}
              cta={t("biteCta")}
              delay={60}
              eyebrow={t("biteEyebrow")}
              href="/snakes/gvelis-nakbeni"
              title={t("biteTitle")}
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <Reveal>
              <ClusterSectionIntro
                body={t("lookalikesBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("lookalikesEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("lookalikesTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <Reveal delay={80}>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                href={{ pathname: "/species", query: { danger: "harmless" } }}
              >
                {t("lookalikesCta")}
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <ClusterContentSection
        body={t("relatedGuidesBody")}
        eyebrow={t("relatedGuidesEyebrow")}
        surface="background"
        title={t("relatedGuidesTitle")}
      >
        <RelatedGuideGrid cards={relatedGuides} locale={locale} />
      </ClusterContentSection>

      <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink py-24">
        <CoverImage
          alt=""
          aria-hidden
          className="object-cover opacity-50"
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
              titleClassName={CLUSTER_HERO_TITLE}
            />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                href="/species"
              >
                {t("ctaAllSpecies")}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                href="/regions"
              >
                {t("ctaRegions")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function VenomousGuideTile({
  body,
  cta,
  delay,
  eyebrow,
  href,
  title,
}: {
  body: string;
  cta: string;
  delay: number;
  eyebrow: string;
  href: "/snakes/gvelis-nakbeni" | "/snakes/shxamiani-gvelis-amocnoba";
  title: string;
}) {
  return (
    <Reveal delay={delay}>
      <Link
        className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
        href={href}
      >
        <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </span>
        <div className="mt-6">
          <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
            {title}
          </p>
          <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
            {body}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
            {cta}
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
