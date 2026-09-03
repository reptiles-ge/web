"use client";

import {
  AtlasFilterButton,
  AtlasFilterSheet,
} from "@/components/species-atlas/AtlasFilterSheet";
import { AtlasSpeciesGrid } from "@/components/species-atlas/AtlasSpeciesGrid";
import { CoverImage } from "@/components/CoverImage";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import {
  countAtlasFacets,
  defaultAtlasFilters,
  filterAtlasSpecies,
  getAtlasStats,
  getRecentlyUpdatedSpecies,
  getSpeciesAtlasMeta,
  type AnimalGroup,
  type AtlasFilters,
  type HabitatTag,
} from "@/data/speciesAtlas";
import { localizeRegionText, regions } from "@/data/regions";
import { getCatalogSpecies, images, type Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { trackEvent, truncateSearchTerm } from "@/lib/analytics";
import { speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, parseAsStringEnum, throttle, useQueryState } from "nuqs";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

const GROUP_OPTIONS = [
  "all",
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "spider",
  ] as const satisfies readonly (AnimalGroup | "all")[];

const DANGER_OPTIONS = ["all", "venomous", "harmless"] as const;

const HABITAT_OPTIONS = [
  "all",
  "forest",
  "mountain",
  "wetland",
  "grassland",
  ] as const satisfies readonly (HabitatTag | "all")[];

const REGION_OPTIONS = ["all", ...regions.map((region) => region.id)] as readonly string[];

function AnimatedValue({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    const from = displayRef.current;
    if (from === value) return;

    let frame = 0;
    let start: number | null = null;
    const duration = 900;

    function tick(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (value - from) * eased);
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    }
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span className={className}>{display}</span>;
}

function HeroPathway({
  onClick,
  href,
  eyebrow,
  title,
  meta,
  delay = 0,
}: {
  onClick?: () => void;
  href?:
    | "/snakes"
    | "/lizards"
    | "/turtles"
    | "/amphibians"
    | "/birds"
    | "/mammals"
    | "/spiders"
    | "/venomous-snakes";
  eyebrow: string;
  title: string;
  meta: string;
  delay?: number;
}) {
  const className =
    "group flex min-w-[10.5rem] flex-1 flex-col items-start rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:min-w-[12rem] sm:px-5 sm:py-5";
  const style = { animationDelay: `${delay}ms` };
  const content = (
    <>
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
        {eyebrow}
      </span>
      <span className="mt-3 font-display text-[1.35rem] font-semibold leading-tight text-white sm:text-[1.5rem]">
        {title}
      </span>
      <span className="mt-2 flex items-center gap-1.5 text-[13px] text-white/55 transition-colors group-hover:text-white/80">
        {meta}
        <ArrowUpRight className="size-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {content}
    </button>
  );
}

function LensOption({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-[14px] transition-colors ${
        active
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function LensRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-border/70 py-4 sm:flex-row sm:items-baseline sm:gap-8">
      <p className="w-24 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:pt-0.5">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {children}
      </div>
    </div>
  );
}

export function SpeciesAtlas() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("speciesAtlas");

  const [group, setGroup] = useQueryState(
    "type",
    parseAsStringEnum([...GROUP_OPTIONS]).withDefault(
      defaultAtlasFilters.group,
    ),
  );
  const [danger, setDanger] = useQueryState(
    "danger",
    parseAsStringEnum([...DANGER_OPTIONS]).withDefault(
      defaultAtlasFilters.danger,
    ),
  );
  const [habitat, setHabitat] = useQueryState(
    "habitat",
    parseAsStringEnum([...HABITAT_OPTIONS]).withDefault(
      defaultAtlasFilters.habitat,
    ),
  );
  const [region, setRegion] = useQueryState(
    "region",
    parseAsStringEnum([...REGION_OPTIONS]).withDefault(
      defaultAtlasFilters.region,
    ),
  );
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(defaultAtlasFilters.query),
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const filters = useMemo<AtlasFilters>(
    () => ({ group, danger, habitat, region, query }),
    [group, danger, habitat, region, query],
  );
  const deferredQuery = useDeferredValue(filters.query);
  const skipAtlasFilter = useRef(true);
  const lastQuery = useRef(filters.query);

  const catalog = useMemo(
    () =>
      getCatalogSpecies().map((item) => {
        const localized = localizeSpecies(item, locale);
        const ka = localizeSpecies(item, "ka");
        const en = localizeSpecies(item, "en");
        const ru = localizeSpecies(item, "ru");
        const tr = localizeSpecies(item, "tr");
        return {
          ...localized,
          searchText: [
            localized.commonName,
            ka.commonName,
            en.commonName,
            ru.commonName,
            tr.commonName,
            localized.scientificName,
            localized.genus,
            localized.family,
            localized.location,
            ka.location,
            en.location,
            ru.location,
            tr.location,
            localized.description,
            ka.description,
            en.description,
            ru.description,
            tr.description,
          ]
            .join(" ")
            .toLowerCase(),
        };
      }),
    [locale],
  );
  const stats = useMemo(() => getAtlasStats(getCatalogSpecies()), []);
  const recent = useMemo(
    () =>
      getRecentlyUpdatedSpecies(4).map((item) => localizeSpecies(item, locale)),
    [locale],
  );

  const activeFilters: AtlasFilters = useMemo(
    () => ({
      ...filters,
      query: deferredQuery,
    }),
    [filters, deferredQuery],
  );

  const filtered = useMemo(
    () => filterAtlasSpecies(catalog, activeFilters),
    [catalog, activeFilters],
  );

  useEffect(() => {
    if (skipAtlasFilter.current) {
      skipAtlasFilter.current = false;
      lastQuery.current = filters.query;
      return;
    }
    const queryChanged = lastQuery.current !== filters.query;
    lastQuery.current = filters.query;
    const delay = queryChanged ? 500 : 0;
    const timer = window.setTimeout(() => {
      const isDefault =
        filters.group === defaultAtlasFilters.group &&
        filters.danger === defaultAtlasFilters.danger &&
        filters.habitat === defaultAtlasFilters.habitat &&
        filters.region === defaultAtlasFilters.region &&
        !filters.query.trim();
      trackEvent("atlas_filter", {
        action: isDefault ? "reset" : "apply",
        group_filter: filters.group,
        danger_filter: filters.danger,
        habitat_filter: filters.habitat,
        region_filter: filters.region,
        search_term: filters.query.trim()
          ? truncateSearchTerm(filters.query)
          : undefined,
        result_count: filtered.length,
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [filters, filtered.length]);

  const groupCounts = useMemo(() => {
    const counts: Record<AnimalGroup | "all", number> = {
      all: catalog.length,
      snake: 0,
      lizard: 0,
      turtle: 0,
      amphibian: 0,
      bird: 0,
      mammal: 0,
      spider: 0,
    };
    for (const item of catalog) {
      counts[getSpeciesAtlasMeta(item.id).group] += 1;
    }
    return counts;
  }, [catalog]);

  const facetCount = countAtlasFacets(filters);

  function updateFilter<K extends keyof AtlasFilters>(
    key: K,
    value: AtlasFilters[K],
  ) {
    switch (key) {
      case "group":
        setGroup(value as AtlasFilters["group"], {
          history: "replace",
          shallow: true,
          scroll: false,
        });
        break;
      case "danger":
        setDanger(value as AtlasFilters["danger"], {
          history: "replace",
          shallow: true,
          scroll: false,
        });
        break;
      case "habitat":
        setHabitat(value as AtlasFilters["habitat"], {
          history: "replace",
          shallow: true,
          scroll: false,
        });
        break;
      case "region":
        setRegion(value as AtlasFilters["region"], {
          history: "replace",
          shallow: true,
          scroll: false,
        });
        break;
      case "query":
        setQuery(value as AtlasFilters["query"], {
          history: "replace",
          shallow: true,
          scroll: false,
          limitUrlUpdates: throttle(200),
        });
        break;
    }
  }

  function resetFilters() {
    setGroup(defaultAtlasFilters.group, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setDanger(defaultAtlasFilters.danger, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setHabitat(defaultAtlasFilters.habitat, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setRegion(defaultAtlasFilters.region, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setQuery(defaultAtlasFilters.query, {
      history: "replace",
      shallow: true,
      scroll: false,
      limitUrlUpdates: throttle(200),
    });
  }

  function applyFilters(next: AtlasFilters) {
    setGroup(next.group, { history: "replace", shallow: true, scroll: false });
    setDanger(next.danger, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setHabitat(next.habitat, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setRegion(next.region, {
      history: "replace",
      shallow: true,
      scroll: false,
    });
    setQuery(next.query, {
      history: "replace",
      shallow: true,
      scroll: false,
      limitUrlUpdates: throttle(200),
    });
  }

  const hasActiveFilters = facetCount > 0 || filters.query.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[72svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-14 lg:min-h-[78svh] lg:pb-20"
          style={{
            paddingTop: "7rem",
          }}
        >
          <CoverImage
            src={images.hero}
            alt={t("heroImageAlt")}
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/92" />
          <div className="absolute inset-0 bg-[radial-gradient(95%_70%_at_50%_15%,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-white"
                    >
                      {t("breadcrumbHome")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/30">
                    /
                  </li>
                  <li className="text-white/80">{t("breadcrumbSpecies")}</li>
                </ol>
              </nav>

              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">
                {t("eyebrow")}
              </p>
              <h1 className="mt-3 max-w-4xl font-display text-balance-tight text-[clamp(2rem,5.8vw,4.6rem)] font-semibold leading-[1.05] text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:mt-5 sm:text-[16px]">
                {t("subtitle")}
              </p>

              <div className="mt-10 max-w-4xl sm:mt-12">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-white/12 pb-5">
                  <p className="font-display text-[clamp(3rem,8vw,4.75rem)] font-semibold leading-none tracking-tight text-white">
                    <AnimatedValue value={stats.total} />
                  </p>
                  <div className="pb-1.5">
                    <p className="text-[13px] font-medium text-white/80 sm:text-[14px]">
                      {t("stats.catalogTitle")}
                    </p>
                    <p className="mt-1 text-[12px] text-white/45">
                      {t("stats.catalogMeta", {
                        photos: stats.photos,
                        regions: stats.regions,
                      })}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
                  {t("stats.pathwaysLabel")}
                </p>

                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar sm:mt-4 sm:flex-wrap sm:gap-3 sm:overflow-visible">
                  <HeroPathway
                    delay={0}
                    eyebrow={t("groups.snake")}
                    title={t("stats.pathwaySnakesTitle", {
                      count: stats.snakes,
                    })}
                    meta={t("stats.pathwayExplore")}
                    href="/snakes"
                  />
                  <HeroPathway
                    delay={60}
                    eyebrow={t("stats.pathwayRisk")}
                    title={t("stats.pathwayVenomousTitle", {
                      count: stats.venomous,
                    })}
                    meta={t("stats.pathwayExplore")}
                    href="/venomous-snakes"
                  />
                  {stats.lizards > 0 ? (
                    <HeroPathway
                      delay={120}
                      eyebrow={t("groups.lizard")}
                      title={t("stats.pathwayLizardsTitle", {
                        count: stats.lizards,
                      })}
                      meta={t("stats.pathwayExplore")}
                      href="/lizards"
                    />
                  ) : null}
                  {stats.turtles > 0 ? (
                    <HeroPathway
                      delay={180}
                      eyebrow={t("groups.turtle")}
                      title={t("stats.pathwayTurtlesTitle", {
                        count: stats.turtles,
                      })}
                      meta={t("stats.pathwayExplore")}
                      href="/turtles"
                    />
                  ) : null}
                  {stats.amphibians > 0 ? (
                    <HeroPathway
                      delay={240}
                      eyebrow={t("groups.amphibian")}
                      title={t("stats.pathwayAmphibiansTitle", {
                        count: stats.amphibians,
                      })}
                      meta={t("stats.pathwayExplore")}
                      href="/amphibians"
                    />
                  ) : null}
                  {stats.birds > 0 ? (
                    <HeroPathway
                      delay={260}
                      eyebrow={t("groups.bird")}
                      title={t("stats.pathwayBirdsTitle", {
                        count: stats.birds,
                      })}
                      meta={t("stats.pathwayExplore")}
                      href="/birds"
                    />
                  ) : null}
                  {stats.mammals > 0 ? (
                    <HeroPathway
                      delay={280}
                      eyebrow={t("groups.mammal")}
                      title={t("stats.pathwayMammalsTitle", {
                        count: stats.mammals,
                      })}
                      meta={t("stats.pathwayExplore")}
                      href="/mammals"
                    />
                  ) : null}
                  {stats.spiders > 0 ? (
                    <HeroPathway
                      delay={300}
                      eyebrow={t("groups.spider")}
                      title={t("stats.pathwaySpidersTitle", {
                        count: stats.spiders,
                      })}
                      meta={t("stats.pathwayExplore")}
                      href="/spiders"
                    />
                  ) : null}
                  <Link
                    href="/regions"
                    className="group flex min-w-[10.5rem] flex-1 flex-col items-start rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:min-w-[12rem] sm:px-5 sm:py-5"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                      {t("stats.pathwayPlace")}
                    </span>
                    <span className="mt-3 font-display text-[1.35rem] font-semibold leading-tight text-white sm:text-[1.5rem]">
                      {t("stats.pathwayRegionsTitle", {
                        count: stats.regions,
                      })}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-[13px] text-white/55 transition-colors group-hover:text-white/80">
                      {t("stats.pathwayMap")}
                      <ArrowUpRight className="size-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>

                <p className="mt-5 max-w-xl text-[13px] leading-relaxed text-white/40">
                  {t("stats.expandingNote")}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="explorer"
          className="border-b border-border bg-background py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  {t("explorerEyebrow")}
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.05] text-foreground">
                  {t("explorerTitle")}
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("explorerSubtitle")}
                </p>
              </div>
            </Reveal>

            <div className="mt-10 lg:mt-12">
              <div className="flex items-center gap-3">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">{t("searchPlaceholder")}</span>
                  <Search
                    className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground md:left-0"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={filters.query}
                    onChange={(event) =>
                      updateFilter("query", event.target.value)
                    }
                    placeholder={t("searchPlaceholder")}
                    className="w-full border-0 border-b border-border bg-transparent py-3 pl-7 pr-8 text-[15px] text-foreground outline-none transition-[border-color] placeholder:text-muted-foreground/70 focus:border-foreground"
                  />
                  {filters.query ? (
                    <button
                      type="button"
                      onClick={() => updateFilter("query", "")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={t("clearSearch")}
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </label>
                <AtlasFilterButton
                  count={facetCount}
                  onClick={() => setFilterOpen(true)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 md:mt-6">
                <p
                  className="text-[13px] text-muted-foreground"
                  aria-live="polite"
                >
                  {t("resultsCount", { count: filtered.length })}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[13px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {t("resetFilters")}
                  </button>
                ) : null}
              </div>

              <div className="mt-8 hidden md:block">
                <div
                  role="tablist"
                  aria-label={t("filters.type")}
                  className="flex gap-6 overflow-x-auto no-scrollbar sm:gap-8"
                >
                  {GROUP_OPTIONS.map((group) => {
                    const active = filters.group === group;
                    const count = groupCounts[group];
                    return (
                      <button
                        key={group}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => updateFilter("group", group)}
                        className={`group/tab relative shrink-0 pb-4 transition-colors ${
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="font-display text-[1.15rem] font-semibold tracking-tight sm:text-[1.35rem]">
                          {group === "all"
                            ? t("filters.allSpecies")
                            : t(`groups.${group}`)}
                        </span>
                        <span
                          className={`ml-2 align-top text-[12px] tabular-nums ${
                            active ? "text-primary" : "text-muted-foreground/70"
                          }`}
                        >
                          {count}
                        </span>
                        <span
                          className={`absolute inset-x-0 bottom-0 h-px transition-colors ${
                            active
                              ? "bg-foreground"
                              : "bg-transparent group-hover/tab:bg-border"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-border" />

                <LensRow label={t("filters.danger")}>
                  {DANGER_OPTIONS.map((danger) => (
                    <LensOption
                      key={danger}
                      active={filters.danger === danger}
                      onClick={() => updateFilter("danger", danger)}
                    >
                      {t(`danger.${danger}`)}
                    </LensOption>
                  ))}
                </LensRow>

                <LensRow label={t("filters.habitat")}>
                  {HABITAT_OPTIONS.map((habitat) => (
                    <LensOption
                      key={habitat}
                      active={filters.habitat === habitat}
                      onClick={() => updateFilter("habitat", habitat)}
                    >
                      {habitat === "all"
                        ? t("filters.all")
                        : t(`habitats.${habitat}`)}
                    </LensOption>
                  ))}
                </LensRow>

                <div className="flex flex-col gap-2.5 border-t border-border/70 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                  <p className="w-24 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:pt-0.5">
                    {t("filters.region")}
                  </p>
                  <label className="relative inline-flex min-w-[12rem] items-center">
                    <select
                      value={filters.region}
                      onChange={(event) =>
                        updateFilter("region", event.target.value)
                      }
                      className="w-full cursor-pointer appearance-none border-0 bg-transparent py-0 pr-7 text-[14px] font-medium text-foreground outline-none"
                      aria-label={t("filters.region")}
                    >
                      <option value="all">{t("filters.allRegions")}</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {localizeRegionText(region.name, locale)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-0 size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </label>
                </div>
              </div>
            </div>

            <AtlasFilterSheet
              open={filterOpen}
              filters={filters}
              locale={locale}
              onClose={() => setFilterOpen(false)}
              onApply={applyFilters}
            />

            {filtered.length > 0 ? (
              <AtlasSpeciesGrid species={filtered} locale={locale} />
            ) : (
              <ComingSoonPanel
                group={filters.group !== "all" ? filters.group : null}
                onReset={resetFilters}
              />
            )}
          </div>
        </section>

        <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0 map-explorer-texture"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("mapEyebrow")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05] text-foreground">
                {t("mapTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                {t("mapSubtitle")}
              </p>
            </Reveal>
            <div className="mt-12 lg:mt-16">
              <GeorgiaMap selectionMode="navigate" mapContext="atlas" />
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/regions"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                {t("openRegionsAtlas")}
              </Link>
            </div>
          </div>
        </section>

        <SeoAuthoritySection />

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("recentEyebrow")}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.05]">
                {t("recentTitle")}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {t("recentSubtitle")}
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {recent.map((species) => (
                <li key={species.id}>
                  <RecentSpeciesRow species={species} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-surface/60 py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  {t("aboutEyebrow")}
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("aboutTitle")}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {t("aboutLead")}
                </p>
                {stats.lastUpdated ? (
                  <p className="mt-6 text-[13px] text-muted-foreground">
                    {t("lastUpdated", {
                      date: formatContentDate(stats.lastUpdated, locale),
                    })}
                  </p>
                ) : null}
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2">
                <TrustCard title={t("methodTitle")} body={t("methodBody")} />
                <TrustCard title={t("sourcesTitle")} body={t("sourcesBody")} />
                <TrustCard title={t("photosTitle")} body={t("photosBody")} />
                <TrustCard
                  title={t("contributorsTitle")}
                  body={t("contributorsBody")}
                  href="/about"
                  linkLabel={t("contributorsLink")}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ComingSoonPanel({
  group,
  onReset,
}: {
  group: AnimalGroup | "all" | null;
  onReset: () => void;
}) {
  const t = useTranslations("speciesAtlas");
  const title =
    group && group !== "all"
      ? t("emptyGroupTitle", { group: t(`groups.${group}`) })
      : t("emptyTitle");

  return (
    <div className="mt-12 rounded-[28px] border border-border bg-card px-6 py-14 text-center sm:px-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {t("emptyEyebrow")}
      </p>
      <h3 className="mx-auto mt-4 max-w-lg font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        {t("emptyBody")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
        >
          {t("resetFilters")}
        </button>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30"
        >
          {t("suggestSpecies")}
        </Link>
      </div>
    </div>
  );
}

function RecentSpeciesRow({ species }: { species: Species }) {
  const t = useTranslations("speciesAtlas");
  const locale = useLocale() as AppLocale;
  const meta = getSpeciesAtlasMeta(species.id);

  return (
    <Link
      href={speciesHref(species.id, locale)}
      className="group flex items-center gap-4 rounded-[22px] border border-border/80 bg-card p-3 transition-colors hover:border-primary/25 sm:gap-5 sm:p-4"
    >
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-2xl bg-ink sm:size-[84px]">
        {(species.mobileImage || species.image) &&
        !(species.mobileImage ?? species.image).includes(
          "species-placeholder",
        ) ? (
          <CoverImage
            src={species.mobileImage ?? species.image}
            alt=""
            sizes="84px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-[1.15rem] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {species.commonName}
          </h3>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {t(`groups.${meta.group}`)}
          </span>
        </div>
        <p className="mt-1 truncate text-[13px] italic text-muted-foreground">
          {species.scientificName}
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          {t("updatedOn", {
            date: formatContentDate(species.updatedAt, locale),
          })}
        </p>
      </div>
    </Link>
  );
}

function TrustCard({
  title,
  body,
  href,
  linkLabel,
}: {
  title: string;
  body: string;
  href?: "/about";
  linkLabel?: string;
}) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card px-5 py-6 sm:px-6">
      <h3 className="font-display text-[1.15rem] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        {body}
      </p>
      {href && linkLabel ? (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
        >
          {linkLabel}
          <ArrowUpRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

function SeoAuthoritySection() {
  const t = useTranslations("speciesAtlas");
  const locale = useLocale() as AppLocale;

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[860px] px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            {t("seoEyebrow")}
          </p>
        </Reveal>

        <article className="mt-8 space-y-12">
          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.reptilesTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
              <p>{t("seo.reptilesP1")}</p>
              <p>{t("seo.reptilesP2")}</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.amphibiansTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-muted-foreground">
              {t("seo.amphibiansP1")}
            </p>
            <p className="mt-4">
              <Link
                href="/amphibians"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
              >
                {t("seo.amphibiansTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.birdsTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-muted-foreground">
              {t("seo.birdsP1")}
            </p>
            <p className="mt-4">
              <Link
                href="/birds"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
              >
                {t("seo.birdsTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.mammalsTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-muted-foreground">
              {t("seo.mammalsP1")}
            </p>
            <p className="mt-4">
              <Link
                href="/mammals"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
              >
                {t("seo.mammalsTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.spidersTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-muted-foreground">
              {t("seo.spidersP1")}
            </p>
            <p className="mt-4">
              <Link
                href="/spiders"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
              >
                {t("seo.spidersTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.venomousTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
              <p>{t("seo.venomousP1")}</p>
              <p>{t("seo.venomousP2")}</p>
            </div>
            <ul className="mt-5 space-y-2 border-l-2 border-primary/25 pl-4">
              <li>
                <Link
                  href={speciesHref("macrovipera-lebetina", locale)}
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Macrovipera lebetina
                </Link>
              </li>
              <li>
                <Link
                  href={speciesHref("vipera-kaznakovi", locale)}
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Vipera kaznakovi
                </Link>
              </li>
              <li>
                <Link
                  href={speciesHref("vipera-dinniki", locale)}
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Vipera dinniki
                </Link>
              </li>
              <li>
                <Link
                  href={speciesHref("vipera-transcaucasiana", locale)}
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Vipera transcaucasiana
                </Link>
              </li>
            </ul>
            <Link
              href="/venomous-snakes"
              className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("seo.venomousGuideCta")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
              {t("seo.regionsTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
              <p>{t("seo.regionsP1")}</p>
              <p>{t("seo.regionsP2")}</p>
            </div>
            <p className="mt-5">
              <Link
                href="/regions"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-primary"
              >
                {t("openRegionsAtlas")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
