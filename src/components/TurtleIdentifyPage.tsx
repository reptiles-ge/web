"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
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

type TurtleId = (typeof TURTLE_ORDER)[number];

type TurtleKind = "land" | "water";
type TurtleStatus = "native" | "introduced";

const TURTLE_META: Record<TurtleId, { kind: TurtleKind; status: TurtleStatus }> =
  {
    "testudo-graeca": { kind: "land", status: "native" },
    "emys-orbicularis": { kind: "water", status: "native" },
    "mauremys-caspica": { kind: "water", status: "native" },
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
  species,
  heroSrc,
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
    <ClusterPageFrame guideId={guideId} heroSrc={heroSrc} ctaHash="#flow">
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <ClusterSectionIntro
                eyebrow={t("guideEyebrow")}
                title={t("guideTitle")}
                eyebrowClassName={CLUSTER_EYEBROW}
                titleClassName={CLUSTER_TITLE_GUIDE}
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("guideP1")}</p>
                <p>
                  {t.rich("guideP2", {
                    index: (chunks) => (
                      <Link
                        href="/turtles/saxeoebebi"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
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

      <section
        id="flow"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("flowEyebrow")}
              title={t("flowTitle")}
              body={t("flowBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
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
                  href="#land"
                  src={testudo.mobileImage ?? testudo.image}
                  alt={t("branchLandAlt")}
                  title={t("branchLandTitle")}
                  body={t("branchLandBody")}
                  result={t("branchLandResult")}
                />
              ) : null}
              {emys ? (
                <BranchCard
                  href="#water"
                  src={emys.mobileImage ?? emys.image}
                  alt={t("branchWaterAlt")}
                  title={t("branchWaterTitle")}
                  body={t("branchWaterBody")}
                  result={t("branchWaterResult")}
                />
              ) : null}
            </div>
          </div>

          <div
            id="land"
            className="mt-14 scroll-mt-28 border-y border-border py-10"
          >
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("landResultTitle")}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("landResultBody")}
            </p>
            {testudo ? (
              <SpeciesResult
                species={testudo}
                locale={locale}
                cue={t("cue.testudo-graeca")}
                profileLabel={t("viewProfile")}
              />
            ) : null}
            <Link
              href="/turtles/xmelis-kuebi"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
            >
              {t("linkLand")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div id="water" className="mt-14 scroll-mt-28">
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("step2Title")}
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("step2Body")}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {slider ? (
                <BranchCard
                  href="#slider"
                  src={slider.mobileImage ?? slider.image}
                  alt={t("branchSliderAlt")}
                  title={t("branchSliderTitle")}
                  body={t("branchSliderBody")}
                  result={t("branchSliderResult")}
                />
              ) : null}
              {mauremys ? (
                <BranchCard
                  href="#emys-vs"
                  src={mauremys.mobileImage ?? mauremys.image}
                  alt={t("branchNativeAlt")}
                  title={t("branchNativeTitle")}
                  body={t("branchNativeBody")}
                  result={t("branchNativeResult")}
                />
              ) : null}
            </div>
          </div>

          <div
            id="slider"
            className="mt-14 scroll-mt-28 border-t border-border pt-10"
          >
            <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
              {t("sliderResultTitle")}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("sliderResultBody")}
            </p>
            {slider ? (
              <SpeciesResult
                species={slider}
                locale={locale}
                cue={t("cue.trachemys-scripta")}
                profileLabel={t("viewProfile")}
              />
            ) : null}
            <Link
              href="/turtles/tsqlis-kuebi"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
            >
              {t("linkWater")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="emys-vs"
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("emysVsEyebrow")}
              title={t("emysVsTitle")}
              body={t("emysVsBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName="mt-5 max-w-3xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]"
              bodyClassName={CLUSTER_BODY}
            />
          </Reveal>

          {emys && mauremys ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <ComparePhoto
                species={emys}
                locale={locale}
                alt={t("alt.emys-orbicularis", {
                  name: emys.commonName,
                  scientific: emys.scientificName,
                })}
                caption={t("emysVsEmysCaption")}
              />
              <ComparePhoto
                species={mauremys}
                locale={locale}
                alt={t("alt.mauremys-caspica", {
                  name: mauremys.commonName,
                  scientific: mauremys.scientificName,
                })}
                caption={t("emysVsMauremysCaption")}
              />
            </div>
          ) : null}

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="py-4 pr-4 font-medium">{t("emysVsColTrait")}</th>
                  <th className="py-4 pr-4 font-medium">{t("emysVsColEmys")}</th>
                  <th className="py-4 pr-4 font-medium">
                    {t("emysVsColMauremys")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {EMYS_VS_ROWS.map((row) => (
                  <tr
                    key={row}
                    className="border-b border-border/80 last:border-b-0 align-top"
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
                href={speciesHref(emys.id, locale)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
              >
                {emys.commonName}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
            {mauremys ? (
              <Link
                href={speciesHref(mauremys.id, locale)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
              >
                {mauremys.commonName}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section
        id="matrix"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("matrixEyebrow")}
              title={t("matrixTitle")}
              body={t("matrixBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            />
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[880px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="py-4 pr-3 font-medium">{t("matrixColTrait")}</th>
                  {turtles.map((item) => (
                    <th key={item.id} className="py-4 pr-3 font-medium">
                      <Link
                        href={speciesHref(item.id, locale)}
                        className="text-foreground underline-offset-4 hover:underline"
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
                    key={row}
                    className="border-b border-border/80 last:border-b-0 align-top"
                  >
                    <th className="py-4 pr-3 text-[13px] font-medium text-foreground">
                      {t(`matrixRow.${row}`)}
                    </th>
                    {TURTLE_ORDER.map((id) => (
                      <td
                        key={id}
                        className="py-4 pr-3 text-[13px] leading-relaxed text-muted-foreground"
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
        id="chooser"
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("chooserEyebrow")}
              title={t("chooserTitle")}
              body={t("chooserBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
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
                      {t(`cue.${item.id}` as Parameters<typeof t>[0])}
                    </p>
                    <Link
                      href={speciesHref(item.id, locale)}
                      className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
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
        </div>
      </section>

      {regions.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("regionsEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.4rem,2.5vw,1.9rem)] font-semibold leading-[1.1]">
                {t("regionsTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                {t("regionsBody")}
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-3">
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
          </div>
        </section>
      ) : null}
    </ClusterPageFrame>
  );
}

function BranchCard({
  href,
  src,
  alt,
  title,
  body,
  result,
}: {
  href: string;
  src: string;
  alt: string;
  title: string;
  body: string;
  result: string;
}) {
  return (
    <a
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-foreground/25"
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-ink">
        <CoverImage
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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

function SpeciesResult({
  species,
  locale,
  cue,
  profileLabel,
}: {
  species: Species;
  locale: AppLocale;
  cue: string;
  profileLabel: string;
}) {
  return (
    <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
      <Link
        href={speciesHref(species.id, locale)}
        className="relative block aspect-[5/4] w-full shrink-0 overflow-hidden rounded-xl bg-ink sm:w-44"
      >
        <CoverImage
          src={species.mobileImage ?? species.image}
          alt={`${species.commonName} (${species.scientificName})`}
          sizes="180px"
          className="object-cover"
        />
      </Link>
      <div className="min-w-0">
        <p className="font-display text-[18px] font-semibold text-foreground">
          {species.commonName}
        </p>
        <p className="mt-1 text-[13px] italic text-muted-foreground">
          {species.scientificName}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {cue}
        </p>
        <Link
          href={speciesHref(species.id, locale)}
          className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
        >
          {profileLabel}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function ComparePhoto({
  species,
  locale,
  alt,
  caption,
}: {
  species: Species;
  locale: AppLocale;
  alt: string;
  caption: string;
}) {
  return (
    <figure>
      <Link
        href={speciesHref(species.id, locale)}
        className="relative block aspect-[5/4] overflow-hidden rounded-2xl bg-ink"
      >
        <CoverImage
          src={species.mobileImage ?? species.image}
          alt={alt}
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-cover"
        />
      </Link>
      <figcaption className="mt-3">
        <p className="font-display text-[16px] font-semibold text-foreground">
          {species.commonName}
        </p>
        <p className="mt-1 text-[12px] italic text-muted-foreground">
          {species.scientificName}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {caption}
        </p>
      </figcaption>
    </figure>
  );
}
