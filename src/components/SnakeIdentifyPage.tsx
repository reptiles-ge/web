"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  getRearFangedSpecies,
  getViperSpecies,
  SNAKE_LOOKALIKE_PAIRS,
} from "@/lib/clusterGuides";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";

export function SnakeIdentifyPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeIdentify");
  const locale = useLocale() as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const vipers = getViperSpecies(species);
  const rearFanged = getRearFangedSpecies(species);
  const venomous = [...vipers, ...rearFanged];
  const pairs = SNAKE_LOOKALIKE_PAIRS.map((pair) => ({
    a: byId.get(pair.a),
    b: byId.get(pair.b),
  })).filter((pair): pair is { a: Species; b: Species } =>
    Boolean(pair.a && pair.b),
  );
  const giurza = byId.get("macrovipera-lebetina");
  const kaznakovi = byId.get("vipera-kaznakovi");

  return (
    <ClusterPageFrame
      ctaHash="#signs"
      guideId={guideId}
      heroObjectClass="object-[50%_50%]"
      heroSrc={heroSrc}
    >
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <ClusterSectionIntro
                eyebrow={t("guideEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("guideTitle")}
                titleClassName={CLUSTER_TITLE_GUIDE}
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("guideP1")}</p>
                <p>
                  {t.rich("guideP2", {
                    kaznakovi: (chunks) => (
                      <SpeciesInlineLink id="vipera-kaznakovi">
                        {chunks}
                      </SpeciesInlineLink>
                    ),
                  })}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal>
        <QuizPracticeCta
          body={t("quizCtaBody")}
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          source="other"
          title={t("quizCtaTitle")}
        />
      </Reveal>

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="signs"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("signsWarning")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("signsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("signsTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>
          <ol className="mt-14 divide-y divide-border border-y border-border">
            {([1, 2, 3, 4] as const).map((n) => (
              <Reveal delay={n * 40} key={n}>
                <li className="grid gap-4 py-7 sm:grid-cols-[4rem_1fr] sm:items-start">
                  <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
                    {String(n).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                      {t(`sign${n}Title`)}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                      {t(`sign${n}Body`)}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("chainBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("chainEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("chainTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>
          {(giurza || kaznakovi) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {giurza ? (
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
                  href={speciesHref(giurza.id, locale)}
                >
                  {giurza.commonName}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ) : null}
              {kaznakovi ? (
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                  href={speciesHref(kaznakovi.id, locale)}
                >
                  {kaznakovi.commonName}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ) : null}
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                href="/venomous-snakes"
              >
                {t("chainVenomous")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          )}
          <SpeciesGuideList locale={locale} source="guide" species={venomous} />
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("pairsBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("pairsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("pairsTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {pairs.map((pair, index) => (
              <Reveal delay={index * 50} key={`${pair.a.id}-${pair.b.id}`}>
                <LookalikePair
                  a={pair.a}
                  b={pair.b}
                  locale={locale}
                  vs={t("vs")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}

function LookalikePair({
  a,
  b,
  locale,
  vs,
}: {
  a: Species;
  b: Species;
  locale: AppLocale;
  vs: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-[24px] border border-border bg-card p-4 sm:gap-5 sm:p-5">
      <LookalikeSide locale={locale} species={a} />
      <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
        {vs}
      </span>
      <LookalikeSide locale={locale} species={b} />
    </div>
  );
}

function LookalikeSide({
  locale,
  species,
}: {
  locale: AppLocale;
  species: Species;
}) {
  return (
    <Link className="group min-w-0" href={speciesHref(species.id, locale)}>
      <span className="relative block aspect-5/4 overflow-hidden rounded-2xl bg-ink">
        <CoverImage
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 40vw, 280px"
          src={species.mobileImage ?? species.image}
        />
      </span>
      <span className="mt-3 block font-display text-[15px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[16px]">
        {species.commonName}
      </span>
      <span className="mt-1 block text-[12px] text-muted-foreground italic">
        {species.scientificName}
      </span>
    </Link>
  );
}
