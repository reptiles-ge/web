"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";

import type { RegionPathId } from "@/data/georgia-paths";
import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaRegionSummary } from "@/lib/halyomorphaOccurrences";

import {
  type HalyomorphaFieldRecord,
  type HalyomorphaRangeMapCopy,
  type HalyomorphaRangeRegionName,
} from "@/components/map/HalyomorphaRangeMapTypes";
import { RangeHatchSwatch } from "@/components/map/RangeHatch";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { regionHref } from "@/lib/regionHref";

const LATEST_RECORDS = 4;

type HalyomorphaRangeLedgerProps = {
  copy: HalyomorphaRangeMapCopy;
  hatchId: string;
  hoveredRegionId: null | RegionPathId;
  locale: AppLocale;
  officialRegionIds: string[];
  onHoverRegion: (regionId: null | RegionPathId) => void;
  onRevealRecord: (recordId: string) => void;
  onToggleRegion: (regionId: RegionPathId) => void;
  records: HalyomorphaFieldRecord[];
  recordsByRegion: HalyomorphaRegionSummary[];
  regionNames: HalyomorphaRangeRegionName[];
  selectedRecordId?: string;
  selectedRegionId: null | RegionPathId;
};

type LedgerGroup = {
  id: string;
  label: string;
  rows: LedgerRow[];
};

type LedgerRow = {
  count: number;
  id: RegionPathId;
  name: string;
  official: boolean;
  pageLabel: string;
  years: string;
};

