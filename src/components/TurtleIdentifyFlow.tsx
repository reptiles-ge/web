"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { CoverImage } from "@/components/CoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { Link } from "@/i18n/navigation";

type TurtleIdentifyFlowProps = {
  emys?: Species;
  locale: AppLocale;
  mauremys?: Species;
  slider?: Species;
  testudo?: Species;
};

export function TurtleIdentifyFlow({
  emys,
  locale,
  mauremys,
  slider,
  testudo,
}: TurtleIdentifyFlowProps) {
  const t = useTranslations("turtleIdentify");

  return (
    <ClusterContentSection
      body={t("flowBody")}
      eyebrow={t("flowEyebrow")}
      id="flow"
      title={t("flowTitle")}
    >
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
    </ClusterContentSection>
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
        href={useSpeciesHref(species.id, locale)}
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
          href={useSpeciesHref(species.id, locale)}
        >
          {profileLabel}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
