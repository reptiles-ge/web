"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import type { ClusterGuidePath } from "@/lib/clusterGuides";

type ConflictNamespace = "mammalJackalYard" | "lizardHouse";

type ConflictLinkHref = ClusterGuidePath | "/lizards";

type ConflictLinkKey = "linkIndex" | "linkHub" | "linkIdentify";

type ConflictGuideConfig = {
  actionCount: 4;
  agencyPhone?: { display: string; tel: string };
  extraLinks: readonly { href: ConflictLinkHref; key: ConflictLinkKey }[];
  mythCount: 4;
  namespace: ConflictNamespace;
  show112: boolean;
  summaryCount: 4;
};

const SUMMARY_ITEMS = [1, 2, 3, 4] as const;
const ACTION_STEPS = [1, 2, 3, 4] as const;
const MYTH_ITEMS = [1, 2, 3, 4] as const;

export const JACKAL_YARD_CONFIG: ConflictGuideConfig = {
  actionCount: 4,
  extraLinks: [
    { href: "/mammals/saxeoebebi", key: "linkIndex" },
    { href: "/mammals", key: "linkHub" },
  ],
  mythCount: 4,
  namespace: "mammalJackalYard",
  show112: true,
  summaryCount: 4,
};

export const LIZARD_HOUSE_CONFIG: ConflictGuideConfig = {
  actionCount: 4,
  agencyPhone: { display: "032 272 16 00", tel: "0322721600" },
  extraLinks: [
    { href: "/lizards/identifikacia", key: "linkIdentify" },
    { href: "/lizards", key: "linkHub" },
  ],
  mythCount: 4,
  namespace: "lizardHouse",
  show112: false,
  summaryCount: 4,
};

export function ConflictGuideSections({
  config,
  species,
}: {
  config: ConflictGuideConfig;
  species: Species[];
}) {
  return (
    <>
      <ConflictSummary config={config} />
      <ConflictWhy config={config} />
      <ConflictActions config={config} />
      <ConflictIdentify config={config} species={species} />
      <ConflictMyths config={config} />
      <ConflictContact config={config} />
    </>
  );
}

