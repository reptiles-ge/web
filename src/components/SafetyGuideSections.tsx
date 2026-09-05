"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { SafetyGuideConfig } from "@/components/safetyGuideConfig";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import {
  GuideDoDontSection,
  GuideEditorialNote,
  GuideFactColumn,
  GuideFactList,
  GuideSymptomsLead,
  GuideTwoColumnSurface,
} from "@/components/GuideShared";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";

const SUMMARY_ITEMS = [1, 2, 3, 4] as const;
const DO_STEPS = [1, 2, 3, 4, 5] as const;
const DONT_STEPS = [1, 2, 3, 4, 5] as const;
const SYMPTOM_ITEMS = [1, 2, 3, 4, 5, 6] as const;
const DANGER_ITEMS = [1, 2, 3, 4] as const;
const EXTERNAL_SOURCES = [1, 2, 3, 4] as const;
const SITE_SOURCES = [1, 2] as const;

const EDITORIAL_UPDATED = "2026-09-05";

const inlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function SafetyGuideSections({
  config,
  species,
}: {
  config: SafetyGuideConfig;
  species: Species[];
}) {
  return (
    <>
      <SafetyDisclaimer config={config} />
      <SafetyDoDont config={config} />
      {config.showSymptoms ? <SafetySymptoms config={config} /> : null}
      <SafetyDanger config={config} />
      {config.showUnseen ? <SafetyUnseen config={config} /> : null}
      <SafetySpecies config={config} species={species} />
      <SafetySources config={config} />
    </>
  );
}

function SafetyDanger({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <GuideTwoColumnSurface>
      <GuideFactColumn
        eyebrow={t("dangerEyebrow")}
        intro={t("dangerIntro")}
        title={t("dangerTitle")}
      >
        <GuideFactList
          items={DANGER_ITEMS.map((n) => ({
            id: n,
            text: t(`danger${n}`),
          }))}
        />
      </GuideFactColumn>
      <GuideFactColumn
        eyebrow={t("contextEyebrow")}
        intro={
          config.namespace === "spiderBite"
            ? t.rich("contextBody", {
                venomous: (chunks) => (
                  <Link
                    className={inlineLinkClassName}
                    href="/spiders/shxamiani-obobebi"
                  >
                    {chunks}
                  </Link>
                ),
              })
            : t.rich("contextBody", {
                mammals: (chunks) => (
                  <Link className={inlineLinkClassName} href="/mammals">
                    {chunks}
                  </Link>
                ),
              })
        }
        note={t("contextNote")}
        title={t("contextTitle")}
      />
    </GuideTwoColumnSurface>
  );
}

function SafetyDisclaimer({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section className="scroll-mt-28 bg-background py-20 lg:py-28" id="content">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <PhoneLinkedText>
            <p className="text-[11px] font-medium tracking-[0.3em] text-destructive uppercase">
              {t("disclaimerEyebrow")}
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-display-title font-semibold">
              {t("disclaimerTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("disclaimerBody")}
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
            <a
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white dark:text-ink"
              href="tel:112"
            >
              {t("call112")}
              <span className="font-display tracking-wide">112</span>
            </a>
            <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {t("disclaimerNote")}
            </p>
          </PhoneLinkedText>
        </div>
      </div>
    </section>
  );
}

function SafetyDoDont({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <GuideDoDontSection
      doEyebrow={t("doEyebrow")}
      doItems={DO_STEPS.map((n) => ({
        body: t(`do${n}Body`),
        id: n,
        title: t(`do${n}Title`),
      }))}
      dontEyebrow={t("dontEyebrow")}
      dontItems={DONT_STEPS.map((n) => ({
        body: t(`dont${n}Body`),
        id: n,
        title: t(`dont${n}Title`),
      }))}
      dontTitle={t("dontTitle")}
      doTitle={t("doTitle")}
    />
  );
}

function SafetySources({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations(config.namespace);
  const locale = useLocale() as AppLocale;

  return (
    <section
      className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      id="sources"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("sourcesEyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
            {t("sourcesTitle")}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("sourcesIntro")}</PhoneLinkedText>
          </p>
        </div>

        <p className="mt-10 text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          {t("sourcesExternalLabel")}
        </p>
        <ul className="mt-4 max-w-3xl divide-y divide-border border-y border-border">
          {EXTERNAL_SOURCES.map((n) => (
            <li className="py-6" key={n}>
              <a
                className="group inline-flex items-start gap-2"
                href={config.externalHrefs[locale][n]}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>
                  <span className="font-display text-[17px] font-medium text-foreground transition-colors group-hover:text-primary">
                    {t(`sourceExt${n}Title`)}
                  </span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-muted-foreground">
                    {t(`sourceExt${n}Body`)}
                  </span>
                </span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          {t("sourcesSiteLabel")}
        </p>
        <ul className="mt-4 max-w-3xl divide-y divide-border border-y border-border">
          {SITE_SOURCES.map((n) => (
            <li className="py-6" key={n}>
              <p className="font-display text-[17px] font-medium">
                {t(`sourceSite${n}Title`)}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                <PhoneLinkedText>{t(`sourceSite${n}Body`)}</PhoneLinkedText>
              </p>
            </li>
          ))}
        </ul>

        <GuideEditorialNote
          body={t("editorialBody")}
          disclaimer={t("editorialDisclaimer")}
          updated={t("editorialUpdated", {
            date: formatContentDate(EDITORIAL_UPDATED, locale),
          })}
        />
      </div>
    </section>
  );
}

function SafetySpecies({
  config,
  species,
}: {
  config: SafetyGuideConfig;
  species: Species[];
}) {
  const t = useTranslations(config.namespace);
  const locale = useLocale() as AppLocale;

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("speciesEyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
            {t("speciesTitle")}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>
              {t.rich("speciesBody", {
                count: species.length,
                index: (chunks) => (
                  <Link
                    className={inlineLinkClassName}
                    href={config.speciesIndexHref}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </PhoneLinkedText>
          </p>
        </div>
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

function SafetySymptoms({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations("spiderBite");
  if (config.namespace !== "spiderBite") return null;

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <GuideSymptomsLead
          eyebrow={t("symptomsEyebrow")}
          intro={t("symptomsIntro")}
          title={t("symptomsTitle")}
          urgent={t("symptomsUrgent")}
        />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-card bg-border/80 sm:grid-cols-2">
          {SYMPTOM_ITEMS.map((n) => (
            <li
              className="bg-card px-6 py-5 text-[15px] leading-relaxed text-foreground"
              key={n}
            >
              {t(`symptom${n}`)}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          <PhoneLinkedText>{t("symptomsNote")}</PhoneLinkedText>
        </p>
      </div>
    </section>
  );
}

function SafetyUnseen({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations("spiderBite");
  if (config.namespace !== "spiderBite") return null;

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("unseenEyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
            {t("unseenTitle")}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("unseenBody")}</PhoneLinkedText>
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>
              {t.rich("unseenId", {
                venomous: (chunks) => (
                  <Link
                    className={inlineLinkClassName}
                    href="/spiders/shxamiani-obobebi"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </PhoneLinkedText>
          </p>
        </div>
      </div>
    </section>
  );
}
