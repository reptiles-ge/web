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
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { TurtlesHubSections } from "@/components/TurtlesHubSections";
import { Link } from "@/i18n/navigation";
import { HUB_CLUSTER_CARDS, splitHubSpecies } from "@/lib/clusterGuides";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";

type GroupHubPageProps = {
  heroSrc: string;
  hubId: GroupHubId;
  species: Species[];
};

export async function GroupHubPage({
  heroSrc,
  hubId,
  species,
}: GroupHubPageProps) {
  const t = await getTranslations(hubId);
  const tShared = await getTranslations("groupHubShared");
  const locale = (await getLocale()) as AppLocale;
  const relatedHubs = GROUP_HUB_LIST.filter((hub) => hub.id !== hubId);
  const clusterCards = HUB_CLUSTER_CARDS[hubId];
  const sections = splitHubSpecies(hubId, species);

  return (
    <div className="min-h-screen bg-background">
      <div>
        <GroupHubHero heroSrc={heroSrc} hubId={hubId} species={species} />

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
                  <p>
                    <PhoneLinkedText>{t("guideP1")}</PhoneLinkedText>
                  </p>
                  <p>
                    <PhoneLinkedText>{t("guideP2")}</PhoneLinkedText>
                  </p>
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

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div>
              <ClusterSectionIntro
                body={tShared("relatedBody")}
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

        <ContentAttribution />

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
            <div>
              <p className="text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
                {t("ctaEyebrow")}
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-display-lead font-semibold text-white">
                {t("ctaTitle")}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
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
