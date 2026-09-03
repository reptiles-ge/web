"use client";

import { ArrowUpRight, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterPathCard } from "@/components/ClusterPathCard";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";

type VenomousSnakesGuidesProps = {
  locale: AppLocale;
  relatedGuides: HubClusterCard[];
};

export function VenomousSnakesGuides({
  locale,
  relatedGuides,
}: VenomousSnakesGuidesProps) {
  const t = useTranslations("venomousSnakes");

  return (
    <>
      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <ClusterSectionIntro
                body={t("safetyLead")}
                bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
                eyebrow={t("safetyEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("safetyTitle")}
                titleClassName={CLUSTER_TITLE_GUIDE}
              >
                <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Shield aria-hidden="true" className="size-3.5 shrink-0" />
                  {t("safetyDisclaimer")}
                </p>
              </ClusterSectionIntro>
            </Reveal>
            <ol className="space-y-0 divide-y divide-border border-y border-border">
              {([1, 2, 3, 4] as const).map((n, index) => (
                <Reveal
                  as="li"
                  className="flex items-start gap-5 py-6"
                  delay={index * 50}
                  key={n}
                >
                  <span className="mt-0.5 text-[11px] tracking-[0.18em] text-muted-foreground">
                    {String(n).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                      {t(`safetyStep${n}Title`)}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                      {t(`safetyStep${n}Body`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <Reveal>
              <ClusterSectionIntro
                body={t("yardBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("yardEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("yardTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <Reveal delay={80}>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                href="/snakes-in-the-yard"
              >
                {t("yardCta")}
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
            <Reveal>
              <ClusterPathCard
                body={t("idBody")}
                cta={t("idCta")}
                eyebrow={t("idEyebrow")}
                href="/snakes/shxamiani-gvelis-amocnoba"
                title={t("idTitle")}
              />
            </Reveal>
            <Reveal delay={60}>
              <ClusterPathCard
                body={t("biteBody")}
                cta={t("biteCta")}
                eyebrow={t("biteEyebrow")}
                href="/snakes/gvelis-nakbeni"
                title={t("biteTitle")}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <Reveal>
              <ClusterSectionIntro
                body={t("lookalikesBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("lookalikesEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("lookalikesTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <Reveal delay={80}>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                href={{ pathname: "/species", query: { danger: "harmless" } }}
              >
                {t("lookalikesCta")}
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <ClusterContentSection
        body={t("relatedGuidesBody")}
        eyebrow={t("relatedGuidesEyebrow")}
        surface="background"
        title={t("relatedGuidesTitle")}
      >
        <RelatedGuideGrid cards={relatedGuides} locale={locale} />
      </ClusterContentSection>
    </>
  );
}
