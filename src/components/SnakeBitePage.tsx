"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";
import { formatContentDate } from "@/lib/formatDate";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const DO_STEPS = [1, 2, 3, 4, 5, 6] as const;
const DONT_STEPS = [1, 2, 3, 4, 5, 6] as const;
const SYMPTOM_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const DANGER_ITEMS = [1, 2, 3, 4] as const;
const EXTERNAL_SOURCES = [1, 2, 3, 4] as const;
const SITE_SOURCES = [1, 2] as const;

const EXTERNAL_SOURCE_HREFS = {
  ka: {
    1: "https://112.gov.ge/?page_id=599",
    2: "https://www.who.int/teams/control-of-neglected-tropical-diseases/snakebite-envenoming/treatment",
    3: "https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming",
    4: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html",
  },
  en: {
    1: "https://112.gov.ge/?lang=en&page_id=1686",
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

export function SnakeBitePage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeBite");
  const locale = useLocale() as AppLocale;

  return (
    <ClusterPageFrame
      guideId={guideId}
      heroSrc={heroSrc}
      heroObjectClass="object-[50%_70%]"
      attributionSourcesHref="#sources"
    >
      <section id="content" className="scroll-mt-28 bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-destructive">
              {t("disclaimerEyebrow")}
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("disclaimerTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("disclaimerBody")}
            </p>
            <ul className="mt-8 max-w-2xl divide-y divide-border border-y border-border">
              {([1, 2, 3, 4] as const).map((n) => (
                <li
                  key={n}
                  className="py-4 text-[15px] leading-relaxed text-foreground"
                >
                  {t(`summary${n}`)}
                </li>
              ))}
            </ul>
            <a
              href="tel:112"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white dark:text-ink"
            >
              {t("call112")}
              <span className="font-display tracking-wide">112</span>
            </a>
            <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {t("disclaimerNote")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("doEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05]">
                {t("doTitle")}
              </h2>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {DO_STEPS.map((n) => (
                  <li key={n} className="py-5">
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
            </Reveal>
            <Reveal delay={60}>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("dontEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05]">
                {t("dontTitle")}
              </h2>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {DONT_STEPS.map((n) => (
                  <li key={n} className="py-5">
                    <h3 className="font-display text-[17px] font-medium text-foreground">
                      {t(`dont${n}Title`)}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {t(`dont${n}Body`)}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("symptomsEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
              {t("symptomsTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("symptomsIntro")}
            </p>
            <p className="mt-4 max-w-2xl rounded-[18px] border border-destructive/25 bg-destructive/5 px-5 py-4 text-[15px] leading-relaxed text-foreground">
              {t("symptomsUrgent")}
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
            {SYMPTOM_ITEMS.map((n, index) => (
              <Reveal key={n} delay={Math.min(index * 40, 240)}>
                <li className="bg-card px-6 py-5 text-[15px] leading-relaxed text-foreground">
                  {t(`symptom${n}`)}
                </li>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            {t("symptomsNote")}
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("dangerEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05]">
                {t("dangerTitle")}
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                {t("dangerIntro")}
              </p>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {DANGER_ITEMS.map((n) => (
                  <li
                    key={n}
                    className="py-4 text-[15px] leading-relaxed text-foreground"
                  >
                    {t(`danger${n}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={60}>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("venomEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05]">
                {t("venomTitle")}
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                {t.rich("venomBody", {
                  venomous: (chunks) => (
                    <Link href="/venomous-snakes" className={inlineLinkClassName}>
                      {chunks}
                    </Link>
                  ),
                  identify: (chunks) => (
                    <Link
                      href="/snakes/shxamiani-gvelis-amocnoba"
                      className={inlineLinkClassName}
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {t("venomNote")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("unseenEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
              {t("unseenTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("unseenBody")}
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t.rich("unseenId", {
                identify: (chunks) => (
                  <Link
                    href="/snakes/shxamiani-gvelis-amocnoba"
                    className={inlineLinkClassName}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("speciesEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("speciesTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t.rich("speciesBody", {
                count: species.length,
                venomous: (chunks) => (
                  <Link href="/venomous-snakes" className={inlineLinkClassName}>
                    {chunks}
                  </Link>
                ),
                index: (chunks) => (
                  <Link
                    href="/snakes/saxeoebebi"
                    className={inlineLinkClassName}
                  >
                    {chunks}
                  </Link>
                ),
                range: (chunks) => (
                  <Link
                    href="/snakes/gavrtseleba"
                    className={inlineLinkClassName}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </Reveal>
          <SpeciesGuideList species={species} locale={locale} source="guide" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/venomous-snakes"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white dark:text-ink"
            >
              {t("linkVenomous")}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/snakes-in-the-yard"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
            >
              {t("linkYard")}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/snakes"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
            >
              {t("linkSnakes")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="sources"
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("sourcesEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
              {t("sourcesTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("sourcesIntro")}
            </p>
          </Reveal>

          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {t("sourcesMedicalLabel")}
          </p>
          <ul className="mt-4 max-w-3xl divide-y divide-border border-y border-border">
            {EXTERNAL_SOURCES.map((n) => (
              <li key={n} className="py-6">
                <a
                  href={externalSourceHref(locale, n)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-2"
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

          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {t("sourcesSiteLabel")}
          </p>
          <ul className="mt-4 max-w-3xl divide-y divide-border border-y border-border">
            {SITE_SOURCES.map((n) => (
              <li key={n} className="py-6">
                <p className="font-display text-[17px] font-medium">
                  {t(`sourceSite${n}Title`)}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {t(`sourceSite${n}Body`)}
                </p>
              </li>
            ))}
          </ul>

          <aside className="mt-12 max-w-3xl rounded-[20px] border border-border bg-surface px-6 py-6 sm:px-7 sm:py-7">
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
    </ClusterPageFrame>
  );
}
