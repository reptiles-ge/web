"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
    >
      <section id="content" className="scroll-mt-28 bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-destructive">
              {t("disclaimerEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("disclaimerTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("disclaimerBody")}
            </p>
            <a
              href="tel:112"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white dark:text-ink"
            >
              {t("call112")}
              <span className="font-display tracking-wide">112</span>
            </a>
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
                {([1, 2, 3] as const).map((n) => (
                  <li key={n} className="py-5">
                    <p className="font-display text-[17px] font-medium text-foreground">
                      {t(`do${n}Title`)}
                    </p>
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
                {([1, 2, 3, 4] as const).map((n) => (
                  <li key={n} className="py-5">
                    <p className="font-display text-[17px] font-medium text-foreground">
                      {t(`dont${n}Title`)}
                    </p>
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
              {t("sourcesEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
              {t("sourcesTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("sourcesIntro")}
            </p>
          </Reveal>
          <ul className="mt-10 max-w-2xl divide-y divide-border border-y border-border">
            {([1, 2, 3] as const).map((n) => (
              <li key={n} className="py-6">
                <p className="font-display text-[17px] font-medium">{t(`source${n}Title`)}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {t(`source${n}Body`)}
                </p>
              </li>
            ))}
          </ul>
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
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("speciesEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("speciesTitle", { count: species.length })}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("speciesBody")}
            </p>
          </Reveal>
          <SpeciesGuideList species={species} locale={locale} />
        </div>
      </section>
    </ClusterPageFrame>
  );
}
