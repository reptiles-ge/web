"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function TurtleIdentifyPage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("turtleIdentify");
  const locale = useLocale() as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const land = [byId.get("testudo-graeca")].filter(
    (item): item is Species => Boolean(item),
  );
  const waterNative = [
    byId.get("emys-orbicularis"),
    byId.get("mauremys-caspica"),
  ].filter((item): item is Species => Boolean(item));
  const introduced = [byId.get("trachemys-scripta")].filter(
    (item): item is Species => Boolean(item),
  );

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
                <p>{t("guideP1")}</p>
                <p>{t("guideP2")}</p>
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

      <IdGroup
        eyebrow={t("landEyebrow")}
        title={t("landTitle")}
        body={t("landBody")}
        species={land}
        locale={locale}
        ctaHref="/turtles/xmelis-kuebi"
        ctaLabel={t("landCta")}
      />

      <IdGroup
        eyebrow={t("waterEyebrow")}
        title={t("waterTitle")}
        body={t("waterBody")}
        species={waterNative}
        locale={locale}
        ctaHref="/turtles/tsqlis-kuebi"
        ctaLabel={t("waterCta")}
        surface
      />

      <IdGroup
        eyebrow={t("introducedEyebrow")}
        title={t("introducedTitle")}
        body={t("introducedBody")}
        species={introduced}
        locale={locale}
      />
    </ClusterPageFrame>
  );
}

function IdGroup({
  eyebrow,
  title,
  body,
  species,
  locale,
  ctaHref,
  ctaLabel,
  surface,
}: {
  eyebrow: string;
  title: string;
  body: string;
  species: Species[];
  locale: AppLocale;
  ctaHref?: "/turtles/xmelis-kuebi" | "/turtles/tsqlis-kuebi";
  ctaLabel?: string;
  surface?: boolean;
}) {
  return (
    <section
      className={`border-t border-border py-20 lg:py-28 ${
        surface ? "bg-surface" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {body}
          </p>
          {ctaHref && ctaLabel ? (
            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
            >
              {ctaLabel}
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
        </Reveal>
        {species.length === 1 ? (
          <div className="mt-10 max-w-sm">
            <TurtleCard species={species[0]} locale={locale} />
          </div>
        ) : (
          <SpeciesGuideList species={species} locale={locale} />
        )}
      </div>
    </section>
  );
}

function TurtleCard({
  species,
  locale,
}: {
  species: Species;
  locale: AppLocale;
}) {
  return (
    <Link href={speciesHref(species.id, locale)} className="group block">
      <span className="relative block aspect-[5/4] overflow-hidden rounded-2xl bg-ink">
        <Image
          src={species.mobileImage ?? species.image}
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          fill
          sizes="(max-width: 1024px) 80vw, 360px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </span>
      <span className="mt-3 block font-display text-[16px] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
        {species.commonName}
      </span>
      <span className="mt-1 block text-[12px] italic text-muted-foreground">
        {species.scientificName}
      </span>
    </Link>
  );
}
