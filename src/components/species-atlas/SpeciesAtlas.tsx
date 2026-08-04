"use client";

import { AtlasSpeciesCard } from "@/components/species-atlas/AtlasSpeciesCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { GeorgiaMap } from "@/components/map/GeorgiaMap";
import { Reveal } from "@/components/Reveal";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  atlasFiltersToSearchParams,
  defaultAtlasFilters,
  filterAtlasSpecies,
  getAtlasPhotographers,
  getAtlasStats,
  getRecentlyUpdatedSpecies,
  getSpeciesAtlasMeta,
  type AnimalGroup,
  type AtlasFilters,
  type HabitatTag,
} from "@/data/speciesAtlas";
import {
  localizeRegionText,
  regions,
} from "@/data/regions";
import { getCatalogSpecies, images, type Species } from "@/data/species";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

type SpeciesAtlasProps = {
  initialFilters?: AtlasFilters;
};

const GROUP_OPTIONS: Array<AnimalGroup | "all"> = [
  "all",
  "snake",
  "lizard",
  "turtle",
  "amphibian",
];

const DANGER_OPTIONS = ["all", "venomous", "harmless"] as const;

const HABITAT_OPTIONS: Array<HabitatTag | "all"> = [
  "all",
  "forest",
  "mountain",
  "wetland",
  "grassland",
];

