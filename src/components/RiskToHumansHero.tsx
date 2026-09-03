"use client";

import { useTranslations } from "next-intl";

import type { DangerLevel } from "@/data/species";

import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { DANGER_LEVEL_HASH, DANGER_LEVEL_ORDER } from "@/lib/dangerLevels";

type RiskToHumansHeroProps = {
  countByLevel: Record<DangerLevel, number>;
};

export function RiskToHumansHero({ countByLevel }: RiskToHumansHeroProps) {
  const t = useTranslations("riskToHumans");
  const tDanger = useTranslations("danger");

  return (
    <>
      <section className="bg-background pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pb-16">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                <li>
                  <Link
                    className="transition-colors hover:text-foreground"
                    href="/"
                  >
                    {t("breadcrumbHome")}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  /
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-foreground"
                    href="/species"
                  >
                    {t("breadcrumbSpecies")}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  /
                </li>
                <li className="text-foreground">{t("breadcrumbCurrent")}</li>
              </ol>
            </nav>

            <h1 className="text-balance-tight max-w-4xl font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.05] font-semibold text-foreground">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-[16px]">
              {t("subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
              {DANGER_LEVEL_ORDER.map((level) => {
                const tone = levelTone(level);
                return (
                  <a
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3.5 py-2 transition-opacity hover:opacity-80",
                      tone.chip,
                    )}
                    href={`#${DANGER_LEVEL_HASH[level]}`}
                    key={level}
                  >
                    <span
                      aria-hidden="true"
                      className={cn("size-1.5 rounded-full", tone.dot)}
                    />
                    <span
                      className={cn(
                        "text-[12px] font-semibold tracking-wide",
                        tone.value,
                      )}
                    >
                      {tDanger(level)}
                    </span>
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-10 sm:py-12">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
          {DANGER_LEVEL_ORDER.map((level) => (
            <a
              className="group block"
              href={`#${DANGER_LEVEL_HASH[level]}`}
              key={level}
            >
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                {countByLevel[level]}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground transition-colors group-hover:text-foreground">
                {t(`stat${level}`)}
              </p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function levelTone(level: DangerLevel) {
  switch (level) {
    case "High":
      return {
        chip: "bg-destructive/15 text-destructive",
        dot: "bg-destructive",
        value: "text-destructive",
      };
    case "Moderate":
      return {
        chip: "bg-gold/20 text-gold",
        dot: "bg-gold",
        value: "text-gold",
      };
    default:
      return {
        chip: "bg-primary/15 text-primary",
        dot: "bg-primary",
        value: "text-primary",
      };
  }
}
