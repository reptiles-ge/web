"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { type TurtleId } from "@/components/TurtleIdentifyMatrix";
import {
  getRegionsForSpecies,
  localizeRegionText,
  type Region,
} from "@/data/regions";
import { Link } from "@/i18n/navigation";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

type TurtleKind = "land" | "water";
type TurtleStatus = "introduced" | "native";

const TURTLE_META: Record<
  TurtleId,
  { kind: TurtleKind; status: TurtleStatus }
> = {
  "emys-orbicularis": { kind: "water", status: "native" },
  "mauremys-caspica": { kind: "water", status: "native" },
  "testudo-graeca": { kind: "land", status: "native" },
  "trachemys-scripta": { kind: "water", status: "introduced" },
};

type TurtleIdentifyChooserProps = {
  locale: AppLocale;
  regions: Region[];
  turtles: Species[];
};

export function collectTurtleRegions(turtles: Species[]) {
  const regionMap = new Map<string, Region>();
  for (const item of turtles) {
    for (const region of getRegionsForSpecies(item.id)) {
      regionMap.set(region.id, region);
    }
  }
  return [...regionMap.values()];
}

export function TurtleIdentifyChooser({
  locale,
  regions,
  turtles,
}: TurtleIdentifyChooserProps) {
  const t = useTranslations("turtleIdentify");

  return (
    <>
      <ClusterContentSection
        body={t("chooserBody")}
        eyebrow={t("chooserEyebrow")}
        id="chooser"
        surface="background"
        title={t("chooserTitle")}
      >
        <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {turtles.map((item, index) => (
            <TurtleChooserCard
              index={index}
              item={item}
              key={item.id}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
            href="/turtles/saxeoebebi"
          >
            {t("linkIndex")}
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
            href="/turtles/xmelis-kuebi"
          >
            {t("linkLand")}
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
            href="/turtles/tsqlis-kuebi"
          >
            {t("linkWater")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </ClusterContentSection>

      {regions.length > 0 ? (
        <ClusterContentSection
          body={t("regionsBody")}
          eyebrow={t("regionsEyebrow")}
          surface="surface"
          title={t("regionsTitle")}
        >
          <div className="mt-8 flex flex-wrap gap-3">
            {regions.map((region) => (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                href={regionHref(region.id)}
                key={region.id}
              >
                {localizeRegionText(region.name, locale)}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </ClusterContentSection>
      ) : null}
    </>
  );
}

function TurtleChooserCard({
  index,
  item,
  locale,
}: {
  index: number;
  item: Species;
  locale: AppLocale;
}) {
  const t = useTranslations("turtleIdentify");
  const meta = TURTLE_META[item.id as TurtleId];
  if (!meta) {
    return null;
  }
  const alt = t(`alt.${item.id}` as Parameters<typeof t>[0], {
    name: item.commonName,
    scientific: item.scientificName,
  });

  return (
    <Reveal delay={index * 40}>
      <article className="flex h-full flex-col">
        <Link className="group block" href={speciesHref(item.id, locale)}>
          <figure>
            <span className="relative block aspect-5/4 overflow-hidden rounded-2xl bg-ink">
              <CoverImage
                alt={alt}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 280px"
                src={item.mobileImage ?? item.image}
              />
            </span>
          </figure>
          <h3 className="mt-4 font-display text-[17px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
            {item.commonName}
          </h3>
        </Link>
        <p className="mt-1 text-[12px] text-muted-foreground italic">
          {item.scientificName}
        </p>
        <p className="mt-3 text-[12px] font-medium tracking-wide text-foreground/80">
          {t(`kind.${meta.kind}`)}
          {" · "}
          {t(`status.${meta.status}`)}
        </p>
        <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
          {t(`cue.${item.id}` as Parameters<typeof t>[0])}
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
          href={speciesHref(item.id, locale)}
        >
          {t("viewProfile")}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </article>
    </Reveal>
  );
}
