"use client";

import { Reveal } from "@/components/Reveal";
import {
  getRegionsForSpecies,
  localizeRegionText,
} from "@/data/regions";
import type { Species } from "@/data/species";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  getSpeciesActivityStat,
  getSpeciesHabitatStat,
  getSpeciesSizeStat,
} from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type DangerFilter = "all" | "venomous" | "harmless";

export function SpeciesIndexTable({
  species,
  locale,
}: {
  species: Species[];
  locale: AppLocale;
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

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(["all", "venomous", "harmless"] as const).map((key) => {
          const active = danger === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setDanger(key)}
              className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {t(`filter.${key}`)}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFamily("all")}
          className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
            family === "all"
              ? "border-ink bg-ink text-ink-foreground"
              : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          {t("filter.familyAll")}
        </button>
        {families.map((name) => {
          const active = family === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setFamily(name)}
              className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-[15px] text-muted-foreground">{t("empty")}</p>
      ) : (
        <>
          <div className="mt-10 space-y-px divide-y divide-border border-y border-border lg:hidden">
            {filtered.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 30, 240)}>
                <IndexCard
                  species={item}
                  locale={locale}
                  dash={dash}
                  rangePending={tShared("rangePending")}
                  venomousYes={t("venomousYes")}
                  venomousNo={t("venomousNo")}
                />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[920px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
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
                {filtered.map((item) => {
                  const href = speciesHref(item.id, locale);
                  const range = formatRange(item.id, locale, tShared("rangePending"));
                  const size = getSpeciesSizeStat(item) ?? dash;
                  const habitat = getSpeciesHabitatStat(item) ?? dash;
                  const activity = getSpeciesActivityStat(item) ?? dash;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border/80 last:border-b-0"
                    >
                      <td className="py-3 pr-4">
                        <Link href={href} className="block">
                          <span className="relative block size-14 overflow-hidden rounded-xl bg-ink">
                            <Image
                              src={item.mobileImage ?? item.image}
                              alt={speciesImageAlt(
                                item.commonName,
                                item.scientificName,
                                item.location,
                              )}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Link href={href} className="group block">
                          <span className="font-display text-[16px] font-semibold text-foreground transition-colors group-hover:text-primary">
                            {item.commonName}
                          </span>
                          <span className="mt-0.5 block text-[13px] italic text-muted-foreground">
                            {item.scientificName}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[13px]">
                        {isVenomousDanger(item.danger)
                          ? t("venomousYes")
                          : t("venomousNo")}
                      </td>
                      <td className="max-w-[12rem] py-3 pr-4 text-[13px] text-muted-foreground">
                        {range}
                      </td>
                      <td className="max-w-[11rem] py-3 pr-4 text-[13px] text-muted-foreground">
                        {size}
                      </td>
                      <td className="max-w-[11rem] py-3 pr-4 text-[13px] text-muted-foreground">
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
}: {
  species: Species;
  locale: AppLocale;
  dash: string;
  rangePending: string;
  venomousYes: string;
  venomousNo: string;
}) {
  const href = speciesHref(species.id, locale);
  const range = formatRange(species.id, locale, rangePending);
  const size = getSpeciesSizeStat(species) ?? dash;
  const habitat = getSpeciesHabitatStat(species) ?? dash;
  const activity = getSpeciesActivityStat(species) ?? dash;

  return (
    <Link href={href} className="group grid gap-4 py-6 sm:grid-cols-[5.5rem_1fr]">
      <span className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-ink sm:aspect-square">
        <Image
          src={species.mobileImage ?? species.image}
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          fill
          sizes="(max-width: 640px) 100vw, 88px"
          className="object-cover"
        />
      </span>
      <span>
        <span className="font-display text-[1.35rem] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {species.commonName}
        </span>
        <span className="mt-1 block text-[13px] italic text-muted-foreground">
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
