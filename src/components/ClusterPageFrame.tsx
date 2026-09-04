import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { type ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";

import { ClusterFaqSection } from "@/components/ClusterFaqSection";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_HERO_TITLE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import {
  CLUSTER_GUIDES,
  type ClusterGuideId,
  getRelatedGuideCards,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { GROUP_HUBS } from "@/lib/groupHubs";

type ClusterPageFrameProps = {
  attributionSourcesHref?: string;
  children: ReactNode;
  ctaHash?: string;
  guideId: ClusterGuideId;
  heroObjectClass?: string;
  heroSrc: string;
  stats?: ReactNode;
};

export async function ClusterPageFrame({
  attributionSourcesHref,
  children,
  ctaHash = "#content",
  guideId,
  heroObjectClass = "object-[50%_35%]",
  heroSrc,
  stats,
}: ClusterPageFrameProps) {
  const guide = CLUSTER_GUIDES[guideId];
  const parent = GROUP_HUBS[guide.parentHub];
  const [t, tShared, tParent, locale] = await Promise.all([
    getTranslations(guide.messageKey),
    getTranslations("groupHubShared"),
    getTranslations(parent.messageKey),
    getLocale() as Promise<AppLocale>,
  ]);
  const relatedGuides = getRelatedGuideCards(guideId);
  const faqItems = Array.from({ length: guide.faqCount }, (_, index) => {
    const n = index + 1;
    const qKey = `faq${n}Q` as Parameters<typeof t>[0];
    const aKey = `faq${n}A` as Parameters<typeof t>[0];
    return { answer: t(aKey), question: t(qKey) };
  });

  return (
    <div className="min-h-screen bg-background">
      <div>
        <section
          className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
          style={{ paddingTop: "7rem" }}
        >
          <CoverImage
            alt={t("heroImageAlt")}
            className={cn("object-cover", heroObjectClass)}
            priority
            sizes="100vw"
            src={heroSrc}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-black/92" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                  <li>
                    <Link
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
                      href="/"
                    >
                      <ArrowLeft className="size-3.5" />
                      {tShared("breadcrumbHome")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/30">
                    /
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href={parent.path}
                    >
                      {tParent("breadcrumbCurrent")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/30">
                    /
                  </li>
                  <li className="text-white/80">{t("breadcrumbCurrent")}</li>
                </ol>
              </nav>

              <p className="font-display text-[clamp(1.15rem,2.4vw,1.65rem)] font-semibold tracking-tight text-white/90">
                Reptiles
              </p>
              <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.05] font-semibold text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                {guide.primaryCta === "tel" ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                    href="tel:112"
                  >
                    {t("ctaSpecies")}
                    <ArrowRight className="size-4" />
                  </a>
                ) : (
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                    href={ctaHash}
                  >
                    {t("ctaSpecies")}
                    <ArrowRight className="size-4" />
                  </a>
                )}
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  href={parent.path}
                >
                  {t("ctaParent")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {stats}

        {children}

        {relatedGuides.length > 0 ? (
          <section className="border-t border-border bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <Reveal>
                <ClusterSectionIntro
                  body={tShared("relatedGuidesBody")}
                  bodyClassName={CLUSTER_BODY}
                  eyebrow={tShared("relatedGuidesEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={tShared("relatedGuidesTitle")}
                  titleClassName={CLUSTER_TITLE_RELATED}
                />
              </Reveal>
              <RelatedGuideGrid cards={relatedGuides} locale={locale} />
            </div>
          </section>
        ) : null}

        <ClusterFaqSection
          intro={{
            body: t("faqIntro"),
            eyebrow: t("faqEyebrow"),
            title: t("faqTitle"),
          }}
          items={faqItems}
        />

        <ContentAttribution sourcesHref={attributionSourcesHref} />

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
                  href={parent.path}
                >
                  {t("ctaParent")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                  href="/species"
                >
                  {tShared("ctaAllSpecies")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
