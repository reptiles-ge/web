"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import { SpeciesRiskChip } from "@/components/SpeciesDanger";
import { getRegionContent } from "@/data/regionContent";
import { getRegionHeroImage } from "@/data/regionImages";
import {
  getRegionById,
  getRegionSpecies,
  getRegionVenomousSpecies,
  localizeRegionText,
  type Region,
} from "@/data/regions";
import type { Species } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { REGION_SECTION_IDS } from "@/lib/toc";
import { ArrowLeft, ArrowUpRight, Plus, Shield } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type RegionProfileProps = {
  region: Region;
};

export function RegionProfile({ region }: RegionProfileProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("regions");
  const content = getRegionContent(region.id);
  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const overview = localizeRegionText(content.overview, locale);
  const biome = localizeRegionText(content.biome, locale);

  const species = useMemo(
    () => getRegionSpecies(region).map((item) => localizeSpecies(item, locale)),
    [region, locale],
  );
  const venomous = useMemo(
    () =>
      getRegionVenomousSpecies(region).map((item) =>
        localizeSpecies(item, locale),
      ),
    [region, locale],
  );
  const related = content.relatedIds
    .map((id) => getRegionById(id))
    .filter((item): item is Region => Boolean(item));
  const faq = content.faq.map((item) => ({
    question: localizeRegionText(item.question, locale),
    answer: localizeRegionText(item.answer, locale),
  }));

  const heroSrc = getRegionHeroImage(region.id);
  const heroAlt = t("regionHeroAlt", { name });

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[70svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[75svh] lg:pb-16"
          style={{
            paddingTop: "7rem",
          }}
        >
          <CoverImage
            src={heroSrc}
            alt={heroAlt}
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-black/92" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-white/45 sm:mb-6"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-medium transition-colors hover:text-white"
                >
                  <ArrowLeft className="size-3.5" />
                  {t("breadcrumbHome")}
                </Link>
                <span aria-hidden>/</span>
                <Link
                  href="/regions"
                  className="font-medium transition-colors hover:text-white"
                >
                  {t("allRegions")}
                </Link>
                <span aria-hidden>/</span>
                <span className="text-white/70">{name}</span>
              </nav>
              <p className="text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
                {t("regionEyebrow")}
              </p>
              <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(1.85rem,5vw,4.2rem)] leading-[1.08] font-semibold text-white sm:mt-4">
                {t("regionTitle", { name, nameIn })}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-[16px]">
                {overview}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7">
                <span className="rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/70 backdrop-blur-md">
                  {biome}
                </span>
                <span className="rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/70 backdrop-blur-md">
                  {t("speciesCount", { count: species.length })}
                </span>
                {venomous.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/15 px-3.5 py-2 text-[12px] text-[#f0a399] backdrop-blur-md">
                    <Shield className="size-3.5" />
                    {t("venomousCount", { count: venomous.length })}
                  </span>
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
          <div
            className="map-explorer-texture pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("rangeEyebrow")}
              </p>
              <AnchoredHeading
                id={REGION_SECTION_IDS.range}
                slugSource={t("rangeTitle", { name })}
                className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] font-semibold"
                anchorLabel={t("anchorLink")}
              >
                {t("rangeTitle", { name })}
              </AnchoredHeading>
            </Reveal>
            <div className="mt-12 lg:mt-14">
              <GeorgiaMap highlightedIds={[region.id]} interactive={false} />
            </div>
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                  {t("habitatsEyebrow")}
                </p>
                <AnchoredHeading
                  id={REGION_SECTION_IDS.habitats}
                  className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.05] font-semibold"
                  anchorLabel={t("anchorLink")}
                >
                  {t("habitatsTitle")}
                </AnchoredHeading>
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                  {localizeRegionText(region.description, locale)}
                </p>
              </Reveal>
              <ul className="space-y-0 divide-y divide-border border-y border-border">
                {content.habitats.map((habitat, index) => (
                  <Reveal
                    key={habitat.ka}
                    as="li"
                    delay={index * 50}
                    className="flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                      {localizeRegionText(habitat, locale)}
                    </span>
                    <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                    {t("speciesEyebrow")}
                  </p>
                  <AnchoredHeading
                    id={REGION_SECTION_IDS.species}
                    slugSource={t("speciesTitle", { name, nameIn })}
                    className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] font-semibold"
                    anchorLabel={t("anchorLink")}
                  >
                    {t("speciesTitle", { name, nameIn })}
                  </AnchoredHeading>
                </div>
                <p className="hidden text-[13px] text-muted-foreground sm:block">
                  {t("speciesCount", { count: species.length })}
                </p>
              </div>
            </Reveal>

            {species.length > 0 ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {species.map((item, index) => (
                  <Reveal key={item.id} delay={index * 60}>
                    <PhotoSpeciesCard species={item} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="mt-10 text-[14px] text-muted-foreground">
                {t("empty")}
              </p>
            )}
            <p className="mt-10 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              {t("dataGapBody")}
            </p>
          </div>
        </section>

        {venomous.length > 0 ? (
          <section className="bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                  {t("venomousEyebrow")}
                </p>
                <AnchoredHeading
                  id={REGION_SECTION_IDS.venomous}
                  slugSource={t("venomousTitle", { nameIn, name })}
                  className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] font-semibold"
                  anchorLabel={t("anchorLink")}
                >
                  {t("venomousTitle", { nameIn, name })}
                </AnchoredHeading>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("venomousBody")}
                </p>
              </Reveal>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {venomous.map((item, index) => (
                  <Reveal key={item.id} delay={index * 60}>
                    <PhotoSpeciesCard species={item} showDanger />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {faq.length > 0 ? (
          <RegionFaqSection
            items={faq}
            name={name}
            nameIn={nameIn}
            regionId={region.id}
          />
        ) : null}

        <ContentAttribution />

        {related.length > 0 ? (
          <section className="border-t border-border bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                  {t("relatedEyebrow")}
                </p>
                <AnchoredHeading
                  id={REGION_SECTION_IDS.related}
                  className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-semibold"
                  anchorLabel={t("anchorLink")}
                >
                  {t("relatedTitle")}
                </AnchoredHeading>
              </Reveal>
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => {
                  const relatedContent = getRegionContent(item.id);
                  return (
                    <li key={item.id}>
                      <Reveal delay={index * 50}>
                        <Link
                          href={regionHref(item.id)}
                          className="group flex h-full flex-col border-b border-border py-6 transition-colors hover:border-primary/40"
                        >
                          <div className="flex min-h-[3.4rem] items-start justify-between gap-3">
                            <h3 className="font-display text-[22px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                              {localizeRegionText(item.name, locale)}
                            </h3>
                            <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                          </div>
                          <p className="mt-2 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                            {localizeRegionText(relatedContent.biome, locale)}
                          </p>
                          <p className="mt-3 text-[13px] text-muted-foreground">
                            {t("speciesCount", {
                              count: item.speciesIds.length,
                            })}
                          </p>
                        </Link>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function PhotoSpeciesCard({
  species,
  showDanger = false,
}: {
  species: Species;
  showDanger?: boolean;
}) {
  const locale = useLocale() as AppLocale;
  return (
    <Link
      href={speciesHref(species.id, locale)}
      onClick={() =>
        trackSpeciesClick({
          species_id: species.id,
          source: "region",
        })
      }
      className="group relative block aspect-4/5 overflow-hidden rounded-[28px] bg-ink"
    >
      <CoverImage
        src={species.mobileImage ?? species.image}
        alt={speciesImageAlt(
          species.commonName,
          species.scientificName,
          species.location,
        )}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[12px] text-white/50 italic">
          {species.scientificName}
        </p>
        <h3 className="mt-1 font-display text-[22px] font-semibold text-white">
          {species.commonName}
        </h3>
        {showDanger ? (
          <div className="mt-3">
            <SpeciesRiskChip species={species} variant="hero" />
          </div>
        ) : (
          <p className="mt-2 text-[12px] text-white/50">{species.location}</p>
        )}
      </div>
    </Link>
  );
}

function RegionFaqSection({
  items,
  name,
  nameIn,
  regionId,
}: {
  items: { question: string; answer: string }[];
  name: string;
  nameIn: string;
  regionId: string;
}) {
  const t = useTranslations("regions");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("faqEyebrow")}
            </p>
            <AnchoredHeading
              id={REGION_SECTION_IDS.faq}
              className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
              anchorLabel={t("anchorLink")}
            >
              {t("faqTitle")}
            </AnchoredHeading>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("faqIntro", { name, nameIn })}
            </p>
          </Reveal>
          <div>
            {items.map((item, index) => {
              const isOpen = open === index;
              return (
                <Reveal key={item.question} delay={index * 60}>
                  <div className="border-t border-border last:border-b">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => {
                        const next = isOpen ? null : index;
                        setOpen(next);
                        if (next !== null) {
                          trackEvent("faq_open", {
                            page_type: "region",
                            entity_id: regionId,
                            faq_index: next,
                          });
                        }
                      }}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
                    >
                      <span className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300",
                          isOpen
                            ? "rotate-45 bg-ink text-ink-foreground"
                            : "text-foreground",
                        )}
                      >
                        <Plus className="size-4" strokeWidth={1.75} />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pr-12 pb-7 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
