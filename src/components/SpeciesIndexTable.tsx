"use client";

import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { getRegionsForSpecies, localizeRegionText } from "@/data/regions";
import type { Species } from "@/data/species";
import { isVenomousDanger, getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  getSpeciesActivityStat,
  getSpeciesHabitatStat,
  getSpeciesSizeStat,
} from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type DangerFilter = "all" | "venomous" | "harmless";

export function SpeciesIndexTable({
  species,
  locale,
  showDangerFilter = true,
  showFamilyFilter = true,
}: {
  species: Species[];
  locale: AppLocale;
  showDangerFilter?: boolean;
  showFamilyFilter?: boolean;
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
      page_type: "guide",
      group,
      danger_filter: nextDanger,
      family_filter: nextFamily,
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
                key={key}
                type="button"
                onClick={() => {
                  if (key === danger) return;
                  setDanger(key);
                  emitIndexFilter(key, family, countFiltered(key, family));
                }}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
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
            type="button"
            onClick={() => {
              if (family === "all") return;
              setFamily("all");
              emitIndexFilter(danger, "all", countFiltered(danger, "all"));
            }}
            className={cn(
              "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
              family === "all"
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {t("filter.familyAll")}
          </button>
          {families.map((name) => {
            const active = family === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (family === name) return;
                  setFamily(name);
                  emitIndexFilter(danger, name, countFiltered(danger, name));
                }}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
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
              <Reveal key={item.id} delay={Math.min(index * 30, 240)}>
                <IndexCard
                  species={item}
                  locale={locale}
                  dash={dash}
                  rangePending={tShared("rangePending")}
                  venomousYes={t("venomousYes")}
                  venomousNo={t("venomousNo")}
                  position={index + 1}
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
                      species_id: item.id,
                      source: "index",
                      position: rowIndex + 1,
                    });
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border/80 last:border-b-0"
                    >
                      <td className="py-3 pr-4">
                        <Link href={href} className="block" onClick={onClick}>
                          <span className="relative block size-14 overflow-hidden rounded-xl bg-ink">
                            <CoverImage
                              src={item.mobileImage ?? item.image}
                              alt={speciesImageAlt(
                                item.commonName,
                                item.scientificName,
                                item.location,
                              )}
                              sizes="56px"
                              className="object-cover"
                            />
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          href={href}
                          className="group block"
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
  species,
  locale,
  dash,
  rangePending,
  venomousYes,
  venomousNo,
  position,
}: {
  species: Species;
  locale: AppLocale;
  dash: string;
  rangePending: string;
  venomousYes: string;
  venomousNo: string;
  position: number;
}) {
  const href = speciesHref(species.id, locale);
  const range = formatRange(species.id, locale, rangePending);
  const size = getSpeciesSizeStat(species) ?? dash;
  const habitat = getSpeciesHabitatStat(species) ?? dash;
  const activity = getSpeciesActivityStat(species) ?? dash;

  return (
    <Link
      href={href}
      onClick={() =>
        trackSpeciesClick({
          species_id: species.id,
          source: "index",
          position,
        })
      }
      className="group grid gap-4 py-6 sm:grid-cols-[5.5rem_1fr]"
    >
      <span className="relative aspect-5/4 overflow-hidden rounded-2xl bg-ink sm:aspect-square">
        <CoverImage
          src={species.mobileImage ?? species.image}
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          sizes="(max-width: 640px) 100vw, 88px"
          className="object-cover"
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
