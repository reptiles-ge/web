"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  GLASS_LIZARD_COMPARE_IDS,
  orderSpeciesByIds,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { getSpeciesSizeStat } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function LizardComparePage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("lizardCompare");
  const locale = useLocale() as AppLocale;
  const ordered = orderSpeciesByIds(species, GLASS_LIZARD_COMPARE_IDS);
  const glass = ordered.find((item) => item.id === "pseudopus-apodus");
  const slowWorm = ordered.find((item) => item.id === "anguis-colchica");
  const grassSnake = ordered.find((item) => item.id === "natrix-natrix");
  const diceSnake = ordered.find((item) => item.id === "natrix-tessellata");
  const dash = t("emDash");
  const columns = [glass, slowWorm, grassSnake].filter(
    (item): item is Species => Boolean(item),
  );

  return (
    <ClusterPageFrame guideId={guideId} heroSrc={heroSrc} ctaHash="#compare">
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("guideEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("guideTitle")}
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("guideP1")}</p>
                <p>{t("guideP2")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="compare"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("tableEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("tableTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("tableBody")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {columns.map((item, index) => (
              <Reveal key={item.id} delay={index * 50}>
                <CompareCard
                  species={item}
                  locale={locale}
                  role={t(`role.${roleKey(item.id)}`)}
                  size={getSpeciesSizeStat(item) ?? dash}
                />
              </Reveal>
            ))}
          </div>

          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[640px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="py-4 pr-4 font-medium">{t("col.trait")}</th>
                  {columns.map((item) => (
                    <th key={item.id} className="py-4 pr-4 font-medium">
                      {item.commonName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                  <tr key={n} className="border-b border-border/80 last:border-b-0">
                    <td className="py-4 pr-4 font-display text-[15px] font-medium">
                      {t(`row${n}Label`)}
                    </td>
                    {columns.map((item) => (
                      <td
                        key={`${item.id}-${n}`}
                        className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground"
                      >
                        {t(`row${n}.${roleKey(item.id)}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {diceSnake ? (
        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("alsoEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("alsoTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("alsoBody")}
              </p>
              <Link
                href={speciesHref(diceSnake.id, locale)}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
              >
                {diceSnake.commonName}
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}
    </ClusterPageFrame>
  );
}

function roleKey(id: string) {
  if (id === "pseudopus-apodus") return "glass";
  if (id === "anguis-colchica") return "slow";
  return "snake";
}

function CompareCard({
  species,
  locale,
  role,
  size,
}: {
  species: Species;
  locale: AppLocale;
  role: string;
  size: string;
}) {
  return (
    <Link
      href={speciesHref(species.id, locale)}
      className="group block overflow-hidden rounded-[24px] border border-border bg-card"
    >
      <span className="relative block aspect-[5/4] bg-ink">
        <Image
          src={species.image}
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </span>
      <span className="block p-5">
        <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
          {role}
        </span>
        <span className="mt-2 block font-display text-[20px] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {species.commonName}
        </span>
        <span className="mt-1 block text-[13px] italic text-muted-foreground">
          {species.scientificName}
        </span>
        <span className="mt-3 block text-[13px] text-muted-foreground">
          {size}
        </span>
      </span>
    </Link>
  );
}
