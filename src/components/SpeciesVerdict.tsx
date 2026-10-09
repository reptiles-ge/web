import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { DangerLevel, PhotoCredit } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";

import { SpeciesMobileHeroCredit } from "@/components/SpeciesMobileHeroCredit";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";

const LINK_LIMIT = 2;

const TONE: Record<DangerLevel, { band: string; label: string }> = {
  Harmless: { band: "bg-primary/10", label: "text-primary" },
  High: { band: "bg-destructive/10", label: "text-destructive" },
  Moderate: { band: "bg-gold/15", label: "text-gold" },
};

export async function SpeciesVerdict({
  credits,
  guideLinks,
  level,
  locale,
  speciesId,
}: {
  credits: Array<PhotoCredit | undefined>;
  guideLinks: HubClusterCard[];
  level?: DangerLevel;
  locale: AppLocale;
  speciesId: string;
}) {
  const credit = (
    <SpeciesMobileHeroCredit
      credits={credits}
      key={speciesId}
      speciesId={speciesId}
    />
  );
  if (!level) return credit;

  const [t, tCard, tDanger, tRisk, tHubs, tSafety] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "card" }),
    getTranslations({ locale, namespace: "danger" }),
    getTranslations({ locale, namespace: "riskToHumans" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "home.safetyStrip" }),
  ]);
  const links = guideLinks
    .filter((card) => card.kind === "page")
    .slice(0, LINK_LIMIT);
  const tone = TONE[level];

  return (
    <div className="flex min-w-0 flex-col">
      {credit}
      <section className="mx-4 mt-3 flex flex-1 flex-col overflow-hidden rounded-[28px] bg-card shadow-[0_14px_36px_rgba(14,20,17,0.06)] lg:mx-0 lg:mt-0 lg:rounded-[32px] lg:shadow-[0_16px_40px_rgba(14,20,17,0.08)]">
        <div
          className={cn(
            "px-5 pt-[18px] pb-4 lg:px-7 lg:pt-6 lg:pb-5",
            tone.band,
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              className={cn(
                "text-[11px] font-medium tracking-[0.18em] uppercase",
                tone.label,
              )}
            >
              {tCard("dangerLevel")}
            </h2>
            <Link
              aria-label={tDanger("linkAria", {
                label: tCard("dangerLevel"),
                value: tDanger(level),
              })}
              className={cn(
                "inline-flex min-h-7 items-center gap-1 text-[12.5px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                tone.label,
              )}
              href={dangerPageHref(level)}
            >
              {tDanger(level)}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <p className="mt-2 font-display text-[20px] leading-[1.3] font-semibold text-foreground lg:mt-3 lg:text-[24px]">
            {tRisk(`scale${level}Title`)}
          </p>
        </div>
        <div className="flex flex-1 flex-col px-5 pt-4 pb-2 lg:px-7 lg:pt-5 lg:pb-3">
          <p className="text-[14.5px] leading-[1.6] text-muted-foreground lg:text-[15.5px] lg:leading-[1.65]">
            {level === "Harmless"
              ? t("verdictHarmlessBody")
              : tRisk(`scale${level}Body`)}
          </p>
          {level === "High" || level === "Moderate" ? (
            <a
              aria-label={tSafety("call")}
              className="mt-3 inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-destructive/25 px-3.5 text-[13px] font-semibold text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive lg:hidden"
              href="tel:112"
            >
              <Phone aria-hidden="true" className="size-3.5" />
              112 · {t("emergencyShort")}
            </a>
          ) : null}
          {links.length > 0 ? (
            <ul className="mt-2.5 flex flex-wrap items-center gap-x-5 border-t border-border lg:mt-auto lg:gap-x-6">
              {links.map((card) =>
                card.kind === "page" ? (
                  <li key={card.key}>
                    <Link
                      className="inline-flex min-h-12 items-center gap-1.5 text-[14px] font-medium text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      href={card.href}
                    >
                      <span className="border-b border-foreground/30 pb-0.5">
                        {tHubs(`cluster.${card.key}.title`)}
                      </span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          ) : null}
        </div>
      </section>
    </div>
  );
}
