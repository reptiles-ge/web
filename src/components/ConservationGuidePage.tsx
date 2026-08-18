"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  isChecklistCandidate,
  isEndemicAmphibian,
  isEndemicReptile,
  isGeorgiaRedListReptile,
  isIucnThreatenedReptile,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function ConservationGuidePage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations(
    guideId === "conservation-reptiles"
      ? "conservationReptiles"
      : guideId === "conservation-amphibians"
        ? "conservationAmphibians"
        : guideId === "conservation-rare"
          ? "conservationRare"
          : "conservationEndemic",
  );
  const locale = useLocale() as AppLocale;

  const cited = species.filter((item) => isGeorgiaRedListReptile(item.id));
  const endemicReptiles = species.filter((item) => isEndemicReptile(item.id));
  const endemicAmphibians = species.filter((item) =>
    isEndemicAmphibian(item.id),
  );
  const iucnOnly = species.filter(
    (item) =>
      isIucnThreatenedReptile(item.id) && !isGeorgiaRedListReptile(item.id),
  );
  const candidates = species.filter(
    (item) =>
      isChecklistCandidate(item) &&
      !isGeorgiaRedListReptile(item.id) &&
      !isIucnThreatenedReptile(item.id) &&
      !isEndemicReptile(item.id) &&
      !isEndemicAmphibian(item.id),
  );

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
                <p>{t("sourceNote")}</p>
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
          {guideId === "conservation-reptiles" ? (
            <>
              <SpeciesBlock
                eyebrow={t("citedEyebrow")}
                title={t("citedTitle", { count: cited.length })}
                body={t("citedBody")}
                species={cited}
                locale={locale}
              />
              <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("notListedNote")}
              </p>
            </>
          ) : null}

          {guideId === "conservation-amphibians" ? (
            <>
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("gapEyebrow")}
                </p>
                <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
                  {t("gapTitle")}
                </h2>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("gapBody")}
                </p>
              </Reveal>
              <SpeciesBlock
                eyebrow={t("endemicEyebrow")}
                title={t("endemicTitle", { count: endemicAmphibians.length })}
                body={t("endemicBody")}
                species={endemicAmphibians}
                locale={locale}
              />
              <SpeciesBlock
                eyebrow={t("candidateEyebrow")}
                title={t("candidateTitle", { count: candidates.length })}
                body={t("candidateBody")}
                species={candidates}
                locale={locale}
              />
            </>
          ) : null}

          {guideId === "conservation-rare" ? (
            <>
              <SpeciesBlock
                eyebrow={t("citedEyebrow")}
                title={t("citedTitle", { count: cited.length })}
                body={t("citedBody")}
                species={cited}
                locale={locale}
              />
              <SpeciesBlock
                eyebrow={t("iucnEyebrow")}
                title={t("iucnTitle", { count: iucnOnly.length })}
                body={t("iucnBody")}
                species={iucnOnly}
                locale={locale}
              />
              <SpeciesBlock
                eyebrow={t("candidateEyebrow")}
                title={t("candidateTitle", { count: candidates.length })}
                body={t("candidateBody")}
                species={candidates}
                locale={locale}
              />
            </>
          ) : null}

          {guideId === "conservation-endemic" ? (
            <>
              <SpeciesBlock
                eyebrow={t("reptileEyebrow")}
                title={t("reptileTitle", { count: endemicReptiles.length })}
                body={t("reptileBody")}
                species={endemicReptiles}
                locale={locale}
              />
              <SpeciesBlock
                eyebrow={t("amphibianEyebrow")}
                title={t("amphibianTitle", { count: endemicAmphibians.length })}
                body={t("amphibianBody")}
                species={endemicAmphibians}
                locale={locale}
              />
              <Link
                href="/conservation/witeli-nusxa-amfibiebi"
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
              >
                {t("amphibianCta")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </>
          ) : null}
        </div>
      </section>
    </ClusterPageFrame>
  );
}

function SpeciesBlock({
  eyebrow,
  title,
  body,
  species,
  locale,
}: {
  eyebrow: string;
  title: string;
  body: string;
  species: Species[];
  locale: AppLocale;
}) {
  return (
    <div className="mt-16 first:mt-0">
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {body}
        </p>
      </Reveal>
      {species.length > 0 ? (
        <SpeciesGuideList species={species} locale={locale} />
      ) : (
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          —
        </p>
      )}
    </div>
  );
}
