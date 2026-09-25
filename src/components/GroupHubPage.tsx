import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { GroupHubFaqSection } from "@/components/GroupHubFaqSection";
import { GroupHubHero } from "@/components/GroupHubHero";
import { GroupHubSpeciesList } from "@/components/GroupHubSpeciesList";
import { GuideArticleRelatedBlock } from "@/components/GuideArticleRelatedBlock";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { TurtlesHubSections } from "@/components/TurtlesHubSections";
import { getGuideArticlesForHub } from "@/data/guideArticles";
import { Link } from "@/i18n/navigation";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { HUB_CLUSTER_CARDS, splitHubSpecies } from "@/lib/clusterGuides";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { GROUP_HUB_LIST, GROUP_HUBS } from "@/lib/groupHubs";
import { pageDateFields } from "@/lib/structuredDataDates";

type GroupHubPageProps = {
  heroMobileSrc?: string;
  heroSrc: string;
  hubId: GroupHubId;
  species: Species[];
};

const INSECT_DEFINITION: Record<AppLocale, string> = {
  en: "Insects are arthropods that, as adults, have six legs, three main body parts, and often one or two pairs of wings.",
  ka: "მწერები არიან ფეხსახსრიანები, რომლებსაც ზრდასრულ სტადიაზე აქვთ ექვსი ფეხი, სამი ძირითადი სხეულის ნაწილი და ხშირად ერთი ან ორი წყვილი ფრთა.",
  ru: "Насекомые — членистоногие, у которых во взрослом состоянии шесть ног, три основные части тела и часто одна или две пары крыльев.",
  tr: "Böcekler, ergin dönemde altı bacağı, üç ana vücut bölümü ve çoğu zaman bir ya da iki çift kanadı olan eklembacaklılardır.",
};

export async function GroupHubPage({
  heroMobileSrc,
  heroSrc,
  hubId,
  species,
}: GroupHubPageProps) {
  const t = await getTranslations(hubId);
  const tShared = await getTranslations("groupHubShared");
  const locale = (await getLocale()) as AppLocale;
  const editable = locale === "ka" && isLocalAdminEnabled();
  const relatedHubs = GROUP_HUB_LIST.filter((hub) => hub.id !== hubId);
  const articles = getGuideArticlesForHub(hubId);
  const articlePaths = new Set<string>(
    articles.map((article) => article.pathname),
  );
  const clusterCards = HUB_CLUSTER_CARDS[hubId].filter(
    (card) => card.kind !== "page" || !articlePaths.has(card.href),
  );
  const sections = splitHubSpecies(hubId, species);
  const relatedBody = t.has("relatedBody")
    ? t("relatedBody")
    : tShared("relatedBody");
  const guideP1 =
    hubId === "insects"
      ? `${INSECT_DEFINITION[locale]} ${t("guideP1")}`
      : t("guideP1");
  const dates = pageDateFields(GROUP_HUBS[hubId].path);

  return (
    <div className="min-h-screen bg-background">
      <div>
        <GroupHubHero
          heroMobileSrc={heroMobileSrc}
          heroSrc={heroSrc}
          hubId={hubId}
          species={species}
        />

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <ClusterSectionIntro
                  eyebrow={t("guideEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("guideTitle")}
                  titleClassName={CLUSTER_TITLE_GUIDE}
                />
              </div>
              <div>
                <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p
                    {...contentEditorAttributes(
                      "message",
                      editable && hubId !== "insects" ? "messages" : undefined,
                      `${hubId}.guideP1`,
                    )}
                  >
                    <PhoneLinkedText>{guideP1}</PhoneLinkedText>
                  </p>
                  {hubId === "spiders" ? null : (
                    <p
                      {...contentEditorAttributes(
                        "message",
                        editable ? "messages" : undefined,
                        `${hubId}.guideP2`,
                      )}
                    >
                      <PhoneLinkedText>{t("guideP2")}</PhoneLinkedText>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <RelatedGuideGrid
              cards={clusterCards}
              className="mt-14"
              locale={locale}
              species={species}
            />
          </div>
        </section>

        <GroupHubSpeciesList
          hubId={hubId}
          sections={sections}
          speciesCount={species.length}
        />

        {hubId === "turtles" ? <TurtlesHubSections /> : null}

        <GuideArticleRelatedBlock articles={articles} locale={locale} />

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div>
              <ClusterSectionIntro
                body={relatedBody}
                bodyClassName={CLUSTER_BODY}
                eyebrow={tShared("relatedEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={tShared("relatedTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-card bg-border/80 sm:grid-cols-2 lg:grid-cols-3">
              {relatedHubs.map((hub, index) => (
                <div className="contents" key={hub.id}>
                  <Link
                    className="group flex h-full min-h-[160px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background"
                    href={hub.path}
                  >
                    <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-8 inline-flex items-center gap-1.5 font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {tShared(`hubs.${hub.id}`)}
                      <ArrowUpRight className="size-4 opacity-50" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GroupHubFaqSection hubId={hubId} />

        <ContentAttribution
          publishedAt={dates.datePublished}
          updatedAt={dates.dateModified}
        />

        <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink py-24">
          <CoverImage
            alt={t("heroImageAlt")}
            aria-hidden
            className="object-cover opacity-50"
            sizes="100vw"
            src={heroSrc}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/88" />
          <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] text-white/45 uppercase">
                {t("ctaEyebrow")}
              </p>
              <h2
                className="mt-5 max-w-3xl font-display text-display-lead font-semibold text-white"
                {...contentEditorAttributes(
                  "message",
                  editable ? "messages" : undefined,
                  `${hubId}.ctaTitle`,
                )}
              >
                {t("ctaTitle")}
              </h2>
              <p
                className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60"
                {...contentEditorAttributes(
                  "message",
                  editable ? "messages" : undefined,
                  `${hubId}.ctaBody`,
                )}
              >
                {t("ctaBody")}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="/species"
                >
                  {tShared("ctaAllSpecies")}
                  <ArrowRight className="size-4" />
                </Link>
                {hubId === "turtles" ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                    href="/turtles/identifikacia"
                  >
                    {t("ctaIdentify")}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ) : null}
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                  href="/regions"
                >
                  {tShared("ctaRegions")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
