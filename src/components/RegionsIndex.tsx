"use client";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  Info,
  LocateFixed,
  Pointer,
  TriangleAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type Ref, useRef, useState } from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { RegionMixKey, RegionsIndexItem } from "@/lib/regionsIndex";

import { Link } from "@/i18n/navigation";
import { regionHref } from "@/lib/regionHref";

type LocateStatus = "idle" | "locating" | "outside" | "unavailable";
type MetricId = "all" | "amphibians" | "birds" | "lizards" | "snakes" | "venom";
type RegionsIndexProps = {
  items: RegionsIndexItem[];
  stats: {
    regionCount: number;
    speciesCount: number;
    venomousCount: number;
  };
};

type SortId = "alpha" | "count" | "map";

const GREEN = ["#e4ece0", "#c3d5bb", "#9db592", "#5f8f6f", "#2f6b4f"];
const RED = ["#f4e4de", "#e8c0b2", "#d6927d", "#c26652", "#9c3a2e"];

const METRICS: ReadonlyArray<{
  get: (item: RegionsIndexItem) => number;
  id: MetricId;
  ramp: string[];
}> = [
  { get: (item) => item.total, id: "all", ramp: GREEN },
  { get: (item) => item.mix.snakes, id: "snakes", ramp: GREEN },
  { get: (item) => item.mix.lizards, id: "lizards", ramp: GREEN },
  { get: (item) => item.mix.amphibians, id: "amphibians", ramp: GREEN },
  { get: (item) => item.mix.birds, id: "birds", ramp: GREEN },
  { get: (item) => item.venomous.length, id: "venom", ramp: RED },
];

const MIX: ReadonlyArray<{ color: string; key: RegionMixKey }> = [
  { color: "#1a211c", key: "snakes" },
  { color: "#2f6b4f", key: "lizards" },
  { color: "#6fad88", key: "amphibians" },
  { color: "#b5c9ad", key: "birds" },
  { color: "#dfe5dc", key: "other" },
];

const SORTS: readonly SortId[] = ["map", "count", "alpha"];

const CLUSTER_LINKS = [
  { href: "/snakes/gavrtseleba", key: "clusterSnakes" },
  { href: "/lizards/saxeoebebi", key: "clusterLizards" },
  { href: "/turtles/saxeoebebi", key: "clusterTurtles" },
  { href: "/amphibians/saxeoebebi", key: "clusterAmphibians" },
] as const;

const SEO_LINKS = [
  { href: "/species", key: "species" },
  { href: "/venomous-snakes", key: "venomous" },
  { href: "/", key: "home" },
] as const;

const GEODATA_URL = "/geodata/georgia-regions-v1.json";

const wrapClass = "mx-auto box-content max-w-[1320px] px-6 lg:px-[60px]";
const eyebrowClass =
  "text-[11px] font-medium tracking-[0.18em] text-(--nw-muted)";
const cardClass =
  "rounded-[26px] bg-(--nw-card) shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_30px_rgba(14,20,17,0.06)] lg:rounded-[32px] lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]";
const h2Class =
  "mt-2.5 text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-(--nw-ink) lg:mt-3.5 lg:text-[44px] lg:leading-[1.1]";
const leadClass =
  "text-[15px] leading-[1.6] text-(--nw-muted) lg:text-[16px] lg:leading-[1.65]";
const dotClass = "inline-block size-2 shrink-0 rounded-full";

export function RegionsIndex({ items, stats }: RegionsIndexProps) {
  const [selected, setSelected] = useState<null | RegionPathId>(null);
  const [hover, setHover] = useState<null | RegionPathId>(null);
  const [metricId, setMetricId] = useState<MetricId>("all");
  const [sort, setSort] = useState<SortId>("map");
  const mapRef = useRef<HTMLElement>(null);

  function select(id: RegionPathId) {
    setSelected(id);
    setHover(null);
  }

  function selectAndReveal(id: RegionPathId) {
    select(id);
    mapRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    <div className="editorial-page flex min-h-screen flex-col bg-background text-(--nw-ink) antialiased">
      <RegionsHero stats={stats} />
      <RegionsMap
        hover={hover}
        items={items}
        mapRef={mapRef}
        metricId={metricId}
        onHover={setHover}
        onMetric={setMetricId}
        onSelect={select}
        selected={selected}
      />
      <RegionsDirectory
        items={items}
        onSort={setSort}
        selected={selected}
        sort={sort}
      />
      <RegionsCompare
        items={items}
        onSelect={selectAndReveal}
        selected={selected}
      />
      <RegionsCategories />
    </div>
  );
}