function ConflictSummary({ config }: { config: ConflictGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section
      className="scroll-mt-28 bg-background py-20 lg:py-28"
      id="content"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("summaryEyebrow")}
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-display-title font-semibold">
            {t("summaryTitle")}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {t("summaryLead")}
          </p>
          <ul className="mt-8 max-w-2xl divide-y divide-border border-y border-border">
            {SUMMARY_ITEMS.map((n) => (
              <li
                className="py-4 text-[15px] leading-relaxed text-foreground"
                key={n}
              >
                {t(`summary${n}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ConflictWhy({ config }: { config: ConflictGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ClusterSectionIntro
          body={t("whyLead")}
          bodyClassName={CLUSTER_BODY}
          eyebrow={t("whyEyebrow")}
          eyebrowClassName={CLUSTER_EYEBROW}
          title={t("whyTitle")}
          titleClassName="mt-5 max-w-3xl font-display text-display-title font-semibold"
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-card bg-border/80 sm:grid-cols-2">
          <div className="bg-card p-7 sm:p-8">
            <p className="font-display text-[13px] font-medium tracking-[0.18em] text-primary">
              01
            </p>
            <h3 className="mt-4 font-display text-[1.25rem] font-semibold text-foreground">
              {t("why1Title")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("why1Body")}
            </p>
          </div>
          <div className="bg-card p-7 sm:p-8">
            <p className="font-display text-[13px] font-medium tracking-[0.18em] text-primary">
              02
            </p>
            <h3 className="mt-4 font-display text-[1.25rem] font-semibold text-foreground">
              {t("why2Title")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("why2Body")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConflictActions({ config }: { config: ConflictGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section
      className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      id="actions"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ClusterSectionIntro
          body={t("actionsLead")}
          bodyClassName={CLUSTER_BODY}
          eyebrow={t("actionsEyebrow")}
          eyebrowClassName={CLUSTER_EYEBROW}
          title={t("actionsTitle")}
          titleClassName="mt-5 max-w-3xl font-display text-display-title font-semibold"
        />
        <ol className="mt-14 space-y-0 divide-y divide-border border-y border-border">
          {ACTION_STEPS.map((n) => (
            <li
              className="grid gap-6 py-8 sm:grid-cols-[5.5rem_1fr] sm:gap-10 sm:py-10 lg:grid-cols-[7rem_1fr]"
              key={n}
            >
              <span className="font-display text-display-stat font-semibold text-primary/80">
                {String(n).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-display-card font-semibold text-foreground">
                  {t(`action${n}Title`)}
                </h3>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                  {t(`action${n}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ConflictIdentify({
  config,
  species,
}: {
  config: ConflictGuideConfig;
  species: Species[];
}) {
  const t = useTranslations(config.namespace);
  const locale = useLocale() as AppLocale;

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ClusterSectionIntro
          body={t("identifyLead")}
          bodyClassName={CLUSTER_BODY}
          eyebrow={t("identifyEyebrow")}
          eyebrowClassName={CLUSTER_EYEBROW}
          title={t("identifyTitle")}
          titleClassName="mt-5 max-w-3xl font-display text-display-title font-semibold"
        />
        <ul className="mt-8 max-w-2xl divide-y divide-border border-y border-border">
          {([1, 2, 3] as const).map((n) => (
            <li
              className="py-4 text-[15px] leading-relaxed text-foreground"
              key={n}
            >
              {t(`identify${n}`)}
            </li>
          ))}
        </ul>
        <SpeciesGuideList locale={locale} source="guide" species={species} />
        <div className="mt-10 flex flex-wrap gap-3">
          {config.extraLinks.map((link) => (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
              href={link.href}
              key={link.key}
            >
              {t(link.key as "linkHub")}
              <ArrowUpRight className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConflictMyths({ config }: { config: ConflictGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section
      className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      id="myths"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <ClusterSectionIntro
              body={t("mythsLead")}
              bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
              eyebrow={t("mythsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("mythsTitle")}
              titleClassName={CLUSTER_TITLE_GUIDE}
            />
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {MYTH_ITEMS.map((n) => (
              <li className="py-5 sm:py-6" key={n}>
                <p className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                  {t(`myth${n}False`)}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {t(`myth${n}True`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ConflictContact({ config }: { config: ConflictGuideConfig }) {
  const t = useTranslations(config.namespace);
  if (!config.show112 && !config.agencyPhone) return null;

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ClusterSectionIntro
          body={t("contactBody")}
          bodyClassName={CLUSTER_BODY}
          eyebrow={t("contactEyebrow")}
          eyebrowClassName={CLUSTER_EYEBROW}
          title={t("contactTitle")}
          titleClassName={CLUSTER_TITLE_RELATED}
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-media bg-border/80 sm:grid-cols-2">
          {config.show112 ? (
            <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
              <div>
                <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  {t("contactBiteEyebrow")}
                </p>
                <h3 className="mt-4 font-display text-display-card font-semibold text-foreground">
                  {t("contactBiteTitle")}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                  {t("contactBiteBody")}
                </p>
              </div>
              <a
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                href="tel:112"
              >
                {t("contactBiteCta")}
                <span className="font-display tracking-wide">112</span>
              </a>
            </div>
          ) : null}
          {config.agencyPhone ? (
            <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
              <div>
                <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  {t("contactAgencyEyebrow")}
                </p>
                <h3 className="mt-4 font-display text-display-card font-semibold text-foreground">
                  {t("contactAgencyTitle")}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                  {t("contactAgencyBody")}
                </p>
              </div>
              <a
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-5 py-3 text-[14px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                href={`tel:${config.agencyPhone.tel}`}
              >
                {t("contactAgencyCta")}
                <span className="font-display tracking-wide">
                  {config.agencyPhone.display}
                </span>
              </a>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
              <div>
                <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  {t("contactHelpEyebrow")}
                </p>
                <h3 className="mt-4 font-display text-display-card font-semibold text-foreground">
                  {t("contactHelpTitle")}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                  {t("contactHelpBody")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