function AnimatedStat({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start: number | null = null;
    const duration = 900;
    const timeout = window.setTimeout(() => {
      function tick(ts: number) {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
      }
      frame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return (
    <div className="min-w-[7.5rem] rounded-2xl border border-white/12 bg-white/5 px-4 py-3.5 backdrop-blur-md sm:min-w-[8.5rem]">
      <p className="font-display text-[1.65rem] font-semibold tabular-nums leading-none text-white sm:text-[1.85rem]">
        {display}
      </p>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-2 text-[12px] font-medium tracking-wide transition-colors ${
        active
          ? "bg-primary text-white dark:text-ink"
          : "bg-secondary text-foreground/75 hover:bg-secondary/80 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function SpeciesAtlas({
  initialFilters = defaultAtlasFilters,
}: SpeciesAtlasProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("speciesAtlas");
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<AtlasFilters>(initialFilters);
  const deferredQuery = useDeferredValue(filters.query);

  const catalog = useMemo(
    () =>
      getCatalogSpecies().map((item) => {
        const localized = localizeSpecies(item, locale);
        const other = localizeSpecies(item, locale === "en" ? "ka" : "en");
        return {
          ...localized,
          searchText: [
            localized.commonName,
            other.commonName,
            localized.scientificName,
            localized.genus,
            localized.family,
            localized.location,
            other.location,
            localized.description,
            other.description,
          ]
            .join(" ")
            .toLowerCase(),
        };
      }),
    [locale],
  );
  const stats = useMemo(() => getAtlasStats(getCatalogSpecies()), []);
  const photographers = useMemo(
    () => getAtlasPhotographers(getCatalogSpecies()),
    [],
  );
  const recent = useMemo(
    () =>
      getRecentlyUpdatedSpecies(4).map((item) =>
        localizeSpecies(item, locale),
      ),
    [locale],
  );

  const activeFilters: AtlasFilters = {
    ...filters,
    query: deferredQuery,
  };

  const filtered = useMemo(
    () => filterAtlasSpecies(catalog, activeFilters),
    [catalog, activeFilters],
  );

  useEffect(() => {
    const params = atlasFiltersToSearchParams(filters);
    const next = params.toString();
    const current =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    if (next === current) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  function updateFilter<K extends keyof AtlasFilters>(
    key: K,
    value: AtlasFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultAtlasFilters);
  }

  const hasActiveFilters =
    filters.group !== "all" ||
    filters.danger !== "all" ||
    filters.habitat !== "all" ||
    filters.region !== "all" ||
    filters.query.trim().length > 0;

  const comingSoonGroups: AnimalGroup[] = [];
  if (filters.group === "turtle" || filters.group === "amphibian") {
    comingSoonGroups.push(filters.group);
  }

  return (
    <div className="min-h-screen bg-background">
      <header
        className="fixed inset-x-0 z-50"
        style={{ top: "var(--beta-banner-height, 0px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
            style={{
              background: "color-mix(in oklab, var(--ink) 55%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
            }}
          />
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo
              size={44}
              priority
              showWordmark
              wordmarkClassName="hidden text-[17px] text-white sm:inline"
            />
          </Link>
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <SpeciesSearch variant="dark" />
            <ThemeToggle variant="dark" />
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </header>

      <main>
        <section
          className="relative flex min-h-[72svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-14 lg:min-h-[78svh] lg:pb-20"
          style={{
            paddingTop: "calc(var(--beta-banner-height, 0px) + 7rem)",
          }}
        >
          <Image
            src={images.hero}
            alt={t("heroImageAlt")}
            fill
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
                    <Link href="/" className="transition-colors hover:text-white">
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

              <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
                <AnimatedStat
                  value={stats.total}
                  label={t("stats.total")}
                  delay={0}
                />
                <AnimatedStat
                  value={stats.snakes}
                  label={t("stats.snakes")}
                  delay={80}
                />
                <AnimatedStat
                  value={stats.lizards}
                  label={t("stats.lizards")}
                  delay={140}
                />
                <AnimatedStat
                  value={stats.turtles}
                  label={t("stats.turtles")}
                  delay={200}
                />
                <AnimatedStat
                  value={stats.amphibians}
                  label={t("stats.amphibians")}
                  delay={260}
                />
                <AnimatedStat
                  value={stats.regions}
                  label={t("stats.regions")}
                  delay={320}
                />
                <AnimatedStat
                  value={stats.photos}
                  label={t("stats.photos")}
                  delay={380}
                />
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
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
                <p className="text-[13px] text-muted-foreground" aria-live="polite">
                  {t("resultsCount", { count: filtered.length })}
                </p>
              </div>
            </Reveal>

            <div className="mt-10 space-y-6 lg:mt-12">
              <div className="relative max-w-xl">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={filters.query}
                  onChange={(event) =>
                    updateFilter("query", event.target.value)
                  }
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-11 text-[14px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary/40 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                  aria-label={t("searchPlaceholder")}
                />
                {filters.query ? (
                  <button
                    type="button"
                    onClick={() => updateFilter("query", "")}
                    className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={t("clearSearch")}
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>

              <div className="space-y-4">
                <FilterRow label={t("filters.type")}>
                  {GROUP_OPTIONS.map((group) => (
                    <FilterChip
                      key={group}
                      active={filters.group === group}
                      onClick={() => updateFilter("group", group)}
                    >
                      {group === "all"
                        ? t("filters.all")
                        : t(`groups.${group}`)}
                    </FilterChip>
                  ))}
                </FilterRow>

                <FilterRow label={t("filters.danger")}>
                  {DANGER_OPTIONS.map((danger) => (
                    <FilterChip
                      key={danger}
                      active={filters.danger === danger}
                      onClick={() => updateFilter("danger", danger)}
                    >
                      {t(`danger.${danger}`)}
                    </FilterChip>
                  ))}
                </FilterRow>

                <FilterRow label={t("filters.habitat")}>
                  {HABITAT_OPTIONS.map((habitat) => (
                    <FilterChip
                      key={habitat}
                      active={filters.habitat === habitat}
                      onClick={() => updateFilter("habitat", habitat)}
                    >
                      {habitat === "all"
                        ? t("filters.all")
                        : t(`habitats.${habitat}`)}
                    </FilterChip>
                  ))}
                </FilterRow>

                <FilterRow label={t("filters.region")}>
                  <FilterChip
                    active={filters.region === "all"}
                    onClick={() => updateFilter("region", "all")}
                  >
                    {t("filters.allRegions")}
                  </FilterChip>
                  {regions.map((region) => (
                    <FilterChip
                      key={region.id}
                      active={filters.region === region.id}
                      onClick={() => updateFilter("region", region.id)}
                    >
                      {localizeRegionText(region.name, locale)}
                    </FilterChip>
                  ))}
                </FilterRow>
              </div>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3.5" />
                  {t("resetFilters")}
                </button>
              ) : null}
            </div>

            {filtered.length > 0 ? (
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
                {filtered.map((species, index) => (
                  <li key={species.id}>
                    <AtlasSpeciesCard
                      species={species}
                      locale={locale}
                      index={index}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <ComingSoonPanel
                group={
                  comingSoonGroups[0] ??
                  (filters.group !== "all" ? filters.group : null)
                }
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
              <GeorgiaMap selectionMode="panel" />
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
                    {t("lastUpdated", { date: stats.lastUpdated })}
                  </p>
                ) : null}
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2">
                <TrustCard title={t("methodTitle")} body={t("methodBody")} />
                <TrustCard title={t("sourcesTitle")} body={t("sourcesBody")} />
                <TrustCard
                  title={t("photosTitle")}
                  body={
                    photographers.length > 0
                      ? t("photosBodyNamed", {
                          names: photographers.join(", "),
                        })
                      : t("photosBody")
                  }
                />
                <TrustCard
                  title={t("contributorsTitle")}
                  body={t("contributorsBody")}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
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
        {group === "turtle" || group === "amphibian"
          ? t("emptyExpandingBody")
          : t("emptyBody")}
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
  const meta = getSpeciesAtlasMeta(species.id);

  return (
    <Link
      href={`/species/${species.id}`}
      className="group flex items-center gap-4 rounded-[22px] border border-border/80 bg-card p-3 transition-colors hover:border-primary/25 sm:gap-5 sm:p-4"
    >
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-2xl bg-ink sm:size-[84px]">
        <Image
          src={species.mobileImage ?? species.image}
          alt=""
          fill
          sizes="84px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
          {t("updatedOn", { date: species.updatedAt })}
        </p>
      </div>
    </Link>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card px-5 py-6 sm:px-6">
      <h3 className="font-display text-[1.15rem] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function SeoAuthoritySection() {
  const t = useTranslations("speciesAtlas");

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
              {t("seo.venomousTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
              <p>{t("seo.venomousP1")}</p>
              <p>{t("seo.venomousP2")}</p>
            </div>
            <ul className="mt-5 space-y-2 border-l-2 border-primary/25 pl-4">
              <li>
                <Link
                  href="/species/macrovipera-lebetina"
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Macrovipera lebetina
                </Link>
              </li>
              <li>
                <Link
                  href="/species/vipera-kaznakovi"
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Vipera kaznakovi
                </Link>
              </li>
              <li>
                <Link
                  href="/species/vipera-dinniki"
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Vipera dinniki
                </Link>
              </li>
              <li>
                <Link
                  href="/species/vipera-ammodytes"
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  Vipera ammodytes
                </Link>
              </li>
            </ul>
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
