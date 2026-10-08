import { getTranslations } from "next-intl/server";

import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterNumberedSteps } from "@/components/ClusterNumberedSteps";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { GuideMythList, GuideSummaryBlock } from "@/components/GuideShared";
import { LookalikePair } from "@/components/LookalikePair";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { toSpeciesCard, toSpeciesCards } from "@/data/speciesCard";
import { Link } from "@/i18n/navigation";
import { speciesHref } from "@/lib/speciesRoutes";

const SUMMARY = [1, 2, 3, 4] as const;
const DONT = [1, 2, 3] as const;
const MYTHS = [1, 2, 3, 4] as const;

export async function SpiderVenomousPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "spiderVenomous" });
  const byId = new Map(species.map((item) => [item.id, item]));
  const karakurt = byId.get("latrodectus-tredecimguttatus");
  const falseWidow = byId.get("steatoda-paykulliana");

  return (
    <ClusterPageFrame
      ctaHash="#content"
      guideId={guideId}
      heroObjectClass="object-[50%_70%]"
      heroSrc={heroSrc}
      locale={locale}
    >
      <section
        className="scroll-mt-28 bg-background py-20 lg:py-28"
        id="content"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <GuideSummaryBlock
            eyebrow={t("summaryEyebrow")}
            items={SUMMARY.map((n) => ({ id: n, text: t(`summary${n}`) }))}
            lead={t("summaryLead")}
            title={t("summaryTitle")}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white dark:text-ink"
              href="/spiders/obobis-nakbeni"
            >
              {t("linkBite")}
            </Link>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
              href="tel:112"
            >
              {t("call112")}
              <span className="font-display tracking-wide">112</span>
            </a>
          </div>
        </div>
      </section>

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

      <ClusterContentSection
        body={t("idBody")}
        eyebrow={t("idEyebrow")}
        id="identify"
        title={t("idTitle")}
      >
        <ClusterNumberedSteps
          steps={([1, 2, 3, 4] as const).map((n) => ({
            body: t(`id${n}Body`),
            title: t(`id${n}Title`),
          }))}
        />
        {karakurt && falseWidow ? (
          <div className="mt-12">
            <LookalikePair
              a={toSpeciesCard(karakurt)}
              b={toSpeciesCard(falseWidow)}
              locale={locale}
              vs={t("vs")}
            />
          </div>
        ) : null}
      </ClusterContentSection>

      <ClusterContentSection
        body={t("dontLead")}
        eyebrow={t("dontEyebrow")}
        surface="background"
        title={t("dontTitle")}
      >
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {DONT.map((n) => (
            <li
              className="py-5 text-[15px] leading-relaxed text-foreground"
              key={n}
            >
              {t(`dont${n}`)}
            </li>
          ))}
        </ul>
      </ClusterContentSection>

      <ClusterContentSection
        body={t("speciesBody", { count: species.length })}
        eyebrow={t("speciesEyebrow")}
        id="species"
        title={t("speciesTitle")}
      >
        <SpeciesGuideList
          locale={locale}
          source="guide"
          species={toSpeciesCards(species)}
        />
        {karakurt ? (
          <Link
            className="mt-8 inline-flex items-center rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
            href={speciesHref(karakurt.id, locale)}
          >
            {t("linkKarakurt")}
          </Link>
        ) : null}
      </ClusterContentSection>

      <ClusterContentSection
        body={t("mythsLead")}
        eyebrow={t("mythsEyebrow")}
        surface="background"
        title={t("mythsTitle")}
      >
        <GuideMythList
          myths={MYTHS.map((n) => ({
            claim: t(`myth${n}False`),
            id: n,
            truth: t(`myth${n}True`),
          }))}
        />
      </ClusterContentSection>
    </ClusterPageFrame>
  );
}
