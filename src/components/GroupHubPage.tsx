import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { GroupHubFaqSection } from "@/components/GroupHubFaqSection";
import { GroupHubGuides } from "@/components/GroupHubGuides";
import { GroupHubHero } from "@/components/GroupHubHero";
import { GroupHubOverview } from "@/components/GroupHubOverview";
import { GroupHubRegionsMap } from "@/components/GroupHubRegionsMap";
import {
  GroupHubSectionHeading,
  HUB_CONTAINER,
  HUB_EYEBROW,
  HUB_TEXT_LINK,
  HUB_TEXT_LINK_LABEL,
} from "@/components/GroupHubSectionHeading";
import { GroupHubSpeciesList } from "@/components/GroupHubSpeciesList";
import { GuideArticleRelatedBlock } from "@/components/GuideArticleRelatedBlock";
import { GuideSources } from "@/components/GuideSources";
import { SectionNav } from "@/components/SectionNav";
import { TurtlesHubSections } from "@/components/TurtlesHubSections";
import { getGuideArticlesForHub } from "@/data/guideArticles";
import {
  HERPETOFAUNA_CHECKLIST_SOURCE,
  isHerpetofaunaGroup,
} from "@/data/herpetofauna-checklist";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import {
  getHubIndexTitleKey,
  HUB_CLUSTER_CARDS,
  HUB_INDEX_PATH,
  splitHubSpecies,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { hubGuideCards } from "@/lib/groupHubCatalog";
import { HUB_DISPLAY_ORDER } from "@/lib/groupHubLayout";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUBS } from "@/lib/groupHubs";
import { usesDangerScale } from "@/lib/speciesRisk";
import { pageDateFields } from "@/lib/structuredDataDates";

type GroupHubPageProps = {
  heroMobileSrc?: string;
  heroSrc: string;
  hubId: GroupHubId;
  locale: AppLocale;
  species: Species[];
};

export async function GroupHubPage({
  heroMobileSrc,
  heroSrc,
  hubId,
  locale,
  species,
}: GroupHubPageProps) {
  const [t, tShared, tNav, tProfile, tAttribution] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "attribution" }),
  ]);
  const hub = GROUP_HUBS[hubId];
  const citesChecklist = isHerpetofaunaGroup(hub.group);
  const showRisk =
    usesDangerScale(hub.group) &&
    species.some((item) => isVenomousDanger(item.danger));
  const articles = getGuideArticlesForHub(hubId);
  const articlePaths = new Set<string>(
    articles.map((article) => article.pathname),
  );
  const guideCards = hubGuideCards(HUB_CLUSTER_CARDS[hubId]).filter(
    (card) => card.kind !== "page" || !articlePaths.has(card.href),
  );
  const guideCount = guideCards.length + articles.length;
  const faqCount = hubFaqCount(hubId, (key) => t.has(key as never));
  const indexPath = HUB_INDEX_PATH[hubId];
  const indexLink =
    indexPath === hub.path
      ? undefined
      : {
          href: indexPath,
          label: t.has("speciesIndexCta")
            ? t("speciesIndexCta")
            : tShared(getHubIndexTitleKey(hubId)),
        };
  const dates = pageDateFields(hub.path);

  return (
    <div className="min-h-screen bg-background">
      <GroupHubHero
        heroMobileSrc={heroMobileSrc}
        heroSpecies={species.find((item) => item.id === hub.heroSpeciesId)}
        heroSrc={heroSrc}
        hubId={hubId}
        locale={locale}
        showRisk={showRisk}
        species={species}
      />
      <div>
        <SectionNav
          ariaLabel={tProfile("contents")}
          items={[
            { count: species.length, id: "species", label: tNav("species") },
            ...(guideCount > 0
              ? [
                  {
                    count: guideCount,
                    id: "guides",
                    label: tShared("navGuides"),
                  },
                ]
              : []),
            { id: "overview", label: tProfile("overview") },
            ...(faqCount > 0
              ? [{ count: faqCount, id: "faq", label: t("faqEyebrow") }]
              : []),
            { id: "groups", label: tShared("navOtherGroups") },
          ]}
          meta={
            indexLink ? (
              <Link
                className={cn(HUB_TEXT_LINK, "group text-foreground")}
                href={indexLink.href}
              >
                <span className={HUB_TEXT_LINK_LABEL}>{indexLink.label}</span>
                <ArrowUpRight aria-hidden="true" className="size-[15px]" />
              </Link>
            ) : null
          }
        />
        <GroupHubSpeciesList
          hubId={hubId}
          indexLink={indexLink}
          locale={locale}
          showRisk={showRisk}
          species={species}
        />
        <GroupHubGuides
          cards={guideCards}
          hubId={hubId}
          locale={locale}
          species={species}
        />
        <GuideArticleRelatedBlock
          articles={articles}
          id={guideCards.length === 0 ? "guides" : undefined}
          locale={locale}
        />
        <GroupHubOverview
          contextBlocks={hubContextBlocks(hubId, (key) => t(key as never))}
          hubId={hubId}
          locale={locale}
          sections={splitHubSpecies(hubId, species)}
          showRisk={showRisk}
          species={species}
        />
        {hubId === "turtles" ? <TurtlesHubSections /> : null}
        <GroupHubFaqSection hubId={hubId} speciesCount={species.length} />
        {citesChecklist ? (
          <div className={cn(HUB_CONTAINER, "pb-4")}>
            <GuideSources
              heading={tAttribution("sources")}
              locale={locale}
              sources={[HERPETOFAUNA_CHECKLIST_SOURCE]}
            />
          </div>
        ) : null}
        <ContentAttribution
          locale={locale}
          publishedAt={dates.datePublished}
          sourcesHref={citesChecklist ? "#sources" : undefined}
          updatedAt={dates.dateModified}
        />
        <GroupHubRelatedGroups hubId={hubId} locale={locale} />
        <GroupHubCta hubId={hubId} locale={locale} species={species} />
      </div>
    </div>
  );
}