export function HalyomorphaRangeLedger({
  copy,
  hatchId,
  hoveredRegionId,
  locale,
  officialRegionIds,
  onHoverRegion,
  onRevealRecord,
  onToggleRegion,
  records,
  recordsByRegion,
  regionNames,
  selectedRecordId,
  selectedRegionId,
}: HalyomorphaRangeLedgerProps) {
  const groups = useMemo(
    () => ledgerGroups(copy, recordsByRegion, officialRegionIds, regionNames),
    [copy, officialRegionIds, recordsByRegion, regionNames],
  );
  const latestRecords = useMemo(
    () => latestRegionRecords(records, selectedRegionId),
    [records, selectedRegionId],
  );

  if (groups.length === 0) return null;

  return (
    <div className="-mx-2.5 mt-10 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <table className="w-full border-separate border-spacing-0 text-[14px] leading-snug">
        <caption className="px-2.5 text-left font-display text-[1.125rem] leading-tight font-semibold text-foreground">
          {copy.regionSummaryTitle}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{copy.regionsMetricLabel}</th>
            <th scope="col">{copy.regionRecordsLabel}</th>
            <td />
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.id}>
            <tr>
              <th
                className="px-2.5 pt-5 pb-2 text-left text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
                colSpan={3}
                scope="rowgroup"
              >
                {group.label}
              </th>
            </tr>
            {group.rows.map((row) => (
              <LedgerRegion
                copy={copy}
                hatchId={hatchId}
                hovered={hoveredRegionId === row.id}
                key={row.id}
                latestRecords={latestRecords}
                locale={locale}
                onHover={onHoverRegion}
                onRevealRecord={onRevealRecord}
                onToggle={onToggleRegion}
                row={row}
                selected={selectedRegionId === row.id}
                selectedRecordId={selectedRecordId}
              />
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

function formatYearRange(region: HalyomorphaRegionSummary) {
  if (!region.firstYear || !region.lastYear) return "";
  if (region.firstYear === region.lastYear) return String(region.firstYear);
  return `${region.firstYear}–${region.lastYear}`;
}

function latestRegionRecords(
  records: HalyomorphaFieldRecord[],
  regionId: null | RegionPathId,
) {
  const latest: HalyomorphaFieldRecord[] = [];
  if (!regionId) return latest;
  for (const record of records) {
    if (record.regionId !== regionId) continue;
    latest.push(record);
    if (latest.length === LATEST_RECORDS) break;
  }
  return latest;
}

function ledgerGroups(
  copy: HalyomorphaRangeMapCopy,
  recordsByRegion: HalyomorphaRegionSummary[],
  officialRegionIds: string[],
  regionNames: HalyomorphaRangeRegionName[],
): LedgerGroup[] {
  const officialIds = new Set(officialRegionIds);
  const names = new Map(regionNames.map((region) => [region.id, region]));
  const recorded = new Set<RegionPathId>();
  const confirmed: LedgerRow[] = [];
  const recordedOnly: LedgerRow[] = [];
  const official: LedgerRow[] = [];

  for (const region of recordsByRegion) {
    const name = names.get(region.id);
    const rows = region.status === "confirmed" ? confirmed : recordedOnly;
    recorded.add(region.id);
    rows.push({
      count: region.count,
      id: region.id,
      name: name?.name ?? region.name,
      official: officialIds.has(region.id),
      pageLabel: name?.pageLabel ?? region.name,
      years: formatYearRange(region),
    });
  }
  for (const region of regionNames) {
    if (!officialIds.has(region.id) || recorded.has(region.id)) continue;
    official.push({
      count: 0,
      id: region.id,
      name: region.name,
      official: true,
      pageLabel: region.pageLabel,
      years: "",
    });
  }

  return [
    { id: "confirmed", label: copy.confirmedStatusLabel, rows: confirmed },
    {
      id: "recorded-only",
      label: copy.recordedOnlyStatusLabel,
      rows: recordedOnly,
    },
    { id: "official", label: copy.officialRegionLabel, rows: official },
  ].filter((group) => group.rows.length > 0);
}

function LedgerRecords({
  label,
  onReveal,
  records,
  selectedRecordId,
}: {
  label: string;
  onReveal: (recordId: string) => void;
  records: HalyomorphaFieldRecord[];
  selectedRecordId?: string;
}) {
  if (records.length === 0) return null;

  return (
    <>
      <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="mt-1">
        {records.map((record) => (
          <li key={record.id}>
            <button
              aria-pressed={selectedRecordId === record.id}
              className={cn(
                "flex min-h-9 w-full items-baseline gap-2 py-1.5 text-left text-[13px] transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary pointer-coarse:min-h-11",
                selectedRecordId === record.id
                  ? "font-semibold text-primary"
                  : "text-foreground",
              )}
              onClick={() => onReveal(record.id)}
              type="button"
            >
              <span aria-hidden="true" data-range-mark="dot" />
              <span className="min-w-0">
                {record.locality}
                {record.formattedDate ? (
                  <span className="font-normal text-muted-foreground">
                    {" · "}
                    {record.formattedDate}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function LedgerRegion({
  copy,
  hatchId,
  hovered,
  latestRecords,
  locale,
  onHover,
  onRevealRecord,
  onToggle,
  row,
  selected,
  selectedRecordId,
}: {
  copy: HalyomorphaRangeMapCopy;
  hatchId: string;
  hovered: boolean;
  latestRecords: HalyomorphaFieldRecord[];
  locale: AppLocale;
  onHover: (regionId: null | RegionPathId) => void;
  onRevealRecord: (recordId: string) => void;
  onToggle: (regionId: RegionPathId) => void;
  row: LedgerRow;
  selected: boolean;
  selectedRecordId?: string;
}) {
  return (
    <>
      <tr
        className={cn(
          "*:transition-colors [&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl",
          (hovered || selected) && "*:bg-surface",
          selected &&
            "[&>*:first-child]:rounded-bl-none [&>*:last-child]:rounded-br-none",
        )}
        onMouseEnter={() => onHover(row.id)}
        onMouseLeave={() => onHover(null)}
      >
        <th className="p-0 text-left font-normal" scope="row">
          <span className="flex items-center gap-2.5 pl-2.5">
            <LedgerSwatch
              hatchId={hatchId}
              label={copy.officialRegionLabel}
              official={row.official}
            />
            <button
              aria-expanded={selected}
              className={cn(
                "min-h-11 min-w-0 flex-1 py-2 text-left text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                selected && "font-semibold",
              )}
              onBlur={() => onHover(null)}
              onClick={() => onToggle(row.id)}
              onFocus={() => onHover(row.id)}
              type="button"
            >
              {row.name}
            </button>
          </span>
        </th>
        <td className="px-2 text-right text-foreground tabular-nums">
          {row.count > 0 ? row.count.toLocaleString(locale) : "—"}
        </td>
        <td className="w-13 py-1 pr-2.5 pl-0 text-right">
          <Link
            aria-label={row.pageLabel}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary pointer-coarse:size-10"
            href={regionHref(row.id)}
            title={row.pageLabel}
          >
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </td>
      </tr>
      {selected ? (
        <tr>
          <td
            className="rounded-b-xl bg-surface pt-0 pr-3 pb-4 pl-8"
            colSpan={3}
          >
            <LedgerRegionSummary
              emptyLabel={copy.noRegionRecordsLabel}
              row={row}
            />
            <LedgerRecords
              label={copy.latestRecordsLabel}
              onReveal={onRevealRecord}
              records={latestRecords}
              selectedRecordId={selectedRecordId}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function LedgerRegionSummary({
  emptyLabel,
  row,
}: {
  emptyLabel: string;
  row: LedgerRow;
}) {
  const text = row.count > 0 ? row.years : emptyLabel;
  if (!text) return null;

  return <p className="text-[13px] text-muted-foreground">{text}</p>;
}

function LedgerSwatch({
  hatchId,
  label,
  official,
}: {
  hatchId: string;
  label: string;
  official: boolean;
}) {
  if (!official) return <span aria-hidden="true" data-range-mark="swatch" />;

  return (
    <>
      <RangeHatchSwatch id={hatchId} />
      <span className="sr-only">{label}</span>
    </>
  );
}
