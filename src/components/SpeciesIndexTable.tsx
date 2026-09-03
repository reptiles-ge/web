"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { getRegionsForSpecies, localizeRegionText } from "@/data/regions";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  getSpeciesActivityStat,
  getSpeciesHabitatStat,
  getSpeciesSizeStat,
} from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";

type DangerFilter = "all" | "harmless" | "venomous";

export function SpeciesIndexTable({
  locale,
  showDangerFilter = true,
  showFamilyFilter = true,
  species,
}: {
  locale: AppLocale;
  showDangerFilter?: boolean;
  showFamilyFilter?: boolean;
  species: Species[];
}) {
  const t = useTranslations("speciesIndex");
  const tShared = useTranslations("groupHubShared");
  const [danger, setDanger] = useState<DangerFilter>("all");
  const [family, setFamily] = useState("all");

  const families = useMemo(
    () => [...new Set(species.map((item) => item.family))].sort(),
    [species],
  );

  const filtered = useMemo(() => {
    return species.filter((item) => {
      if (danger === "venomous" && !isVenomousDanger(item.danger)) return false;
      if (danger === "harmless" && isVenomousDanger(item.danger)) return false;
      if (family !== "all" && item.family !== family) return false;
      return true;
    });
  }, [species, danger, family]);

  const dash = t("emDash");
  const showFilters = showDangerFilter || showFamilyFilter;
  const group = species[0]
    ? getSpeciesAtlasMeta(species[0].id).group
    : undefined;

  function emitIndexFilter(
    nextDanger: DangerFilter,
    nextFamily: string,
    resultCount: number,
  ) {
    trackEvent("index_filter", {
      danger_filter: nextDanger,
      family_filter: nextFamily,
      group,
      page_type: "guide",
      result_count: resultCount,
    });
  }

  function countFiltered(nextDanger: DangerFilter, nextFamily: string) {
    return species.filter((item) => {
      if (nextDanger === "venomous" && !isVenomousDanger(item.danger))
        return false;
      if (nextDanger === "harmless" && isVenomousDanger(item.danger))
        return false;
      if (nextFamily !== "all" && item.family !== nextFamily) return false;
      return true;
    }).length;
  }

  return (
    <div>
      {showDangerFilter ? (
        <div className="flex flex-wrap gap-2">
          {(["all", "venomous", "harmless"] as const).map((key) => {
            const active = danger === key;
            return (
              <button
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
                key={key}
                onClick={() => {
                  if (key === danger) return;
                  setDanger(key);
                  emitIndexFilter(key, family, countFiltered(key, family));
                }}
                type="button"
              >
                {t(`filter.${key}`)}
              </button>
            );
          })}
        </div>
      ) : null}
      {showFamilyFilter ? (
        <div
          className={
            showDangerFilter
              ? "mt-3 flex flex-wrap gap-2"
              : "flex flex-wrap gap-2"
          }
        >
          <button
            className={cn(
              "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
              family === "all"
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
            onClick={() => {
              if (family === "all") return;
              setFamily("all");
              emitIndexFilter(danger, "all", countFiltered(danger, "all"));
            }}
            type="button"
          >
            {t("filter.familyAll")}
          </button>
          {families.map((name) => {
            const active = family === name;
            return (
              <button
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
                key={name}
                onClick={() => {
                  if (family === name) return;
                  setFamily(name);
                  emitIndexFilter(danger, name, countFiltered(danger, name));
                }}
                type="button"
              >
                {name}
              </button>
            );
          })}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-10 text-[15px] text-muted-foreground">{t("empty")}</p>
      ) : (
        <>
          <div
            className={cn(
              showFilters && "mt-10",
              "space-y-px divide-y divide-border border-y border-border lg:hidden",
            )}
          >
            {filtered.map((item, index) => (
              <Reveal delay={Math.min(index * 30, 240)} key={item.id}>
                <IndexCard
                  dash={dash}
                  locale={locale}
                  position={index + 1}
                  rangePending={tShared("rangePending")}
                  species={item}
                  venomousNo={t("venomousNo")}
                  venomousYes={t("venomousYes")}
                />
              </Reveal>
            ))}
          </div>

          <div
            className={cn(
              showFilters && "mt-10",
              "hidden overflow-x-auto lg:block",
            )}
          >
            <table className="w-full min-w-[920px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  <th className="py-4 pr-4 font-medium">{t("col.photo")}</th>
                  <th className="py-4 pr-4 font-medium">{t("col.name")}</th>
                  <th className="py-4 pr-4 font-medium">{t("col.venom")}</th>
                  <th className="py-4 pr-4 font-medium">{t("col.range")}</th>
                  <th className="py-4 pr-4 font-medium">{t("col.size")}</th>
                  <th className="py-4 pr-4 font-medium">{t("col.habitat")}</th>
                  <th className="py-4 font-medium">{t("col.activity")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, rowIndex) => {
                  const href = speciesHref(item.id, locale);
                  const range = formatRange(
                    item.id,
                    locale,
                    tShared("rangePending"),
                  );
                  const size = getSpeciesSizeStat(item) ?? dash;
                  const habitat = getSpeciesHabitatStat(item) ?? dash;
                  const activity = getSpeciesActivityStat(item) ?? dash;
                  const onClick = () =>
                    trackSpeciesClick({
                      position: rowIndex + 1,
                      source: "index",
                      species_id: item.id,
                    });
                  return (
                    <tr
                      className="border-b border-border/80 last:border-b-0"
                      key={item.id}
                    >
                      <td className="py-3 pr-4">
                        <Link className="block" href={href} onClick={onClick}>
                          <span className="relative block size-14 overflow-hidden rounded-xl bg-ink">
                            <CoverImage
                              alt={speciesImageAlt(
                                item.commonName,
                                item.scientificName,
                                item.location,
                              )}
                              className="object-cover"
                              sizes="56px"
                              src={item.mobileImage ?? item.image}
                            />
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          className="group block"
                          href={href}
                          onClick={onClick}
                        >
                          <span className="font-display text-[16px] font-semibold text-foreground transition-colors group-hover:text-primary">
                            {item.commonName}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-muted-foreground italic">
                            {item.scientificName}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[13px]">
                        {isVenomousDanger(item.danger)
                          ? t("venomousYes")
                          : t("venomousNo")}
                      </td>
                      <td className="max-w-48 py-3 pr-4 text-[13px] text-muted-foreground">
                        {range}
                      </td>
                      <td className="max-w-44 py-3 pr-4 text-[13px] text-muted-foreground">
                        {size}
                      </td>
                      <td className="max-w-44 py-3 pr-4 text-[13px] text-muted-foreground">
                        {habitat}
                      </td>
                      <td className="py-3 text-[13px] text-muted-foreground">
                        {activity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function formatRange(id: string, locale: AppLocale, pending: string) {
  const names = getRegionsForSpecies(id).map((region) =>
    localizeRegionText(region.name, locale),
  );
  if (names.length === 0) return pending;
  const shown = names.slice(0, 2);
  const extra = names.length - shown.length;
  return extra > 0 ? `${shown.join(" · ")} +${extra}` : shown.join(" · ");
}

function IndexCard({
  dash,
  locale,
  position,
  rangePending,
  species,
  venomousNo,
  venomousYes,
}: {
  dash: string;
  locale: AppLocale;
  position: number;
  rangePending: string;
  species: Species;
  venomousNo: string;
  venomousYes: string;
}) {
  const href = speciesHref(species.id, locale);
  const range = formatRange(species.id, locale, rangePending);
  const size = getSpeciesSizeStat(species) ?? dash;
  const habitat = getSpeciesHabitatStat(species) ?? dash;
  const activity = getSpeciesActivityStat(species) ?? dash;

  return (
    <Link
      className="group grid gap-4 py-6 sm:grid-cols-[5.5rem_1fr]"
      href={href}
      onClick={() =>
        trackSpeciesClick({
          position,
          source: "index",
          species_id: species.id,
        })
      }
    >
      <span className="relative aspect-5/4 overflow-hidden rounded-2xl bg-ink sm:aspect-square">
        <CoverImage
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 88px"
          src={species.mobileImage ?? species.image}
        />
      </span>
      <span>
        <span className="font-display text-[1.35rem] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
          {species.commonName}
        </span>
        <span className="mt-1 block text-[13px] text-muted-foreground italic">
          {species.scientificName}
        </span>
        <span className="mt-3 block text-[13px] text-muted-foreground">
          {isVenomousDanger(species.danger) ? venomousYes : venomousNo}
          {" · "}
          {range}
        </span>
        <span className="mt-1 block text-[13px] text-muted-foreground">
          {size}
          {" · "}
          {habitat}
          {activity !== dash ? ` · ${activity}` : ""}
        </span>
      </span>
    </Link>
  );
}
