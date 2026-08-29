"use client";

import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

const regionLinkClass =
  "text-foreground underline-offset-4 hover:underline";

export function TurtlesHubSections() {
  const t = useTranslations("turtles");

  return (
    <>
      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("rangeEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("rangeTitle")}
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("rangeP1")}</p>
                <p>
                  {t.rich("rangeP2", {
                    regions: (chunks) => (
                      <Link href="/regions" className={regionLinkClass}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("whereEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
              {t("whereTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("whereIntro")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
            {(
              [
                {
                  key: "testudo",
                  regions: [
                    { id: "shida-kartli", labelKey: "regionShidaKartli" },
                    { id: "kvemo-kartli", labelKey: "regionKvemoKartli" },
                    { id: "kakheti", labelKey: "regionKakheti" },
                    { id: "tbilisi", labelKey: "regionTbilisi" },
                  ] as const,
                },
                {
                  key: "emys",
                  regions: [
                    { id: "samegrelo", labelKey: "regionSamegrelo" },
                  ] as const,
                },
                {
                  key: "mauremys",
                  regions: [
                    { id: "tbilisi", labelKey: "regionTbilisi" },
                  ] as const,
                },
                {
                  key: "trachemys",
                  regions: [
                    { id: "tbilisi", labelKey: "regionTbilisi" },
                    { id: "adjara", labelKey: "regionAdjara" },
                  ] as const,
                },
              ] as const
            ).map((item, index) => (
              <Reveal key={item.key} delay={index * 40} className="contents">
                <article className="flex h-full flex-col bg-card p-7 sm:p-8">
                  <h3 className="font-display text-[18px] font-semibold text-foreground sm:text-[20px]">
                    {t(`where.${item.key}.title`)}
                  </h3>
                  <p className="mt-1 text-[13px] italic text-muted-foreground">
                    {t(`where.${item.key}.scientific`)}
                  </p>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                    {t(`where.${item.key}.body`)}
                  </p>
                  <p className="mt-4 text-[12px] text-muted-foreground/80">
                    {item.regions.map((region, regionIndex) => (
                      <span key={region.id}>
                        {regionIndex > 0 ? " · " : null}
                        <Link
                          href={{
                            pathname: "/regions/[id]",
                            params: { id: region.id },
                          }}
                          className={regionLinkClass}
                        >
                          {t(region.labelKey)}
                        </Link>
                      </span>
                    ))}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("identifyEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("identifyTitle")}
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {t("identifyBody")}
              </p>
            </Reveal>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([1, 2, 3, 4] as const).map((n, index) => (
              <Reveal key={n} delay={index * 40}>
                <li className="border-t border-border pt-4">
                  <p className="text-[12px] tracking-[0.18em] text-muted-foreground">
                    {String(n).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-display text-[17px] font-semibold text-foreground">
                    {t(`identifyPoint${n}Title`)}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    {t(`identifyPoint${n}Body`)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120}>
            <Link
              href="/turtles/identifikacia"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-ink-foreground transition-opacity hover:opacity-90"
            >
              {t("identifyCta")}
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-px overflow-hidden rounded-[24px] bg-border/80 lg:grid-cols-2">
            <Reveal className="contents">
              <div className="flex h-full flex-col justify-between bg-card p-8 sm:p-10">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t("landEyebrow")}
                  </p>
                  <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05]">
                    {t("landTitle")}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                    {t("landBody")}
                  </p>
                </div>
                <Link
                  href="/turtles/xmelis-kuebi"
                  className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  {t("landCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={60} className="contents">
              <div className="flex h-full flex-col justify-between bg-card p-8 sm:p-10">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t("waterEyebrow")}
                  </p>
                  <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.05]">
                    {t("waterTitle")}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                    {t("waterBody")}
                  </p>
                </div>
                <Link
                  href="/turtles/tsqlis-kuebi"
                  className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  {t("waterCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
