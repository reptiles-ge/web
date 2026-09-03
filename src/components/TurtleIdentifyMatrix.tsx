"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { speciesHref } from "@/lib/speciesRoutes";
import { TURTLE_ORDER } from "@/lib/turtleIdentify";

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

type TurtleIdentifyMatrixProps = {
  emys?: Species;
  locale: AppLocale;
  mauremys?: Species;
  turtles: Species[];
};

export function TurtleIdentifyMatrix({
  emys,
  locale,
  mauremys,
  turtles,
}: TurtleIdentifyMatrixProps) {
  const t = useTranslations("turtleIdentify");

  return (
    <>
      <ClusterContentSection
        body={t("emysVsBody")}
        eyebrow={t("emysVsEyebrow")}
        id="emys-vs"
        surface="background"
        title={t("emysVsTitle")}
      >
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
      </ClusterContentSection>

      <ClusterContentSection
        body={t("matrixBody")}
        eyebrow={t("matrixEyebrow")}
        id="matrix"
        title={t("matrixTitle")}
      >
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[880px] border-y border-border text-left">
            <thead>
              <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                <th className="py-4 pr-3 font-medium">{t("matrixColTrait")}</th>
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
      </ClusterContentSection>
    </>
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