function NeighborButton({
  item,
  onSelect,
}: {
  item: RegionsIndexItem;
  onSelect: (id: RegionPathId) => void;
}) {
  return (
    <button
      className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-(--nw-card) px-3.5 text-[13px] font-medium whitespace-nowrap text-(--nw-ink) transition-colors hover:border-(--nw-accent) hover:text-(--nw-accent) lg:h-[34px] lg:px-[13px] lg:text-[12.5px]"
      onClick={() => onSelect(item.id)}
      type="button"
    >
      <span className="text-[11px] text-(--nw-muted) tabular-nums">
        {item.n}
      </span>
      {item.name}
    </button>
  );
}

function pointInRing(point: [number, number], ring: [number, number][]) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function RegionAside({
  active,
  byId,
  onSelect,
}: {
  active?: RegionsIndexItem;
  byId: Map<RegionPathId, RegionsIndexItem>;
  onSelect: (id: RegionPathId) => void;
}) {
  const t = useTranslations("regions");
  const asideClass =
    "mx-3 mt-4 px-5 pt-[22px] pb-5 max-lg:rounded-[28px] max-lg:bg-(--nw-card) max-lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_30px_rgba(14,20,17,0.06)] lg:m-0 lg:flex lg:min-w-0 lg:flex-col lg:border-l lg:border-(--nw-line-soft) lg:p-0 lg:pl-9";

  if (!active) {
    return (
      <aside
        aria-label={t("selectedRegion")}
        aria-live="polite"
        className={`${asideClass} lg:justify-center`}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-(--nw-surface) text-(--nw-accent)">
          <Pointer aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </span>
        <p className={`${eyebrowClass} mt-4`}>{t("mapEyebrow")}</p>
        <h2 className="mt-3 text-[26px] leading-[1.15] font-bold tracking-[-0.012em] lg:text-[32px] lg:leading-[1.12] lg:tracking-[-0.015em]">
          {t("mapTitle")}
        </h2>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-(--nw-muted) lg:mt-2.5">
          {t("mapHint")}
        </p>
      </aside>
    );
  }

  const neighbors = active.relatedIds
    .map((id) => byId.get(id))
    .filter((item): item is RegionsIndexItem => Boolean(item));
  const stats = [
    { label: t("statLabels.species"), value: active.total, venom: false },
    {
      label: t("statLabels.venomous"),
      value: active.venomous.length,
      venom: true,
    },
    {
      label: t("statLabels.habitats"),
      value: active.habitats.length,
      venom: false,
    },
  ];
  const tagClass =
    "inline-flex h-8 items-center gap-[7px] rounded-full px-3 text-[13px] font-medium whitespace-nowrap lg:h-[30px] lg:text-[12.5px]";

  return (
    <>
      <aside
        aria-label={t("selectedRegion")}
        aria-live="polite"
        className={asideClass}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#1a211c] px-1.5 text-[11.5px] font-bold text-white tabular-nums lg:h-[30px] lg:min-w-[30px] lg:text-[12px]">
            {active.n}
          </span>
          <span className={eyebrowClass}>{active.biome}</span>
        </div>
        <h2 className="mt-3 text-[26px] leading-[1.15] font-bold tracking-[-0.012em] lg:mt-3.5 lg:text-[32px] lg:leading-[1.12] lg:tracking-[-0.015em]">
          {active.name}
        </h2>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-(--nw-muted) lg:mt-2.5">
          {active.description}
        </p>

        <dl className="mt-4 grid grid-cols-3 border-y border-(--nw-line-soft) py-3.5 lg:mt-5 lg:py-4">
          {stats.map((item, index) => (
            <div
              className={
                index > 0
                  ? "border-l border-(--nw-line-soft) pl-3.5 lg:pl-[18px]"
                  : ""
              }
              key={item.label}
            >
              <dt
                className={`text-[11.5px] lg:text-[12px] ${
                  item.venom ? "text-(--nw-venom)" : "text-(--nw-muted)"
                }`}
              >
                {item.label}
              </dt>
              <dd
                className={`mt-[5px] text-[26px] leading-none font-semibold tabular-nums lg:mt-1.5 lg:text-[30px] ${
                  item.venom ? "text-(--nw-venom)" : ""
                }`}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 lg:mt-[18px]">
          <div className="text-[12.5px] font-semibold">{t("mixTitle")}</div>
          <div
            aria-hidden="true"
            className="mt-2.5 flex h-2.5 gap-0.5 overflow-hidden rounded-full lg:h-3"
          >
            {MIX.map((entry) => (
              <span
                className="h-full"
                key={entry.key}
                style={{
                  background: entry.color,
                  flex: `${active.mix[entry.key]} 1 0`,
                }}
              />
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-3.5 gap-y-[7px] lg:gap-x-4">
            {MIX.map((entry) => (
              <li
                className="flex items-center gap-2 text-[13px] text-(--nw-soft)"
                key={entry.key}
              >
                <span
                  className={`${dotClass} shadow-[inset_0_0_0_1px_rgba(14,20,17,0.08)]`}
                  style={{ background: entry.color }}
                />
                <span className="min-w-0 flex-1">{t(`mix.${entry.key}`)}</span>
                <strong className="font-semibold text-(--nw-ink) tabular-nums">
                  {active.mix[entry.key]}
                </strong>
              </li>
            ))}
          </ul>
        </div>

        {active.venomous.length > 0 ? (
          <div className="mt-4 lg:mt-[18px]">
            <div className="flex items-center gap-2 text-[12.5px] font-semibold text-(--nw-venom)">
              <TriangleAlert
                aria-hidden="true"
                className="size-[15px]"
                strokeWidth={1.75}
              />
              {t("venomTitle")}
            </div>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {active.venomous.map((species) => (
                <li key={species.id}>
                  <Link
                    className={`${tagClass} bg-(--nw-venom-tag) text-(--nw-danger-fg) transition-opacity hover:opacity-80`}
                    href={species.href}
                  >
                    <span className="size-1.5 rounded-full bg-(--nw-danger-dot)" />
                    {species.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 lg:mt-[18px]">
          <div className="text-[12.5px] font-semibold">
            {t("habitatsTitle")}
          </div>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {active.habitats.map((habitat) => (
              <li
                className={`${tagClass} bg-(--nw-wash) text-(--nw-ink)`}
                key={habitat}
              >
                {habitat}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 lg:mt-auto lg:pt-[22px]">
          <Link
            className="flex min-h-[54px] items-center justify-between gap-2.5 rounded-full bg-[#2f6b4f] pr-[7px] pl-5 text-[14.5px] font-medium text-white transition-opacity hover:opacity-90 lg:h-[54px] lg:gap-3 lg:pr-2 lg:pl-[22px] lg:text-[15px]"
            href={regionHref(active.id)}
          >
            <span className="min-w-0 truncate">
              {t("regionTitle", { nameIn: active.nameIn })}
            </span>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/16">
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
            </span>
          </Link>
          {neighbors.length > 0 ? (
            <div className="mt-3.5 hidden flex-wrap items-center gap-1.5 lg:flex">
              <span className="mr-1 text-[12px] text-(--nw-muted)">
                {t("neighbors")}
              </span>
              {neighbors.map((item) => (
                <NeighborButton item={item} key={item.id} onSelect={onSelect} />
              ))}
            </div>
          ) : null}
        </div>
      </aside>
      {neighbors.length > 0 ? (
        <div className="mt-3.5 lg:hidden">
          <div className="px-6 text-[12px] text-(--nw-muted)">
            {t("neighborsLong")}
          </div>
          <div className="mt-2 flex scrollbar-none gap-2 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
            {neighbors.map((item) => (
              <NeighborButton item={item} key={item.id} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function RegionDirectoryEntry({
  item,
  selected,
}: {
  item: RegionsIndexItem;
  selected: boolean;
}) {
  const t = useTranslations("regions");
  const venomous = t("venomousCount", { count: item.venomous.length });

  return (
    <>
      <Link
        className="flex min-h-[76px] items-center gap-3.5 border-t border-(--nw-hair) py-2.5 md:hidden"
        href={regionHref(item.id)}
      >
        <span
          className={`flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl ${
            selected ? "bg-(--nw-tile-on)" : "bg-(--nw-card)"
          }`}
        >
          <svg
            aria-hidden="true"
            className="block h-10 w-12"
            viewBox={item.thumbViewBox}
          >
            <path d={item.path} fill="#9db592" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] leading-[1.3] font-semibold">
            {item.name}
          </span>
          <span className="mt-[3px] block text-[12.5px] text-(--nw-muted)">
            {item.biome}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-[18px] font-semibold text-(--nw-accent) tabular-nums">
            {item.total}
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-(--nw-venom)">
            <span className="size-[5px] rounded-full bg-(--nw-danger-dot)" />
            {venomous}
          </span>
        </span>
      </Link>
      <Link
        className={`group hidden h-full flex-col rounded-[28px] bg-(--nw-card) px-[22px] pt-5 pb-[22px] motion-safe:transition-[translate,box-shadow] motion-safe:duration-250 motion-safe:hover:translate-y-[-3px] md:flex ${
          selected
            ? "shadow-[0_0_0_2px_#2f6b4f,0_12px_32px_rgba(14,20,17,0.08)]"
            : "shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_32px_rgba(14,20,17,0.05)] hover:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_22px_48px_rgba(14,20,17,0.1)]"
        }`}
        href={regionHref(item.id)}
      >
        <span className="flex items-center justify-between gap-2.5">
          <span className="text-[12px] font-semibold text-(--nw-muted) tabular-nums">
            {item.n}
          </span>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-(--nw-venom-tag) px-2.5 text-[11.5px] font-semibold text-(--nw-danger-fg)">
            <span className="size-1.5 rounded-full bg-(--nw-danger-dot)" />
            {venomous}
          </span>
        </span>
        <svg
          aria-hidden="true"
          className="mt-3.5 mb-1.5 block h-32 w-full"
          viewBox={item.thumbViewBox}
        >
          <path
            className="fill-[#9db592] transition-[fill] duration-250 group-hover:fill-[#2f6b4f]"
            d={item.path}
          />
        </svg>
        <span className={`${eyebrowClass} mt-2 block`}>{item.biome}</span>
        <span className="mt-1.5 block flex-1 text-[19px] leading-tight font-semibold">
          {item.name}
        </span>
        <span className="mt-4 flex items-center gap-2 border-t border-(--nw-line-soft) pt-3.5">
          <strong className="text-[22px] font-semibold text-(--nw-accent) tabular-nums">
            {item.total}
          </strong>
          <span className="text-[13px] text-(--nw-muted)">
            {t("speciesWord", { count: item.total })}
          </span>
          <span className="flex-1" />
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-(--nw-wash) text-(--nw-ink) transition-[background,color] duration-200 group-hover:bg-[#2f6b4f] group-hover:text-white"
          >
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </span>
        </span>
      </Link>
    </>
  );
}

function regionFromTarget(target: EventTarget) {
  if (!(target instanceof Element)) return null;
  const id = target.closest("[data-region]")?.getAttribute("data-region");
  return (id as null | RegionPathId | undefined) ?? null;
}

function RegionMapLabel({
  active,
  aria,
  item,
  onSelect,
  pressed,
  value,
}: {
  active: boolean;
  aria: string;
  item: RegionsIndexItem;
  onSelect: (id: RegionPathId) => void;
  pressed: boolean;
  value: string;
}) {
  const position = {
    left: `${item.label[0] / 10}%`,
    top: `${(item.label[1] / 510) * 100}%`,
  };

  if (active) {
    return (
      <button
        aria-label={aria}
        aria-pressed={pressed}
        className="absolute z-3 inline-flex -translate-1/2 cursor-pointer items-center justify-center whitespace-nowrap tabular-nums"
        data-region={item.id}
        onClick={() => onSelect(item.id)}
        style={position}
        type="button"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#1a211c] text-[11px] font-bold text-white shadow-[0_0_0_3px_#ffffff,0_6px_14px_rgba(14,20,17,0.3)] lg:hidden">
          {item.n}
        </span>
        <span className="hidden h-9 items-center gap-[7px] rounded-full bg-[#1a211c] pr-3.5 pl-1.5 text-white shadow-[0_10px_24px_rgba(14,20,17,0.28)] transition-transform duration-200 hover:scale-[1.08] lg:inline-flex">
          <span className="flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#1a211c]">
            {item.n}
          </span>
          <span className="text-[13px] font-semibold">{item.name}</span>
          <span className="text-[12px] text-white/70">{value}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      aria-label={aria}
      aria-pressed={false}
      className="group absolute z-2 inline-flex size-6 -translate-1/2 cursor-pointer items-center justify-center lg:size-7"
      data-region={item.id}
      onClick={() => onSelect(item.id)}
      style={position}
      type="button"
    >
      <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-white/94 text-[9.5px] font-bold text-[#1a211c] tabular-nums shadow-[0_1px_5px_rgba(14,20,17,0.18)] transition-transform duration-200 lg:size-7 lg:text-[11px] lg:shadow-[0_2px_8px_rgba(14,20,17,0.16)] lg:group-hover:scale-[1.08]">
        {item.n}
      </span>
    </button>
  );
}

function RegionsCategories() {
  const t = useTranslations("regions");

  return (
    <section className="pt-11 pb-10 lg:pt-[88px] lg:pb-24">
      <div
        className={`${wrapClass} lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14`}
      >
        <div>
          <div className={eyebrowClass}>{t("clusterEyebrow")}</div>
          <h2 className={`${h2Class} lg:text-[38px]`}>{t("clusterTitle")}</h2>
          <p className={`${leadClass} mt-3 lg:mt-[18px]`}>
            <span className="md:hidden">{t("clusterBodyShort")}</span>
            <span className="hidden md:inline">{t("clusterBody")}</span>
          </p>
          <div className="-mx-6 mt-4 flex scrollbar-none gap-2 overflow-x-auto px-6 md:mx-0 md:mt-6 md:flex-wrap md:gap-2.5 md:px-0 [&::-webkit-scrollbar]:hidden">
            {CLUSTER_LINKS.map((link) => (
              <Link
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-transparent bg-(--nw-card) px-4 text-[14px] font-medium whitespace-nowrap text-(--nw-ink) shadow-[0_1px_2px_rgba(14,20,17,0.05)] transition-colors hover:border-(--nw-accent) hover:text-(--nw-accent) md:px-[18px]"
                href={link.href}
                key={link.key}
              >
                {t(link.key)}
                <ArrowUpRight
                  aria-hidden="true"
                  className="hidden size-4 md:block"
                  strokeWidth={1.75}
                />
              </Link>
            ))}
          </div>
          <Link
            className="mt-4 flex items-center gap-3.5 rounded-3xl bg-(--nw-panel) p-[18px] text-white md:mt-7 md:gap-4 md:rounded-[26px] md:px-[22px] md:py-5"
            href="/venomous-snakes"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#b84336]">
              <TriangleAlert
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.75}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-semibold md:text-[16px]">
                {t("seo.links.venomous")}
              </span>
              <span className="mt-[3px] block text-[13px] text-white/70 md:text-[13.5px]">
                <span className="md:hidden">{t("venomousCardBodyShort")}</span>
                <span className="hidden md:inline">
                  {t("venomousCardBody")}
                </span>
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0"
              strokeWidth={1.75}
            />
          </Link>
        </div>

        <details className="group mt-4 rounded-[22px] bg-(--nw-card) px-5 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_10px_26px_rgba(14,20,17,0.05)] md:hidden">
          <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
            {t("seo.title")}
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="pb-[18px] text-[14.5px] leading-[1.7] text-(--nw-soft)">
            <p>{t("seo.p1")}</p>
            <p className="mt-3">{t("dataGapBody")}</p>
          </div>
        </details>

        <article
          className={`${cardClass} mt-10 hidden px-[38px] py-[34px] md:block lg:mt-0`}
        >
          <div className={eyebrowClass}>{t("seo.eyebrow")}</div>
          <h2 className="mt-3 text-[28px] leading-[1.2] font-semibold tracking-[-0.01em]">
            {t("seo.title")}
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-(--nw-soft)">
            {t("seo.p1")}
          </p>
          <p className="mt-3.5 text-[15px] leading-[1.75] text-(--nw-soft)">
            {t("seo.p2")}
          </p>
          <div className="mt-5 flex items-start gap-3.5 rounded-[18px] bg-(--nw-wash) px-[18px] py-4">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-(--nw-accent)"
              strokeWidth={1.75}
            />
            <p className="text-[14px] leading-[1.65] text-(--nw-soft)">
              {t("dataGapBody")}
            </p>
          </div>
          <div className="mt-[22px] flex flex-wrap gap-x-[22px] gap-y-2">
            {SEO_LINKS.map((link) => (
              <Link
                className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-(--nw-accent) hover:underline"
                href={link.href}
                key={link.key}
              >
                {t(`seo.links.${link.key}`)}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function RegionsCompare({
  items,
  onSelect,
  selected,
}: {
  items: RegionsIndexItem[];
  onSelect: (id: RegionPathId) => void;
  selected: null | RegionPathId;
}) {
  const t = useTranslations("regions");
  const top = Math.max(...items.map((item) => item.total));
  const rows = [...items].sort((a, b) => b.total - a.total);

  return (
    <section className="bg-(--nw-card) py-10 lg:py-[88px]">
      <div className={wrapClass}>
        <div className="md:flex md:items-end md:justify-between md:gap-12">
          <div>
            <div className={eyebrowClass}>{t("compareEyebrow")}</div>
            <h2 className={h2Class}>{t("compareTitle")}</h2>
            <p className={`${leadClass} mt-3.5 hidden max-w-[560px] md:block`}>
              {t("compareBody")}
            </p>
          </div>
          <ul
            aria-label={t("compareLegend")}
            className="mt-4 flex flex-wrap gap-x-3.5 gap-y-2 md:mt-0 md:max-w-[560px] md:justify-end md:gap-x-[18px] md:pb-1.5"
          >
            {MIX.map((entry) => (
              <li
                className="flex items-center gap-1.5 text-[12.5px] text-(--nw-soft) md:gap-2 md:text-[13px]"
                key={entry.key}
              >
                <span
                  className="size-[9px] rounded-[3px] shadow-[inset_0_0_0_1px_rgba(14,20,17,0.08)] md:size-2.5"
                  style={{ background: entry.color }}
                />
                {t(`mix.${entry.key}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-[18px] flex flex-col gap-1 md:mt-9 md:gap-0.5">
          {rows.map((item) => (
            <button
              aria-label={t("compareAria", {
                count: item.total,
                name: item.name,
              })}
              className={`grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-2.5 rounded-[14px] px-2.5 py-2 text-left transition-colors duration-200 md:min-h-11 md:grid-cols-[250px_minmax(0,1fr)_56px] md:items-center md:gap-5 md:px-3 md:py-1 md:hover:bg-(--nw-wash) ${
                item.id === selected ? "bg-(--nw-line-soft)" : ""
              }`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="hidden w-[22px] shrink-0 text-[12px] text-(--nw-muted) tabular-nums md:inline">
                  {item.n}
                </span>
                <span className="min-w-0 truncate text-[13.5px] font-medium md:text-[14.5px]">
                  {item.name}
                </span>
              </span>
              <span className="text-[13.5px] font-semibold tabular-nums md:order-3 md:text-right md:text-[15px]">
                {item.total}
              </span>
              <span
                aria-hidden="true"
                className="col-span-2 mt-1.5 flex h-2.5 gap-0.5 md:order-2 md:col-span-1 md:mt-0 md:h-[18px]"
              >
                {MIX.map((entry) => (
                  <span
                    className="h-full rounded-[2px] md:rounded-[3px]"
                    key={entry.key}
                    style={{
                      background: entry.color,
                      width: `${((item.mix[entry.key] / top) * 100).toFixed(2)}%`,
                    }}
                  />
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionsDirectory({
  items,
  onSort,
  selected,
  sort,
}: {
  items: RegionsIndexItem[];
  onSort: (id: SortId) => void;
  selected: null | RegionPathId;
  sort: SortId;
}) {
  const t = useTranslations("regions");
  const sorted = [...items];
  if (sort === "count") sorted.sort((a, b) => b.total - a.total);
  if (sort === "alpha") sorted.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="pt-12 pb-10 lg:pt-0 lg:pb-24">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <div className={eyebrowClass}>{t("directoryEyebrow")}</div>
            <h2 className={h2Class}>
              <span className="lg:hidden">{t("allRegions")}</span>
              <span className="hidden lg:inline">{t("directoryTitle")}</span>
            </h2>
          </div>
          <div
            aria-label={t("sortLabel")}
            className="mt-4 flex gap-1 rounded-full bg-(--nw-card) p-1 shadow-[0_1px_2px_rgba(14,20,17,0.05)] lg:mt-0"
            role="group"
          >
            {SORTS.map((id) => (
              <button
                aria-pressed={id === sort}
                className={`h-10 flex-1 cursor-pointer rounded-full px-2.5 text-[13px] font-medium transition-[background,color] duration-200 lg:h-9 lg:flex-none lg:px-3.5 ${
                  id === sort
                    ? "bg-(--nw-strong) text-(--nw-on-strong)"
                    : "text-(--nw-ink)"
                }`}
                key={id}
                onClick={() => onSort(id)}
                type="button"
              >
                {id === "map" ? (
                  <>
                    <span className="lg:hidden">{t("sorts.mapShort")}</span>
                    <span className="hidden lg:inline">{t("sorts.map")}</span>
                  </>
                ) : (
                  t(`sorts.${id}`)
                )}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-4 md:mt-9 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((item) => (
            <li key={item.id}>
              <RegionDirectoryEntry
                item={item}
                selected={item.id === selected}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RegionsHero({ stats }: Pick<RegionsIndexProps, "stats">) {
  const t = useTranslations("regions");
  const statItems = [
    { label: t("statLabels.regions"), value: stats.regionCount, venom: false },
    { label: t("statLabels.species"), value: stats.speciesCount, venom: false },
    {
      label: t("statLabels.venomous"),
      value: stats.venomousCount,
      venom: true,
    },
  ];

  return (
    <section className="pt-[95px] lg:pt-[115px] lg:pb-9">
      <div className={wrapClass}>
        <nav aria-label={t("breadcrumbHome")}>
          <Link
            className="inline-flex h-11 items-center gap-1 rounded-full bg-(--nw-card) pr-3.5 pl-2 text-[13.5px] font-medium text-(--nw-ink) lg:h-9 lg:pr-[15px] lg:pl-[9px]"
            href={{ hash: "atlas", pathname: "/" }}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            {t("back")}
          </Link>
        </nav>
        <div className="mt-[22px] lg:mt-[30px] lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0 lg:max-w-[760px] lg:flex-1">
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-(--nw-accent)" />
              <span className={eyebrowClass}>{t("eyebrow")}</span>
            </div>
            <h1 className="mt-3 text-[38px] leading-[1.06] font-bold tracking-[-0.02em] lg:mt-[18px] lg:text-[72px] lg:leading-[1.02]">
              {t("title")}
            </h1>
            <p className="mt-3 text-[16.5px] leading-[1.6] text-(--nw-soft) lg:mt-5 lg:max-w-[640px] lg:text-[19px]">
              <span className="lg:hidden">{t("subtitleShort")}</span>
              <span className="hidden lg:inline">{t("subtitle")}</span>
            </p>
          </div>
          <dl
            className={`${cardClass} mt-5 grid grid-cols-3 px-1 py-4 lg:mt-0 lg:w-[500px] lg:shrink-0 lg:px-2 lg:py-[26px]`}
          >
            {statItems.map((item, index) => (
              <div
                className={`px-3.5 lg:px-[26px] ${
                  index > 0 ? "border-l border-(--nw-hair)" : ""
                }`}
                key={item.label}
              >
                <dt
                  className={`text-[11.5px] lg:text-[11px] lg:font-medium lg:tracking-[0.18em] ${
                    item.venom ? "text-(--nw-venom)" : "text-(--nw-muted)"
                  }`}
                >
                  {item.label}
                </dt>
                <dd
                  className={`mt-1.5 text-[26px] leading-none font-semibold tabular-nums lg:mt-2.5 lg:text-[42px] lg:tracking-[-0.02em] ${
                    item.venom ? "text-(--nw-venom)" : ""
                  }`}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function RegionsMap({
  hover,
  items,
  mapRef,
  metricId,
  onHover,
  onMetric,
  onSelect,
  selected,
}: {
  hover: null | RegionPathId;
  items: RegionsIndexItem[];
  mapRef: Ref<HTMLElement>;
  metricId: MetricId;
  onHover: (id: null | RegionPathId) => void;
  onMetric: (id: MetricId) => void;
  onSelect: (id: RegionPathId) => void;
  selected: null | RegionPathId;
}) {
  const t = useTranslations("regions");
  const [locate, setLocate] = useState<LocateStatus>("idle");
  const metric = METRICS.find((entry) => entry.id === metricId) ?? METRICS[0];
  const values = items.map(metric.get);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (value: number) =>
    max === min ? 2 : Math.round(((value - min) / (max - min)) * 4);
  const byId = new Map(items.map((item) => [item.id, item]));
  const activeId = hover ?? selected;
  const active = activeId ? byId.get(activeId) : undefined;
  const selectedItem = selected ? byId.get(selected) : undefined;

  function labelValue(item: RegionsIndexItem) {
    const value = metric.get(item);
    return metricId === "all"
      ? t("labelValue", { count: value })
      : t("labelMetricValue", {
          count: value,
          metric: t(`metrics.${metricId}`),
        });
  }

  function locateMe() {
    if (!("geolocation" in navigator)) {
      setLocate("unavailable");
      return;
    }
    setLocate("locating");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(GEODATA_URL);
          if (!response.ok) {
            setLocate("unavailable");
            return;
          }
          const geo = (await response.json()) as {
            features: Array<{
              geometry: { coordinates: [number, number][][] };
              properties: { id: RegionPathId };
            }>;
          };
          const point: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          const hit = geo.features.find((feature) =>
            pointInRing(point, feature.geometry.coordinates[0]),
          );
          if (hit) {
            onSelect(hit.properties.id);
            setLocate("idle");
          } else {
            setLocate("outside");
          }
        } catch {
          setLocate("unavailable");
        }
      },
      () => setLocate("unavailable"),
      { maximumAge: 600_000, timeout: 10_000 },
    );
  }

  const locateLabel = {
    idle: t("myRegion"),
    locating: t("myRegionLocating"),
    outside: t("myRegionOutside"),
    unavailable: t("myRegionUnavailable"),
  }[locate];

  return (
    <section
      aria-label={t("mapLabel")}
      className="mt-7 scroll-mt-24 lg:mt-0 lg:pb-[88px]"
      ref={mapRef}
    >
      <div
        aria-label={t("mapLayer")}
        className="flex scrollbar-none gap-2 overflow-x-auto px-6 lg:hidden [&::-webkit-scrollbar]:hidden"
        role="group"
      >
        {METRICS.map((entry) => {
          const on = entry.id === metricId;
          return (
            <button
              aria-pressed={on}
              className={`inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-[14px] font-medium whitespace-nowrap ${
                on
                  ? "bg-(--nw-strong) text-(--nw-on-strong)"
                  : "bg-(--nw-card) text-(--nw-ink) shadow-[0_1px_2px_rgba(14,20,17,0.05)]"
              }`}
              key={entry.id}
              onClick={() => onMetric(entry.id)}
              type="button"
            >
              <span
                className={dotClass}
                style={{ background: entry.ramp[on ? 2 : 3] }}
              />
              {t(`metrics.${entry.id}`)}
            </button>
          );
        })}
      </div>

      <div className="lg:mx-auto lg:box-content lg:max-w-[1320px] lg:px-[60px]">
        <div className="lg:rounded-[32px] lg:bg-(--nw-card) lg:px-7 lg:pt-[26px] lg:pb-7 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]">
          <div className="hidden flex-wrap items-center justify-between gap-6 lg:flex">
            <div
              aria-label={t("mapLayer")}
              className="flex flex-wrap items-center gap-1.5 rounded-full bg-(--nw-wash) p-1"
              role="group"
            >
              {METRICS.map((entry) => {
                const on = entry.id === metricId;
                return (
                  <button
                    aria-pressed={on}
                    className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-[13.5px] font-medium whitespace-nowrap transition-[background,color] duration-200 ${
                      on
                        ? "bg-(--nw-card) text-(--nw-ink) shadow-[0_1px_3px_rgba(14,20,17,0.12)]"
                        : "text-(--nw-muted)"
                    }`}
                    key={entry.id}
                    onClick={() => onMetric(entry.id)}
                    type="button"
                  >
                    <span
                      className={dotClass}
                      style={{ background: entry.ramp[on ? 4 : 2] }}
                    />
                    {t(`metrics.${entry.id}`)}
                  </button>
                );
              })}
            </div>
            <button
              aria-live="polite"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-(--nw-card) pr-4 pl-3.5 text-[13.5px] font-medium text-(--nw-ink) disabled:cursor-progress"
              disabled={locate === "locating"}
              onClick={locateMe}
              type="button"
            >
              <LocateFixed
                aria-hidden="true"
                className="size-4 text-(--nw-accent)"
                strokeWidth={1.75}
              />
              {locateLabel}
            </button>
          </div>

          <div className="lg:mt-[22px] lg:grid lg:grid-cols-[minmax(0,1fr)_392px] lg:items-stretch lg:gap-9">
            <div className="mx-3 mt-3.5 px-2.5 pt-[18px] pb-3.5 max-lg:rounded-[26px] max-lg:bg-(--nw-card) max-lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_12px_30px_rgba(14,20,17,0.06)] lg:m-0 lg:flex lg:min-w-0 lg:flex-col lg:p-0">
              <div
                className="relative aspect-1000/510 w-full lg:mt-[18px]"
                onMouseLeave={() => onHover(null)}
                onMouseOver={(event) => onHover(regionFromTarget(event.target))}
              >
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full overflow-visible"
                  viewBox="0 0 1000 510"
                >
                  {items.map((item) => (
                    <path
                      className="[pointer-events:visiblePainted] cursor-pointer stroke-white stroke-[1.4] transition-[fill] duration-350 [stroke-linejoin:round] lg:stroke-[1.6]"
                      d={item.path}
                      data-region={item.id}
                      fill={metric.ramp[step(metric.get(item))]}
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                    />
                  ))}
                </svg>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full overflow-visible drop-shadow-[0_6px_8px_rgba(14,20,17,0.22)] lg:drop-shadow-[0_10px_14px_rgba(14,20,17,0.22)]"
                  viewBox="0 0 1000 510"
                >
                  {active ? (
                    <path
                      className="fill-none stroke-(--nw-ink) stroke-[3.2] [stroke-linejoin:round] lg:stroke-[2.6]"
                      d={active.path}
                    />
                  ) : null}
                </svg>
                {items.map((item) => (
                  <RegionMapLabel
                    active={item.id === activeId}
                    aria={t("regionAria", {
                      count: item.total,
                      name: item.name,
                    })}
                    item={item}
                    key={item.id}
                    onSelect={onSelect}
                    pressed={item.id === selected}
                    value={labelValue(item)}
                  />
                ))}
                <div className="absolute top-[-18px] right-0 hidden items-center gap-2 text-[12.5px] text-(--nw-muted) lg:flex">
                  <Pointer
                    aria-hidden="true"
                    className="size-[15px]"
                    strokeWidth={1.75}
                  />
                  {t("mapHint")}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2.5 px-1.5 lg:mt-auto lg:items-end lg:gap-6 lg:border-t lg:border-(--nw-line-soft) lg:px-0 lg:pt-[22px]">
                <div className="flex w-full items-center justify-between gap-2.5 lg:block lg:w-auto">
                  <div className="text-[12px] font-semibold text-(--nw-ink) lg:text-[12.5px]">
                    <span className="lg:hidden">
                      {t(`legendsShort.${metricId}`)}
                    </span>
                    <span className="hidden lg:inline">
                      {t(`legends.${metricId}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:mt-2 lg:gap-2.5">
                    <span className="text-[11px] text-(--nw-muted) tabular-nums lg:text-[12px]">
                      {min}
                    </span>
                    <div
                      aria-hidden="true"
                      className="flex gap-0.5 lg:gap-[3px]"
                    >
                      {metric.ramp.map((color) => (
                        <span
                          className="h-2 w-4 rounded-[2px] lg:h-2.5 lg:w-[34px] lg:rounded-[3px]"
                          key={color}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-(--nw-muted) tabular-nums lg:text-[12px]">
                      {max}
                    </span>
                  </div>
                </div>
                <p className="hidden max-w-[360px] text-right text-[12px] leading-[1.55] text-(--nw-muted) lg:block">
                  {t("mapNote")}
                </p>
              </div>
            </div>
            <p className="mt-2.5 px-6 text-[12px] leading-[1.55] text-(--nw-muted) lg:hidden">
              {t("mapNoteShort")}
            </p>

            <RegionAside
              active={selectedItem}
              byId={byId}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
