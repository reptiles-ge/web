"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";

const DO_STEPS = [1, 2, 3, 4, 5, 6] as const;
const DONT_STEPS = [1, 2, 3, 4, 5, 6] as const;
const SYMPTOM_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const DANGER_ITEMS = [1, 2, 3, 4] as const;
const EXTERNAL_SOURCES = [1, 2, 3, 4] as const;
const SITE_SOURCES = [1, 2] as const;

const EXTERNAL_SOURCE_HREFS = {
  en: {
    1: "https://112.gov.ge/?lang=en&page_id=1686",
    2: "https://www.who.int/teams/control-of-neglected-tropical-diseases/snakebite-envenoming/treatment",
    3: "https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming",
    4: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html",
  },
  ka: {
    1: "https://112.gov.ge/?page_id=599",
    2: "https://www.who.int/teams/control-of-neglected-tropical-diseases/snakebite-envenoming/treatment",
    3: "https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming",
    4: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html",
  },
} as const;

function externalSourceHref(locale: AppLocale, n: 1 | 2 | 3 | 4) {
  return locale === "ka"
    ? EXTERNAL_SOURCE_HREFS.ka[n]
    : EXTERNAL_SOURCE_HREFS.en[n];
}

const EDITORIAL_UPDATED = "2026-08-29";

const inlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function SnakeBiteSections({ species }: { species: Species[] }) {
  return (
    <>
      <SnakeBiteDisclaimer />
      <SnakeBiteDoDont />
      <SnakeBiteSymptoms />
      <SnakeBiteDangerVenom />
      <SnakeBiteUnseen />
      <SnakeBiteSpecies species={species} />
      <SnakeBiteSources />
    </>
  );
}

function SnakeBiteDangerVenom() {
  const t = useTranslations("snakeBite");

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
              {t("dangerIntro")}
            </p>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {DANGER_ITEMS.map((n) => (
                <li
                  className="py-4 text-[15px] leading-relaxed text-foreground"
                  key={n}
                >
                  {t(`danger${n}`)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("venomEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-display-title font-semibold">
              {t("venomTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              {t.rich("venomBody", {
                identify: (chunks) => (
                  <Link
                    className={inlineLinkClassName}
                    href="/snakes/shxamiani-gvelis-amocnoba"
                  >
                    {chunks}
                  </Link>
                ),
                venomous: (chunks) => (
                  <Link
                    className={inlineLinkClassName}
                    href="/venomous-snakes"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {t("venomNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SnakeBiteDisclaimer() {
  const t = useTranslations("snakeBite");

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
              {([1, 2, 3, 4] as const).map((n) => (
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

function SnakeBiteDoDont() {
  const t = useTranslations("snakeBite");

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
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
      </div>
    </section>
  );
}

function SnakeBiteSources() {
  const t = useTranslations("snakeBite");
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
            {t("sourcesIntro")}
          </p>
        </div>

        <p className="mt-10 text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          {t("sourcesMedicalLabel")}
        </p>
        <ul className="mt-4 max-w-3xl divide-y divide-border border-y border-border">
          {EXTERNAL_SOURCES.map((n) => (
            <li className="py-6" key={n}>
              <a
                className="group inline-flex items-start gap-2"
                href={externalSourceHref(locale, n)}
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
                {t(`sourceSite${n}Body`)}
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
            {t("editorialBody")}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {t("editorialDisclaimer")}
          </p>
        </aside>
      </div>
    </section>
  );
}

function SnakeBiteSpecies({ species }: { species: Species[] }) {
  const t = useTranslations("snakeBite");
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
            {t.rich("speciesBody", {
              count: species.length,
              index: (chunks) => (
                <Link
                  className={inlineLinkClassName}
                  href="/snakes/saxeoebebi"
                >
                  {chunks}
                </Link>
              ),
              range: (chunks) => (
                <Link
                  className={inlineLinkClassName}
                  href="/snakes/gavrtseleba"
                >
                  {chunks}
                </Link>
              ),
              venomous: (chunks) => (
                <Link className={inlineLinkClassName} href="/venomous-snakes">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
        <SpeciesGuideList locale={locale} source="guide" species={species} />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white dark:text-ink"
            href="/venomous-snakes"
          >
            {t("linkVenomous")}
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
            href="/snakes-in-the-yard"
          >
            {t("linkYard")}
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
            href="/snakes"
          >
            {t("linkSnakes")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SnakeBiteSymptoms() {
  const t = useTranslations("snakeBite");

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
            {t("symptomsIntro")}
          </p>
          <p className="mt-4 max-w-2xl rounded-[18px] border border-destructive/25 bg-destructive/5 px-5 py-4 text-[15px] leading-relaxed text-foreground">
            {t("symptomsUrgent")}
          </p>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-card bg-border/80 sm:grid-cols-2">
          {SYMPTOM_ITEMS.map((n) => (
            <div key={n}>
              <li className="bg-card px-6 py-5 text-[15px] leading-relaxed text-foreground">
                {t(`symptom${n}`)}
              </li>
            </div>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          {t("symptomsNote")}
        </p>
      </div>
    </section>
  );
}

function SnakeBiteUnseen() {
  const t = useTranslations("snakeBite");

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
            {t("unseenBody")}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {t.rich("unseenId", {
              identify: (chunks) => (
                <Link
                  className={inlineLinkClassName}
                  href="/snakes/shxamiani-gvelis-amocnoba"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
