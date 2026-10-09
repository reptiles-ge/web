import { ArrowDown, ArrowUpRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { CoverImage } from "@/components/CoverImage";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { QuizCtaLink } from "@/components/QuizCtaLink";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { HUB_CLUSTER_CARDS } from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import {
  HUB_EMERGENCY_GUIDES,
  HUB_FEATURED_GUIDE,
  HUB_QUIZ,
} from "@/lib/groupHubLayout";
import { quizHref } from "@/lib/quizzes";
import { speciesHref } from "@/lib/speciesRoutes";

type GroupHubHeroProps = {
  heroMobileSrc?: string;
  heroSpecies?: Species;
  heroSrc: string;
  hubId: GroupHubId;
  locale: AppLocale;
  showRisk: boolean;
  species: Species[];
};

type HeroStat = { dot?: string; label: string; value: string };

const SECONDARY_CTA =
  "flex h-[54px] items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/8 text-[15px] font-medium whitespace-nowrap text-white transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 lg:inline-flex lg:h-[52px] lg:pr-[22px]";

export async function GroupHubHero({
  heroMobileSrc,
  heroSpecies,
  heroSrc,
  hubId,
  locale,
  showRisk,
  species,
}: GroupHubHeroProps) {
  const [t, tShared, tProfile] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const editable = locale === "ka" && isLocalAdminEnabled();
  const stats = heroStats({ showRisk, species, t, tShared });

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white lg:h-[640px]">
        <div className="absolute inset-x-0 top-0 h-[330px] overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[60%]">
          <CoverImage
            alt={t("heroImageAlt")}
            className="object-cover object-[50%_35%]"
            mobileSrc={heroMobileSrc}
            priority
            sizes="(max-width: 1023px) 100vw, 60vw"
            src={heroSrc}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[130px] bg-linear-to-b from-ink/80 to-transparent lg:h-[200px]" />
        <div className="pointer-events-none absolute inset-x-0 top-[140px] h-[190px] bg-linear-to-t from-ink via-ink/70 to-transparent lg:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-[40%] hidden w-[30%] bg-linear-to-r from-ink via-ink/50 to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[200px] bg-linear-to-t from-ink/90 to-transparent lg:block" />

        <div className="relative mx-auto h-full max-w-[1440px] px-6 pt-[244px] pb-7 lg:flex lg:flex-col lg:justify-center lg:px-[60px] lg:pt-14 lg:pb-0">
          <div className="lg:max-w-[640px]">
            <nav
              aria-label={tProfile("breadcrumbAria")}
              className="flex items-center gap-2 text-[12.5px] text-white/60 lg:gap-2.5 lg:text-[13px]"
            >
              <Link
                className="inline-flex min-h-8 items-center text-white/80 transition-colors hover:text-white"
                href="/"
              >
                {tShared("breadcrumbHome")}
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-white">
                {t("breadcrumbCurrent")}
              </span>
            </nav>
            <h1
              className="mt-2 font-display text-[36px] leading-[1.08] font-semibold tracking-[-0.01em] text-balance lg:mt-5 lg:text-[60px] lg:leading-[1.06]"
              {...contentEditorAttributes(
                "message",
                editable ? "messages" : undefined,
                `${hubId}.title`,
              )}
            >
              {t("title")}
            </h1>
            <p
              className="mt-3.5 text-[15px] leading-[1.6] text-white/75 lg:mt-5 lg:max-w-[520px] lg:text-[17px]"
              {...contentEditorAttributes(
                "message",
                editable ? "messages" : undefined,
                `${hubId}.subtitle`,
              )}
            >
              <PhoneLinkedText>{t("subtitle")}</PhoneLinkedText>
            </p>

            <dl className="mt-[22px] grid grid-cols-3 gap-2 lg:mt-[30px] lg:flex lg:items-stretch lg:gap-7">
              {stats.map((stat, index) => (
                <div
                  className={cn(
                    "flex flex-col-reverse justify-end rounded-[18px] bg-white/8 px-3 py-3.5 lg:rounded-none lg:bg-transparent lg:p-0",
                    index > 0 && "lg:border-l lg:border-white/16 lg:pl-7",
                  )}
                  key={stat.label}
                >
                  <dt className="mt-[7px] text-[11.5px] leading-[1.3] text-white/70 lg:mt-2 lg:text-[13px]">
                    {stat.label}
                  </dt>
                  <dd
                    className={cn(
                      "flex items-center gap-[7px] font-semibold tabular-nums lg:gap-2.5",
                      /^[\d\s·]+$/.test(stat.value)
                        ? "text-[26px] leading-none lg:text-[38px]"
                        : "text-[14px] leading-tight lg:max-w-[240px] lg:text-[17px]",
                    )}
                  >
                    {stat.dot ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-[7px] shrink-0 rounded-full lg:size-[9px]",
                          stat.dot,
                        )}
                      />
                    ) : null}
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-col gap-2.5 lg:mt-[34px] lg:flex-row lg:items-center lg:gap-3">
              <a
                className="flex h-[54px] items-center justify-center gap-2 rounded-full bg-white pr-6 pl-[26px] text-[15px] font-medium whitespace-nowrap text-ink transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 lg:inline-flex lg:h-[52px]"
                href="#species"
              >
                {t("ctaSpecies")}
                <ArrowDown aria-hidden="true" className="size-4" />
              </a>
              <HeroSecondaryCta hubId={hubId} locale={locale} />
            </div>
          </div>

          {heroSpecies ? (
            <Link
              className="absolute right-[60px] bottom-7 hidden h-[38px] items-center gap-2 rounded-full border border-white/16 bg-ink/58 px-[15px] text-[12.5px] text-white/85 backdrop-blur-md transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 lg:flex"
              href={speciesHref(heroSpecies.id, locale)}
            >
              <span>{heroSpecies.commonName}</span>
              <span className="text-white/60 italic">
                {heroSpecies.scientificName}
              </span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null}
        </div>
      </section>
      <GroupHubEmergencyStrip hubId={hubId} locale={locale} />
    </>
  );
}

async function GroupHubEmergencyStrip({
  hubId,
  locale,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
}) {
  const keys = HUB_EMERGENCY_GUIDES[hubId];
  if (!keys) return null;
  const [tShared, tSafety] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "home.safetyStrip" }),
  ]);
  const links = keys.flatMap((key) => {
    const card = HUB_CLUSTER_CARDS[hubId].find((entry) => entry.key === key);
    return card?.kind === "page" ? [card] : [];
  });
  const copyKey = hubId as "snakes";

  return (
    <section className="border-t border-white/8 bg-[#151c18] text-white">
      <div className="mx-auto max-w-[1440px] lg:flex lg:min-h-16 lg:items-center lg:gap-[18px] lg:px-[60px]">
        <div className="flex items-center gap-3 px-6 pt-3.5 lg:contents">
          <a
            aria-label={tSafety("call")}
            className="inline-flex h-11 shrink-0 items-center gap-[7px] rounded-full bg-destructive pr-[15px] pl-3 text-[15px] font-semibold tracking-[0.02em] text-white transition-[filter] hover:brightness-110 lg:h-9"
            href="tel:112"
          >
            <Phone aria-hidden="true" className="size-[15px]" strokeWidth={2} />
            112
          </a>
          <p className="text-[13.5px] leading-[1.4] text-white/80 lg:text-[14.5px]">
            {tShared(`emergency.${copyKey}.lead`)}{" "}
            <strong className="font-semibold text-white">
              {tShared(`emergency.${copyKey}.call`)}
            </strong>
          </p>
        </div>
        <nav
          aria-label={tSafety("navLabel")}
          className="no-scrollbar flex gap-5 overflow-x-auto px-6 pt-1 pb-1.5 text-[13px] font-medium text-white/85 lg:ml-auto lg:gap-6 lg:overflow-visible lg:p-0 lg:text-[13.5px]"
        >
          {links.map((card) => (
            <Link
              className="inline-flex min-h-11 shrink-0 items-center gap-[5px] whitespace-nowrap transition-colors hover:text-white"
              href={card.href}
              key={card.key}
            >
              {tShared(`cluster.${card.key}.title` as "cluster.bite.title")}
              <ArrowUpRight aria-hidden="true" className="size-[13px]" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

async function HeroSecondaryCta({
  hubId,
  locale,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
}) {
  const [t, tShared] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const quiz = HUB_QUIZ[hubId];
  if (quiz) {
    return (
      <QuizCtaLink
        className={cn(SECONDARY_CTA, "lg:pl-2")}
        href={quizHref(quiz.id, locale)}
        quizId={quiz.id}
        source="hub"
      >
        <span className="inline-flex h-7 items-center rounded-full bg-[#2f6b4f] px-2.5 text-[10.5px] tracking-[0.14em] uppercase lg:h-[34px] lg:px-3 lg:text-[11px]">
          {tShared("cluster.quiz.eyebrow")}
        </span>
        {t("ctaQuiz")}
      </QuizCtaLink>
    );
  }
  if (hubId === "turtles") {
    return (
      <Link
        className={cn(SECONDARY_CTA, "lg:pl-6")}
        href="/turtles/identifikacia"
      >
        {t("ctaIdentify")}
      </Link>
    );
  }
  const featured = HUB_FEATURED_GUIDE[hubId];
  const card = featured
    ? HUB_CLUSTER_CARDS[hubId].find((entry) => entry.key === featured.card)
    : undefined;
  if (card?.kind === "page") {
    return (
      <Link className={cn(SECONDARY_CTA, "lg:pl-6")} href={card.href}>
        {tShared(`cluster.${card.key}.title` as "cluster.venomous.title")}
      </Link>
    );
  }
  return (
    <Link className={cn(SECONDARY_CTA, "lg:pl-6")} href="/species">
      {tShared("ctaAllSpecies")}
    </Link>
  );
}

function heroStats({
  showRisk,
  species,
  t,
  tShared,
}: {
  showRisk: boolean;
  species: Species[];
  t: Awaited<ReturnType<typeof getTranslations>>;
  tShared: Awaited<ReturnType<typeof getTranslations>>;
}): HeroStat[] {
  const total = { label: t("statSpecies"), value: String(species.length) };
  const venomous = species.filter((item) => isVenomousDanger(item.danger));
  if (showRisk && venomous.length > 0) {
    return [
      total,
      {
        dot: "bg-[#e06a5c]",
        label: tShared("statVenomous"),
        value: String(venomous.length),
      },
      {
        dot: "bg-[#6fad88]",
        label: tShared("statHarmless"),
        value: String(
          species.filter((item) => item.danger === "Harmless").length,
        ),
      },
    ];
  }
  const items = t.has("statExtraItems") ? t.raw("statExtraItems") : null;
  return [
    total,
    {
      label: t("statFamilies"),
      value: String(new Set(species.map((item) => item.family)).size),
    },
    {
      label: t("statExtra"),
      value:
        Array.isArray(items) && items.every((item) => typeof item === "string")
          ? items.join(", ")
          : t("statExtraValue"),
    },
  ];
}
