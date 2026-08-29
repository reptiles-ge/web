"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import {
  getRegionsForSpecies,
  localizeRegionText,
  type Region,
} from "@/data/regions";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";
import { speciesHref, regionHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const TURTLE_ORDER = [
  "testudo-graeca",
  "emys-orbicularis",
  "mauremys-caspica",
  "trachemys-scripta",
] as const;

type TurtleKind = "land" | "water";
type TurtleStatus = "native" | "introduced";

const TURTLE_META: Record<
  (typeof TURTLE_ORDER)[number],
  { kind: TurtleKind; status: TurtleStatus }
> = {
  "testudo-graeca": { kind: "land", status: "native" },
  "emys-orbicularis": { kind: "water", status: "native" },
  "mauremys-caspica": { kind: "water", status: "native" },
  "trachemys-scripta": { kind: "water", status: "introduced" },
};

export function TurtleIdentifyPage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("turtleIdentify");
  const locale = useLocale() as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const turtles = TURTLE_ORDER.map((id) => byId.get(id)).filter(
    (item): item is Species => Boolean(item),
  );

  const regionMap = new Map<string, Region>();
  for (const item of turtles) {
    for (const region of getRegionsForSpecies(item.id)) {
      regionMap.set(region.id, region);
    }
  }
  const regions = [...regionMap.values()];

  return (
    <ClusterPageFrame guideId={guideId} heroSrc={heroSrc} ctaHash="#flow">
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
                <p>
                  {t.rich("guideP1", {
                    index: (chunks) => (
                      <Link
                        href="/turtles/saxeoebebi"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                    land: (chunks) => (
                      <Link
                        href="/turtles/xmelis-kuebi"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                    water: (chunks) => (
                      <Link
                        href="/turtles/tsqlis-kuebi"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <p>{t("guideP2")}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/turtles/saxeoebebi"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                >
                  {t("linkIndex")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  href="/turtles/xmelis-kuebi"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                >
                  {t("linkLand")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  href="/turtles/tsqlis-kuebi"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                >
                  {t("linkWater")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="species"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("overviewEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("overviewTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("overviewBody")}
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="py-4 pr-4 font-medium">{t("colSpecies")}</th>
                  <th className="py-4 pr-4 font-medium">{t("colKind")}</th>
                  <th className="py-4 pr-4 font-medium">{t("colStatus")}</th>
                  <th className="py-4 pr-4 font-medium">{t("colScientific")}</th>
                </tr>
              </thead>
              <tbody>
                {turtles.map((item) => {
                  const meta = TURTLE_META[item.id as keyof typeof TURTLE_META];
                  if (!meta) return null;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border/80 last:border-b-0"
                    >
                      <td className="py-4 pr-4">
                        <Link
                          href={speciesHref(item.id, locale)}
                          className="font-display text-[15px] font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          {item.commonName}
                        </Link>
                      </td>
                      <td className="py-4 pr-4 text-[14px] text-muted-foreground">
                        {t(`kind.${meta.kind}`)}
                      </td>
                      <td className="py-4 pr-4 text-[14px] text-muted-foreground">
                        {t(`status.${meta.status}`)}
                      </td>
                      <td className="py-4 pr-4 text-[14px] italic text-muted-foreground">
                        {item.scientificName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        id="flow"
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("flowEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("flowTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("flowBody")}
            </p>
          </Reveal>
          <ol className="mt-14 divide-y divide-border border-y border-border">
            {([1, 2, 3, 4] as const).map((n) => (
              <Reveal key={n} delay={n * 40}>
                <li className="grid gap-4 py-7 sm:grid-cols-[4rem_1fr] sm:items-start">
                  <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
                    {String(n).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                      {t(`step${n}Title`)}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                      {t(`step${n}Body`)}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="compare"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("compareEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("compareTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("compareBody")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {turtles.map((item, index) => {
              const meta = TURTLE_META[item.id as keyof typeof TURTLE_META];
              if (!meta) return null;
              const alt = t(`alt.${item.id}` as Parameters<typeof t>[0], {
                name: item.commonName,
                scientific: item.scientificName,
              });
              return (
                <Reveal key={item.id} delay={index * 40}>
                  <article className="flex h-full flex-col">
                    <Link
                      href={speciesHref(item.id, locale)}
                      className="group block"
                    >
                      <figure>
                        <span className="relative block aspect-[5/4] overflow-hidden rounded-2xl bg-ink">
                          <CoverImage
                            src={item.mobileImage ?? item.image}
                            alt={alt}
                            sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 280px"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </span>
                      </figure>
                      <h3 className="mt-4 font-display text-[17px] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                        {item.commonName}
                      </h3>
                    </Link>
                    <p className="mt-1 text-[12px] italic text-muted-foreground">
                      {item.scientificName}
                    </p>
                    <p className="mt-3 text-[12px] font-medium tracking-wide text-foreground/80">
                      {t(`kind.${meta.kind}`)}
                      {" · "}
                      {t(`status.${meta.status}`)}
                    </p>
                    <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                      {item.identification?.summary ?? item.description}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      {item.location}
                    </p>
                    <Link
                      href={speciesHref(item.id, locale)}
                      className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
                    >
                      {item.commonName}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/turtles/xmelis-kuebi"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
            >
              {t("linkLand")}
              <ArrowUpRight className="size-3.5" />
            </Link>
            <Link
              href="/turtles/tsqlis-kuebi"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
            >
              {t("linkWater")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="range"
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("rangeEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("rangeTitle")}
            </h2>
            <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p>{t("rangeP1")}</p>
              <p>{t("rangeP2")}</p>
            </div>
          </Reveal>

          {regions.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-3">
              {regions.map((region) => (
                <Link
                  key={region.id}
                  href={regionHref(region.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                >
                  {localizeRegionText(region.name, locale)}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ))}
            </div>
          ) : null}

          <Link
            href="/species"
            className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
          >
            {t("linkAtlas")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