async function GroupHubCta({
  hubId,
  locale,
  species,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
  species: Species[];
}) {
  const [t, tShared] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const editable = locale === "ka" && isLocalAdminEnabled();
  const outline =
    "flex h-[54px] items-center justify-center gap-2 rounded-full border border-white/30 px-[26px] text-[15px] font-medium whitespace-nowrap text-white transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 lg:inline-flex lg:h-[52px]";

  return (
    <section className="bg-background px-4 pb-11 lg:px-0 lg:pb-20">
      <div className="mx-auto max-w-[1440px] lg:px-[60px]">
        <div className="grid overflow-hidden rounded-[32px] bg-ink px-6 pt-[30px] pb-[26px] text-white lg:grid-cols-[minmax(0,640px)_460px] lg:items-center lg:justify-between lg:gap-x-12 lg:rounded-[44px] lg:px-16 lg:py-14">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className={cn(HUB_EYEBROW, "text-white/60")}>
              {t("ctaEyebrow")}
            </p>
            <h2
              className="mt-3 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] lg:mt-4 lg:text-[44px] lg:leading-[1.1]"
              {...contentEditorAttributes(
                "message",
                editable ? "messages" : undefined,
                `${hubId}.ctaTitle`,
              )}
            >
              {t("ctaTitle")}
            </h2>
            <p
              className="mt-3 text-[14.5px] leading-[1.6] text-white/70 lg:mt-[18px] lg:text-[16px] lg:leading-[1.65]"
              {...contentEditorAttributes(
                "message",
                editable ? "messages" : undefined,
                `${hubId}.ctaBody`,
              )}
            >
              {t("ctaBody")}
            </p>
          </div>
          <GroupHubRegionsMap
            className="mt-[18px] opacity-90 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
            speciesIds={new Set(species.map((item) => item.id))}
          />
          <div className="mt-[18px] flex flex-col gap-2.5 lg:col-start-1 lg:row-start-2 lg:mt-7 lg:flex-row lg:flex-wrap lg:gap-3 lg:self-start">
            <Link
              className="flex h-[54px] items-center justify-center gap-2 rounded-full bg-white pr-6 pl-[26px] text-[15px] font-medium whitespace-nowrap text-ink transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 lg:inline-flex lg:h-[52px]"
              href="/species"
            >
              {tShared("ctaAllSpecies")}
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
            </Link>
            {hubId === "turtles" ? (
              <Link className={outline} href="/turtles/identifikacia">
                {t("ctaIdentify")}
              </Link>
            ) : null}
            <Link className={outline} href="/regions">
              {tShared("ctaRegions")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

async function GroupHubRelatedGroups({
  hubId,
  locale,
}: {
  hubId: GroupHubId;
  locale: AppLocale;
}) {
  const [t, tShared, tNav] = await Promise.all([
    getTranslations({ locale, namespace: hubId }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const relatedBody = t.has("relatedBody")
    ? t("relatedBody")
    : tShared("relatedBody");

  return (
    <section className="scroll-mt-36 bg-background py-11 lg:py-20" id="groups">
      <div className={HUB_CONTAINER}>
        <GroupHubSectionHeading
          compact
          eyebrow={tShared("relatedEyebrow")}
          lead={relatedBody}
          title={tShared("relatedTitle")}
        />
        <ul className="no-scrollbar -mx-6 mt-[22px] flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-1.5 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8 lg:overflow-visible lg:px-0 lg:pb-0">
          {HUB_DISPLAY_ORDER.map((id, index) =>
            id === hubId ? null : (
              <li className="w-[232px] shrink-0 snap-start lg:w-auto" key={id}>
                <Link className="group block" href={GROUP_HUBS[id].path}>
                  <span className="relative block h-[156px] overflow-hidden rounded-[22px] bg-ink lg:h-[196px] lg:rounded-[24px]">
                    <CoverImage
                      alt=""
                      aria-hidden
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                      sizes="(max-width: 1023px) 232px, 330px"
                      src={GROUP_HUB_ILLUSTRATIONS[id]}
                    />
                  </span>
                  <span className="mx-1 mt-2.5 flex items-baseline gap-[9px] text-[16px] font-semibold text-foreground transition-colors group-hover:text-primary lg:mx-1.5 lg:mt-3 lg:gap-2.5 lg:text-[17px]">
                    <span className="text-[12px] font-normal text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {tNav(id)}
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

function hubContextBlocks(hubId: GroupHubId, t: (key: string) => string) {
  if (hubId === "mammals") {
    return [{ body: t("predatorsBody"), title: t("predatorsTitle") }];
  }
  if (hubId === "scorpions") {
    return [
      { body: t("venomBody"), title: t("venomTitle") },
      { body: t("westBody"), title: t("westTitle") },
    ];
  }
  return [];
}

function hubFaqCount(hubId: GroupHubId, has: (key: string) => boolean) {
  const max = hubId === "turtles" ? 8 : 5;
  let count = 0;
  for (let n = 1; n <= max; n += 1) {
    if (has(`faq${n}Q`)) count += 1;
  }
  return count;
}
