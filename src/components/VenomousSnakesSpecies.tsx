"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";

type VenomousSnakesSpeciesProps = {
  giurza?: Species;
  kaznakovi?: Species;
  locale: AppLocale;
  rearFanged: Species[];
  speciesCount: number;
  vipers: Species[];
};

export function VenomousSnakesSpecies({
  giurza,
  kaznakovi,
  locale,
  rearFanged,
  speciesCount,
  vipers,
}: VenomousSnakesSpeciesProps) {
  const t = useTranslations("venomousSnakes");

  return (
    <section className="scroll-mt-28 bg-background py-20 lg:py-28" id="species">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={t("speciesBody")}
            bodyClassName={CLUSTER_BODY}
            eyebrow={t("speciesEyebrow")}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={t("speciesTitle", { count: speciesCount })}
            titleClassName={CLUSTER_TITLE_SECTION}
          />
        </div>

        {giurza || kaznakovi ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {giurza ? (
              <VenomousFeaturedCard
                eyebrow={t("featuredEyebrow")}
                locale={locale}
                openLabel={t("openProfile")}
                species={giurza}
              />
            ) : null}
            {kaznakovi ? (
              <VenomousFeaturedCard
                eyebrow={t("featuredWestEyebrow")}
                locale={locale}
                openLabel={t("openProfile")}
                species={kaznakovi}
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-14 space-y-16">
          <div>
            <h3 className="font-display text-display-card font-semibold">
              {t("vipersTitle")}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              <PhoneLinkedText>
                {t.rich("vipersBody", {
                  kaznakovi: (chunks) => (
                    <SpeciesInlineLink id="vipera-kaznakovi">
                      {chunks}
                    </SpeciesInlineLink>
                  ),
                })}
              </PhoneLinkedText>
            </p>
            <SpeciesGuideList locale={locale} source="guide" species={vipers} />
          </div>
          {rearFanged.length > 0 ? (
            <div>
              <h3 className="font-display text-display-card font-semibold">
                {t("rearFangedTitle")}
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                <PhoneLinkedText>{t("rearFangedBody")}</PhoneLinkedText>
              </p>
              <SpeciesGuideList
                locale={locale}
                source="guide"
                species={rearFanged}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function VenomousFeaturedCard({
  eyebrow,
  locale,
  openLabel,
  species,
}: {
  eyebrow: string;
  locale: AppLocale;
  openLabel: string;
  species: Species;
}) {
  return (
    <div>
      <Link
        className="flex h-full flex-wrap items-center justify-between gap-4 rounded-card border border-border bg-card px-6 py-5 transition-colors hover:border-primary/25"
        href={useSpeciesHref(species.id, locale)}
      >
        <div>
          <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <p className="mt-2 font-display text-[22px] font-semibold text-foreground">
            {species.commonName}
          </p>
          <p className="mt-1 text-[14px] text-muted-foreground italic">
            {species.scientificName}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
          {openLabel}
          <ArrowUpRight className="size-3.5" />
        </span>
      </Link>
    </div>
  );
}
