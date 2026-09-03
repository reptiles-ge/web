"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import {
  getRegionsForSpecies,
  localizeRegionText,
  type Region,
} from "@/data/regions";
import { Link } from "@/i18n/navigation";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

const TURTLE_ORDER = [
  "testudo-graeca",
  "emys-orbicularis",
  "mauremys-caspica",
  "trachemys-scripta",
] as const;

type TurtleId = (typeof TURTLE_ORDER)[number];

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

const MATRIX_ROWS = [
  "habitat",
  "shellShape",
  "shellPattern",
  "headMark",
  "neckMark",
  "fieldMark",
  "status",
] as const;

const EMYS_VS_ROWS = [
  "shell",
  "headNeck",
  "plastron",
  "habitat",
  "range",
] as const;

export function TurtleIdentifyPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = useTranslations("turtleIdentify");
  const locale = useLocale() as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const turtles = TURTLE_ORDER.map((id) => byId.get(id)).filter(
    (item): item is Species => Boolean(item),
  );
  const testudo = byId.get("testudo-graeca");
  const emys = byId.get("emys-orbicularis");
  const mauremys = byId.get("mauremys-caspica");
  const slider = byId.get("trachemys-scripta");

  const regionMap = new Map<string, Region>();
  for (const item of turtles) {
    for (const region of getRegionsForSpecies(item.id)) {
      regionMap.set(region.id, region);
    }
  }
  const regions = [...regionMap.values()];

  return (
    <ClusterPageFrame ctaHash="#flow" guideId={guideId} heroSrc={heroSrc}>
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>
              {t.rich("guideP2", {
                index: (chunks) => (
                  <Link
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    href="/turtles/saxeoebebi"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="flow"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("flowBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("flowEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("flowTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>

          <div className="mt-14">
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("step1Title")}
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("step1Body")}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {testudo ? (
                <BranchCard
                  alt={t("branchLandAlt")}
                  body={t("branchLandBody")}
                  href="#land"
                  result={t("branchLandResult")}
                  src={testudo.mobileImage ?? testudo.image}
                  title={t("branchLandTitle")}
                />
              ) : null}
              {emys ? (
                <BranchCard
                  alt={t("branchWaterAlt")}
                  body={t("branchWaterBody")}
                  href="#water"
                  result={t("branchWaterResult")}
                  src={emys.mobileImage ?? emys.image}
                  title={t("branchWaterTitle")}
                />
              ) : null}
            </div>
          </div>

          <div
            className="mt-14 scroll-mt-28 border-y border-border py-10"
            id="land"
          >
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("landResultTitle")}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("landResultBody")}
            </p>
            {testudo ? (
              <SpeciesResult
                cue={t("cue.testudo-graeca")}
                locale={locale}
                profileLabel={t("viewProfile")}
                species={testudo}
              />
            ) : null}
            <Link
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
              href="/turtles/xmelis-kuebi"
            >
              {t("linkLand")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-14 scroll-mt-28" id="water">
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("step2Title")}
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("step2Body")}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {slider ? (
                <BranchCard
                  alt={t("branchSliderAlt")}
                  body={t("branchSliderBody")}
                  href="#slider"
                  result={t("branchSliderResult")}
                  src={slider.mobileImage ?? slider.image}
                  title={t("branchSliderTitle")}
                />
              ) : null}
              {mauremys ? (
                <BranchCard
                  alt={t("branchNativeAlt")}
                  body={t("branchNativeBody")}
                  href="#emys-vs"
                  result={t("branchNativeResult")}
                  src={mauremys.mobileImage ?? mauremys.image}
                  title={t("branchNativeTitle")}
                />
              ) : null}
            </div>
          </div>

          <div
            className="mt-14 scroll-mt-28 border-t border-border pt-10"
            id="slider"
          >
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("sliderResultTitle")}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("sliderResultBody")}
            </p>
            {slider ? (
              <SpeciesResult
                cue={t("cue.trachemys-scripta")}
                locale={locale}
                profileLabel={t("viewProfile")}
                species={slider}
              />
            ) : null}
            <Link
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
              href="/turtles/tsqlis-kuebi"
            >
              {t("linkWater")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
        id="emys-vs"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("emysVsBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("emysVsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("emysVsTitle")}
              titleClassName="mt-5 max-w-3xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]"
            />
          </Reveal>

          {emys && mauremys ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <ComparePhoto
                alt={t("alt.emys-orbicularis", {
                  name: emys.commonName,
                  scientific: emys.scientificName,
                })}
                caption={t("emysVsEmysCaption")}
                locale={locale}
                species={emys}
              />
              <ComparePhoto
                alt={t("alt.mauremys-caspica", {
                  name: mauremys.commonName,
                  scientific: mauremys.scientificName,
                })}
                caption={t("emysVsMauremysCaption")}
                locale={locale}
                species={mauremys}
              />
            </div>
          ) : null}

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  <th className="py-4 pr-4 font-medium">
                    {t("emysVsColTrait")}
                  </th>
                  <th className="py-4 pr-4 font-medium">
                    {t("emysVsColEmys")}
                  </th>
                  <th className="py-4 pr-4 font-medium">
                    {t("emysVsColMauremys")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {EMYS_VS_ROWS.map((row) => (
                  <tr
                    className="border-b border-border/80 align-top last:border-b-0"
                    key={row}
                  >
                    <th className="py-4 pr-4 text-[14px] font-medium text-foreground">
                      {t(`emysVsRow.${row}`)}
                    </th>
                    <td className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground">
                      {t(`emysVs.emys.${row}`)}
                    </td>
                    <td className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground">
                      {t(`emysVs.mauremys.${row}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {emys ? (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                href={speciesHref(emys.id, locale)}
              >
                {emys.commonName}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
            {mauremys ? (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                href={speciesHref(mauremys.id, locale)}
              >
                {mauremys.commonName}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="matrix"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("matrixBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("matrixEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("matrixTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[880px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  <th className="py-4 pr-3 font-medium">
                    {t("matrixColTrait")}
                  </th>
                  {turtles.map((item) => (
                    <th className="py-4 pr-3 font-medium" key={item.id}>
                      <Link
                        className="text-foreground underline-offset-4 hover:underline"
                        href={speciesHref(item.id, locale)}
                      >
                        {item.commonName}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row) => (
                  <tr
                    className="border-b border-border/80 align-top last:border-b-0"
                    key={row}
                  >
                    <th className="py-4 pr-3 text-[13px] font-medium text-foreground">
                      {t(`matrixRow.${row}`)}
                    </th>
                    {TURTLE_ORDER.map((id) => (
                      <td
                        className="py-4 pr-3 text-[13px] leading-relaxed text-muted-foreground"
                        key={id}
                      >
                        {t(`matrix.${id}.${row}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
        id="chooser"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("chooserBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("chooserEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("chooserTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {turtles.map((item, index) => {
              const meta = TURTLE_META[item.id as TurtleId];
              if (!meta) return null;
              const alt = t(`alt.${item.id}` as Parameters<typeof t>[0], {
                name: item.commonName,
                scientific: item.scientificName,
              });
              return (
                <Reveal delay={index * 40} key={item.id}>
                  <article className="flex h-full flex-col">
                    <Link
                      className="group block"
                      href={speciesHref(item.id, locale)}
                    >
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
            })}
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
        </div>
      </section>

      {regions.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("regionsEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.4rem,2.5vw,1.9rem)] leading-[1.1] font-semibold">
                {t("regionsTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                {t("regionsBody")}
              </p>
            </Reveal>
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
          </div>
        </section>
      ) : null}
    </ClusterPageFrame>
  );
}

function BranchCard({
  alt,
  body,
  href,
  result,
  src,
  title,
}: {
  alt: string;
  body: string;
  href: string;
  result: string;
  src: string;
  title: string;
}) {
  return (
    <a
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-foreground/25"
      href={href}
    >
      <span className="relative block aspect-16/10 overflow-hidden bg-ink">
        <CoverImage
          alt={alt}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 90vw, 45vw"
          src={src}
        />
      </span>
      <span className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="font-display text-[18px] font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {body}
        </span>
        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-foreground">
          {result}
          <ArrowUpRight className="size-3.5" />
        </span>
      </span>
    </a>
  );
}

function ComparePhoto({
  alt,
  caption,
  locale,
  species,
}: {
  alt: string;
  caption: string;
  locale: AppLocale;
  species: Species;
}) {
  return (
    <figure>
      <Link
        className="relative block aspect-5/4 overflow-hidden rounded-2xl bg-ink"
        href={speciesHref(species.id, locale)}
      >
        <CoverImage
          alt={alt}
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 45vw"
          src={species.mobileImage ?? species.image}
        />
      </Link>
      <figcaption className="mt-3">
        <p className="font-display text-[16px] font-semibold text-foreground">
          {species.commonName}
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground italic">
          {species.scientificName}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {caption}
        </p>
      </figcaption>
    </figure>
  );
}

function SpeciesResult({
  cue,
  locale,
  profileLabel,
  species,
}: {
  cue: string;
  locale: AppLocale;
  profileLabel: string;
  species: Species;
}) {
  return (
    <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
      <Link
        className="relative block aspect-5/4 w-full shrink-0 overflow-hidden rounded-xl bg-ink sm:w-44"
        href={speciesHref(species.id, locale)}
      >
        <CoverImage
          alt={`${species.commonName} (${species.scientificName})`}
          className="object-cover"
          sizes="180px"
          src={species.mobileImage ?? species.image}
        />
      </Link>
      <div className="min-w-0">
        <p className="font-display text-[18px] font-semibold text-foreground">
          {species.commonName}
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground italic">
          {species.scientificName}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {cue}
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
          href={speciesHref(species.id, locale)}
        >
          {profileLabel}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
