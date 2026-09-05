"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuidePath } from "@/lib/clusterGuides";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";

type SafetyLink = {
  href: SafetyLinkHref;
  key: SafetyLinkKey;
};

type SafetyLinkHref = "/lizards" | "/risk-to-humans" | ClusterGuidePath;

type SafetyLinkKey =
  | "linkHub"
  | "linkIndex"
  | "linkRisk"
  | "linkVenomous";

type SafetyNamespace = "mammalBear" | "spiderBite";

const SUMMARY_ITEMS = [1, 2, 3, 4] as const;
const DO_STEPS = [1, 2, 3, 4, 5] as const;
const DONT_STEPS = [1, 2, 3, 4, 5] as const;
const SYMPTOM_ITEMS = [1, 2, 3, 4, 5, 6] as const;
const DANGER_ITEMS = [1, 2, 3, 4] as const;
const EXTERNAL_SOURCES = [1, 2, 3, 4] as const;
const SITE_SOURCES = [1, 2] as const;

type SafetyGuideConfig = {
  dangerCount: 4;
  doCount: 5 | 6;
  dontCount: 5 | 6;
  externalCount: 3 | 4;
  externalHrefs: Record<AppLocale, Record<number, string>>;
  extraLinks: readonly SafetyLink[];
  namespace: SafetyNamespace;
  showSymptoms: boolean;
  showUnseen: boolean;
  siteSourceCount: 2;
  speciesIndexHref: SafetyLinkHref;
  summaryCount: 4;
  symptomCount?: 6;
};

const EDITORIAL_UPDATED = "2026-09-05";

const inlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export const SPIDER_BITE_CONFIG: SafetyGuideConfig = {
  dangerCount: 4,
  doCount: 5,
  dontCount: 5,
  externalCount: 4,
  externalHrefs: {
    en: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
    ka: {
      1: "https://112.gov.ge/?page_id=599",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
    ru: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
    tr: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
  },
  extraLinks: [
    { href: "/spiders/shxamiani-obobebi", key: "linkVenomous" },
    { href: "/spiders", key: "linkHub" },
    { href: "/risk-to-humans", key: "linkRisk" },
  ],
  namespace: "spiderBite",
  showSymptoms: true,
  showUnseen: true,
  siteSourceCount: 2,
  speciesIndexHref: "/spiders",
  summaryCount: 4,
  symptomCount: 6,
};

export const BEAR_ENCOUNTER_CONFIG: SafetyGuideConfig = {
  dangerCount: 4,
  doCount: 5,
  dontCount: 5,
  externalCount: 4,
  externalHrefs: {
    en: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
    ka: {
      1: "https://112.gov.ge/?page_id=599",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
    ru: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
    tr: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
  },
  extraLinks: [
    { href: "/mammals", key: "linkHub" },
    { href: "/mammals/saxeoebebi", key: "linkIndex" },
  ],
  namespace: "mammalBear",
  showSymptoms: false,
  showUnseen: false,
  siteSourceCount: 2,
  speciesIndexHref: "/mammals/saxeoebebi",
  summaryCount: 4,
};

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
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("dangerEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-display-title font-semibold">
              {t("dangerTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              <PhoneLinkedText>{t("dangerIntro")}</PhoneLinkedText>
            </p>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {DANGER_ITEMS.map((n) => (
                <li
                  className="py-4 text-[15px] leading-relaxed text-foreground"
                  key={n}
                >
                  <PhoneLinkedText>{t(`danger${n}`)}</PhoneLinkedText>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("contextEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-display-title font-semibold">
              {t("contextTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              <PhoneLinkedText>
                {config.namespace === "spiderBite"
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
                    })}
              </PhoneLinkedText>
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              <PhoneLinkedText>{t("contextNote")}</PhoneLinkedText>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetyDisclaimer({ config }: { config: SafetyGuideConfig }) {
  const t = useTranslations(config.namespace);

  return (
    <section
      className="scroll-mt-28 bg-background py-20 lg:py-28"
      id="content"
    >
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
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <PhoneLinkedText>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("doEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-display-title font-semibold">
                {t("doTitle")}
              </h2>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {DO_STEPS.map((n) => (
                  <li className="py-5" key={n}>
                    <h3 className="font-display text-[17px] font-medium text-foreground">
                      <span className="mr-2 text-muted-foreground">
                        {String(n).padStart(2, "0")}
                      </span>
                      {t(`do${n}Title`)}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {t(`do${n}Body`)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("dontEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-display-title font-semibold">
                {t("dontTitle")}
              </h2>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {DONT_STEPS.map((n) => (
                  <li className="py-5" key={n}>
                    <h3 className="font-display text-[17px] font-medium text-foreground">
                      {t(`dont${n}Title`)}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {t(`dont${n}Body`)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </PhoneLinkedText>
      </div>
    </section>
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

        <aside className="mt-12 max-w-3xl rounded-card border border-border bg-surface p-6 sm:p-7">
          <p className="text-[13px] font-medium text-foreground">
            {t("editorialUpdated", {
              date: formatContentDate(EDITORIAL_UPDATED, locale),
            })}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("editorialBody")}</PhoneLinkedText>
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("editorialDisclaimer")}</PhoneLinkedText>
          </p>
        </aside>
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
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("symptomsEyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
            {t("symptomsTitle")}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("symptomsIntro")}</PhoneLinkedText>
          </p>
          <p className="mt-4 max-w-2xl rounded-[18px] border border-destructive/25 bg-destructive/5 px-5 py-4 text-[15px] leading-relaxed text-foreground">
            <PhoneLinkedText>{t("symptomsUrgent")}</PhoneLinkedText>
          </p>
        </div>
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
