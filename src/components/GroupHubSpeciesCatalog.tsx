"use client";

import { ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentProps, useId, useState } from "react";

import type { DangerLevel } from "@/data/speciesTypes";
import type { LocaleSpeciesHref } from "@/lib/localeSwitch";

import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { HUB_CATALOG_INITIAL } from "@/lib/groupHubLayout";

export type HubCatalogItem = {
  alt: string;
  href: LocaleSpeciesHref;
  id: string;
  image: string;
  mobileImage?: string;
  name: string;
  risk: DangerLevel | null;
  scientificName: string;
};

export type HubRiskFilter = "all" | "unrated" | DangerLevel;

const RISK_ORDER: readonly DangerLevel[] = ["High", "Moderate", "Harmless"];

const RISK_DOT: Record<Exclude<HubRiskFilter, "all">, string> = {
  Harmless: "bg-primary",
  High: "bg-destructive",
  Moderate: "bg-gold",
  unrated: "bg-muted-foreground",
};

const CHIP_CLASS_NAME =
  "inline-flex h-11 shrink-0 items-center gap-[7px] rounded-full border border-transparent px-4 text-[13.5px] font-medium whitespace-nowrap transition-colors lg:gap-2 lg:px-[18px] lg:text-[14px]";

export function GroupHubSpeciesCatalog({
  allLabel,
  group,
  indexLink,
  items,
  showRisk,
}: {
  allLabel: string;
  group: string;
  indexLink?: { href: ComponentProps<typeof Link>["href"]; label: string };
  items: HubCatalogItem[];
  showRisk: boolean;
}) {
  const t = useTranslations("groupHubShared.catalog");
  const tDanger = useTranslations("danger");
  const searchId = useId();
  const [filter, setFilter] = useState<HubRiskFilter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filters: Array<{ count: number; key: Exclude<HubRiskFilter, "all"> }> =
    showRisk
      ? [...RISK_ORDER, "unrated" as const]
          .map((key) => ({
            count: items.filter((item) => riskFilterOf(item) === key).length,
            key,
          }))
          .filter((entry) => entry.count > 0)
      : [];
  const narrowed = filter !== "all" || query.trim() !== "";
  const matches = items.filter((item) =>
    matchesHubCatalog(item, filter, query),
  );
  const paged = !narrowed && !expanded;
  const { desktop, mobile } = HUB_CATALOG_INITIAL;

  return (
    <>
      <div className="mt-5 flex flex-col gap-3 lg:mt-9 lg:flex-row lg:items-center lg:gap-2">
        <div className="relative flex h-[52px] items-center gap-2.5 rounded-full bg-card px-[18px] shadow-[0_1px_2px_rgba(14,20,17,0.05)] lg:order-last lg:ml-auto lg:h-11 lg:w-80 lg:px-4">
          <Search
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <label className="sr-only" htmlFor={searchId}>
            {t("searchLabel")}
          </label>
          <input
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] font-medium text-foreground outline-none placeholder:text-muted-foreground lg:h-10 lg:text-[14px]"
            id={searchId}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            type="search"
            value={query}
          />
        </div>
        {filters.length > 1 ? (
          <div
            aria-label={t("filterLabel")}
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0"
            role="group"
          >
            <FilterChip
              active={filter === "all"}
              count={items.length}
              label={allLabel}
              onSelect={() => setFilter("all")}
            />
            {filters.map((entry) => (
              <FilterChip
                active={filter === entry.key}
                count={entry.count}
                dotClassName={RISK_DOT[entry.key]}
                key={entry.key}
                label={
                  entry.key === "unrated"
                    ? t("riskUnrated")
                    : tDanger(entry.key)
                }
                onSelect={() => setFilter(entry.key)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {matches.length === 0 ? (
        <p className="mt-8 text-[15px] text-muted-foreground" role="status">
          {t("noResults")}
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 lg:mt-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-9">
          {matches.map((item, index) => (
            <li
              className={cn(
                paged && index >= mobile && "max-lg:hidden",
                paged && index >= desktop && "lg:hidden",
              )}
              key={item.id}
            >
              <HubSpeciesCard
                group={group}
                item={item}
                position={index + 1}
                riskLabel={
                  showRisk && item.risk ? tDanger(item.risk) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}

      {paged && items.length > mobile ? (
        <div className="mt-6 flex flex-col gap-2.5 lg:mt-11 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
          <button
            aria-expanded={false}
            className={cn(
              "flex h-[54px] items-center justify-center gap-2 rounded-full border border-foreground/15 bg-card px-6 text-[15px] font-medium text-foreground transition-transform hover:-translate-y-0.5 lg:h-[52px]",
              items.length <= desktop && "lg:hidden",
            )}
            onClick={() => setExpanded(true)}
            type="button"
          >
            <span className="lg:hidden">
              {t("showMore", { count: items.length - mobile })}
            </span>
            <span className="hidden lg:inline">
              {t("showMore", { count: Math.max(items.length - desktop, 0) })}
            </span>
            <ChevronDown aria-hidden="true" className="size-4" />
          </button>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-muted-foreground lg:text-[13px]">
              <span className="lg:hidden">
                {t("shownOf", { shown: mobile, total: items.length })}
              </span>
              <span
                className={cn("hidden", items.length > desktop && "lg:inline")}
              >
                {t("shownOf", { shown: desktop, total: items.length })}
              </span>
            </span>
            {indexLink ? (
              <Link
                className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground lg:hidden"
                href={indexLink.href}
              >
                <span className="border-b border-foreground/30 pb-0.5">
                  {indexLink.label}
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function matchesHubCatalog(
  item: Pick<HubCatalogItem, "name" | "risk" | "scientificName">,
  filter: HubRiskFilter,
  query: string,
) {
  if (filter !== "all" && riskFilterOf(item) !== filter) return false;
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return (
    item.name.toLocaleLowerCase().includes(needle) ||
    item.scientificName.toLocaleLowerCase().includes(needle)
  );
}

function FilterChip({
  active,
  count,
  dotClassName,
  label,
  onSelect,
}: {
  active: boolean;
  count: number;
  dotClassName?: string;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        CHIP_CLASS_NAME,
        active
          ? "bg-foreground text-background"
          : "bg-card text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] hover:border-primary",
      )}
      onClick={onSelect}
      type="button"
    >
      {dotClassName ? (
        <span
          aria-hidden="true"
          className={cn("size-[7px] rounded-full", dotClassName)}
        />
      ) : null}
      {label}
      <span
        className={cn(
          "text-[12px] tabular-nums lg:text-[12.5px]",
          active ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function HubSpeciesCard({
  group,
  item,
  position,
  riskLabel,
}: {
  group: string;
  item: HubCatalogItem;
  position: number;
  riskLabel?: string;
}) {
  return (
    <Link
      className="group block rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:rounded-[24px]"
      href={item.href}
      onClick={() =>
        trackSpeciesClick({
          group,
          position,
          source: "hub",
          species_id: item.id,
        })
      }
      prefetch={false}
    >
      <span className="relative block aspect-4/3 overflow-hidden rounded-[20px] bg-ink lg:rounded-[24px]">
        <CoverImage
          alt={item.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
          mobileSrc={item.mobileImage}
          sizes="(max-width: 1023px) 50vw, 330px"
          src={item.image}
        />
        {riskLabel && item.risk ? (
          <span className="absolute top-2 left-2 inline-flex h-6 items-center gap-1.5 rounded-full bg-white px-[9px] text-[10.5px] font-medium text-[#1a211c] shadow-[0_2px_8px_rgba(14,20,17,0.18)] lg:top-3 lg:left-3 lg:h-7 lg:gap-[7px] lg:px-[11px] lg:text-[12px]">
            <span
              aria-hidden="true"
              className={cn("size-[7px] rounded-full", RISK_DOT[item.risk])}
            />
            {riskLabel}
          </span>
        ) : null}
      </span>
      <span className="mx-1 mt-2.5 block font-display text-[15px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary lg:mx-1.5 lg:mt-3.5 lg:text-[18px]">
        {item.name}
      </span>
      <span className="mx-1 mt-0.5 block text-[12px] text-muted-foreground italic lg:mx-1.5 lg:mt-[3px] lg:text-[13px]">
        {item.scientificName}
      </span>
    </Link>
  );
}

function riskFilterOf(item: Pick<HubCatalogItem, "risk">) {
  return item.risk ?? "unrated";
}
