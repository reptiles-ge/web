import type { ComponentProps } from "react";

import { ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { CoverImage } from "@/components/CoverImage";
import {
  GroupHubSectionHeading,
  HUB_CONTAINER,
  HUB_EYEBROW,
} from "@/components/GroupHubSectionHeading";
import { GroupHubSpeciesCatalog } from "@/components/GroupHubSpeciesCatalog";
import { QuizCtaLink } from "@/components/QuizCtaLink";
import { Link } from "@/i18n/navigation";
import { type HubCatalogItem } from "@/lib/groupHubCatalog";
import { HUB_QUIZ } from "@/lib/groupHubLayout";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { quizHref } from "@/lib/quizzes";
import { QUIZ_LENGTH } from "@/lib/snakeQuiz";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import { speciesHref } from "@/lib/speciesRoutes";

const RISK_RANK: Record<string, number> = { Harmless: 2, High: 0, Moderate: 1 };

type GroupHubSpeciesListProps = {
  hubId: GroupHubId;
  indexLink?: { href: ComponentProps<typeof Link>["href"]; label: string };
  locale: AppLocale;
  showRisk: boolean;
  species: Species[];
};

export async function GroupHubSpeciesList({
  hubId,
  indexLink,
  locale,
  showRisk,
  species,
}: GroupHubSpeciesListProps) {
  const [t, tAtlas] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "speciesAtlas" }),
  ]);
  const group = GROUP_HUBS[hubId].group;
  const items: HubCatalogItem[] = species
    .map((item) => ({
      alt: speciesImageAlt(item.commonName, item.scientificName, item.location),
      href: speciesHref(item.id, locale),
      id: item.id,
      image: item.image,
      mobileImage: item.mobileImage,
      name: item.commonName,
      risk: showRisk ? (getSpeciesRiskChip(item, group)?.level ?? null) : null,
      scientificName: item.scientificName,
    }))
    .sort((a, b) => riskRank(a.risk) - riskRank(b.risk));

  return (
    <section
      className="scroll-mt-36 bg-background pt-10 pb-11 lg:pt-[72px] lg:pb-20"
      id="species"
    >
      <div className={HUB_CONTAINER}>
        <GroupHubSectionHeading
          eyebrow={t("speciesEyebrow")}
          lead={t("speciesBody")}
          title={t("speciesTitle", { count: species.length })}
        />
        <GroupHubSpeciesCatalog
          allLabel={tAtlas("filters.all")}
          group={group}
          indexLink={indexLink}
          items={items}
          showRisk={showRisk}
        />
        <GroupHubQuizCard hubId={hubId} locale={locale} species={species} />
      </div>
    </section>
  );
}

async function GroupHubQuizCard({
  hubId,
  locale,
  species,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
  species: Species[];
}) {
  const quiz = HUB_QUIZ[hubId];
  if (!quiz) return null;
  const pool = species.filter(
    (item) => item.image && !isPlaceholderMedia(item.image),
  );
  if (pool.length < 4) return null;
  const [t, tShared, tQuiz] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: quiz.namespace as "snakeQuiz" }),
  ]);
  const options = [0, 1, 2, 3].map(
    (step) => pool[Math.floor((step * pool.length) / 4)],
  );
  const answer = options[1];

  return (
    <div className="-mx-2 mt-7 rounded-[32px] bg-ink px-[22px] pt-[26px] pb-[22px] text-white lg:mx-0 lg:mt-[72px] lg:flex lg:items-center lg:gap-14 lg:rounded-[40px] lg:py-11 lg:pr-12 lg:pl-14">
      <div className="min-w-0 flex-1">
        <p className={`${HUB_EYEBROW} text-white/60`}>
          {tShared("cluster.quiz.eyebrow")}
        </p>
        <h3 className="mt-2.5 font-display text-[28px] leading-[1.12] font-semibold lg:mt-3.5 lg:text-[40px] lg:leading-[1.1]">
          {t("ctaQuiz")}
        </h3>
        <p className="mt-2.5 max-w-[470px] text-[14.5px] leading-[1.6] text-white/70 lg:mt-3.5 lg:text-[16px] lg:leading-[1.65]">
          {tQuiz("subtitle")}
        </p>
        <QuizCtaLink
          className="mt-4 hidden h-[52px] items-center gap-2 rounded-full bg-white pr-6 pl-[26px] text-[15px] font-medium text-ink transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 lg:mt-[26px] lg:inline-flex"
          href={quizHref(quiz.id, locale)}
          quizId={quiz.id}
          source="hub"
        >
          {tShared("cluster.quiz.cta")}
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </QuizCtaLink>
      </div>
      <div
        aria-hidden="true"
        className="mt-[18px] rounded-[24px] border border-white/10 bg-white/7 p-2.5 lg:mt-0 lg:flex lg:w-[560px] lg:shrink-0 lg:items-stretch lg:gap-4 lg:rounded-[30px] lg:p-3.5"
      >
        <div className="relative h-[150px] overflow-hidden rounded-2xl bg-[#151c18] lg:h-auto lg:min-h-[216px] lg:w-[250px] lg:shrink-0 lg:rounded-[20px]">
          <CoverImage
            alt=""
            aria-hidden
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 250px"
            src={answer.image}
          />
          <span className="absolute bottom-2.5 left-2.5 inline-flex h-6 items-center rounded-full bg-ink/70 px-[9px] text-[11px] text-white/85 lg:bottom-3 lg:left-3 lg:h-[26px] lg:px-2.5 lg:text-[11.5px]">
            {tQuiz("progress", { current: 1, total: QUIZ_LENGTH })}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
          {options.map((option) => (
            <span
              className={
                option === answer
                  ? "flex min-h-11 items-center justify-between gap-2 rounded-[14px] bg-[#2f6b4f] px-3 text-[13px] font-semibold lg:h-[46px] lg:rounded-2xl lg:px-4 lg:text-[14px]"
                  : "flex min-h-11 items-center rounded-[14px] bg-white/10 px-3 text-[13px] font-medium lg:h-[46px] lg:rounded-2xl lg:px-4 lg:text-[14px]"
              }
              key={option.id}
            >
              <span className="truncate">{option.commonName}</span>
              {option === answer ? (
                <Check className="size-4 shrink-0" strokeWidth={2.2} />
              ) : null}
            </span>
          ))}
        </div>
      </div>
      <QuizCtaLink
        className="mt-4 flex h-[54px] items-center justify-center gap-2 rounded-full bg-white text-[15px] font-medium text-ink lg:hidden"
        href={quizHref(quiz.id, locale)}
        quizId={quiz.id}
        source="hub"
      >
        {tShared("cluster.quiz.cta")}
        <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
      </QuizCtaLink>
    </div>
  );
}

function riskRank(risk: HubCatalogItem["risk"]) {
  return risk ? RISK_RANK[risk] : 3;
}
