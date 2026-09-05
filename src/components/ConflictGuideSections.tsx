"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { ConflictGuideConfig } from "@/components/conflictGuideConfig";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { GuideNumberedSteps } from "@/components/GuideShared";
import { useLocaleSwitchIndex } from "@/components/LocaleSwitchProvider";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";

const SUMMARY_ITEMS = [1, 2, 3, 4] as const;
const ACTION_STEPS = [1, 2, 3, 4] as const;
const MYTH_ITEMS = [1, 2, 3, 4] as const;

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
      <ConflictContact config={config} species={species} />
    </>
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
        <GuideNumberedSteps
          items={ACTION_STEPS.map((n) => ({
            body: t(`action${n}Body`),
            id: n,
            title: t(`action${n}Title`),
          }))}
        />
      </div>
    </section>
  );
}

function ConflictContact({
  config,
  species,
}: {
  config: ConflictGuideConfig;
  species: Species[];
}) {
  const t = useTranslations(config.namespace);
  const locale = useLocale() as AppLocale;
  const switchIndex = useLocaleSwitchIndex();
  const photo = config.contactSpeciesId
    ? species.find((item) => item.id === config.contactSpeciesId)
    : undefined;
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
                  <PhoneLinkedText>{t("contactBiteBody")}</PhoneLinkedText>
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
                  <PhoneLinkedText>{t("contactAgencyBody")}</PhoneLinkedText>
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
          {photo ? (
            <Link
              className="group relative block h-full min-h-[260px] overflow-hidden bg-ink"
              href={speciesHrefFromIndex(switchIndex, photo.id, locale)}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                <CoverImage
                  alt={t("heroImageAlt")}
                  className="object-cover object-[50%_55%]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  src={photo.mobileImage ?? photo.image}
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-6 pt-16 pb-5 font-display text-[15px] font-medium text-white">
                  {photo.commonName}
                </span>
              </div>
            </Link>
          ) : null}
        </div>
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
              <PhoneLinkedText>{t(`identify${n}`)}</PhoneLinkedText>
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
                  <PhoneLinkedText>{t(`myth${n}True`)}</PhoneLinkedText>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ConflictSummary({ config }: { config: ConflictGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section className="scroll-mt-28 bg-background py-20 lg:py-28" id="content">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("summaryEyebrow")}
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-display-title font-semibold">
            <PhoneLinkedText>{t("summaryTitle")}</PhoneLinkedText>
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("summaryLead")}</PhoneLinkedText>
          </p>
          <ul className="mt-8 max-w-2xl divide-y divide-border border-y border-border">
            {SUMMARY_ITEMS.map((n) => (
              <li
                className="py-4 text-[15px] leading-relaxed text-foreground"
                key={n}
              >
                <PhoneLinkedText>{t(`summary${n}`)}</PhoneLinkedText>
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
              <PhoneLinkedText>{t("why1Body")}</PhoneLinkedText>
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
              <PhoneLinkedText>{t("why2Body")}</PhoneLinkedText>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
