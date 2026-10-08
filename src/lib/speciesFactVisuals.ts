import type { SpeciesStat } from "@/data/speciesTypes";

import { isElevationStatLabel, isSizeStatLabel } from "@/lib/speciesContent";

export const IUCN_SCALE = ["LC", "NT", "VU", "EN", "CR"] as const;

export type SpeciesFactVisual =
  | {
      code: IucnCode;
      kind: "iucn";
    }
  | {
      end: number;
      kind: "range";
      scaleLabel: string;
      start: number;
    };

type IucnCode = (typeof IUCN_SCALE)[number];

type MeasuredRange = {
  max: number;
  min: number;
  unit: string;
};

const ELEVATION_SCALE_MAX = 5000;
const SCALE_HEADROOM = 1.25;
const SCALE_STEPS = [5, 10, 25, 50, 100, 150, 200, 300, 500, 1000, 2000, 5000];
const METRE_UNITS = new Set(["m", "м", "მ"]);

const NUMBER_PATTERN = String.raw`\d{1,3}(?:[.,\s]\d{3})+|\d+`;
const RANGE_PATTERN = new RegExp(
  String.raw`(${NUMBER_PATTERN})\s*[–—-]\s*(${NUMBER_PATTERN})\s*(სმ|მმ|მ|cm|mm|m|см|мм|м)(?![\p{L}\p{N}])`,
  "u",
);
const IUCN_PATTERN = /\((LC|NT|VU|EN|CR)\)/;

export function getSpeciesFactVisual(
  stat: SpeciesStat,
  locale: string,
): null | SpeciesFactVisual {
  const iucn = IUCN_PATTERN.exec(stat.value);
  if (iucn) return { code: iucn[1] as IucnCode, kind: "iucn" };

  if (isElevationStatLabel(stat.label)) {
    const range = parseMeasuredRange(stat.value);
    if (!range || !METRE_UNITS.has(range.unit)) return null;
    return rangeVisual(range, ELEVATION_SCALE_MAX, locale);
  }

  if (isSizeStatLabel(stat.label)) {
    const range = parseMeasuredRange(stat.value);
    if (!range) return null;
    const scaleMax = SCALE_STEPS.find(
      (step) => step >= range.max * SCALE_HEADROOM,
    );
    return scaleMax ? rangeVisual(range, scaleMax, locale) : null;
  }

  return null;
}

export function parseMeasuredRange(value: string): MeasuredRange | null {
  const match = RANGE_PATTERN.exec(value);
  if (!match) return null;
  const min = toNumber(match[1]);
  const max = toNumber(match[2]);
  if (max <= min) return null;
  return { max, min, unit: match[3] };
}

function rangeVisual(
  range: MeasuredRange,
  scaleMax: number,
  locale: string,
): null | SpeciesFactVisual {
  if (range.max > scaleMax) return null;
  return {
    end: range.max / scaleMax,
    kind: "range",
    scaleLabel: `${new Intl.NumberFormat(locale).format(scaleMax)} ${range.unit}`,
    start: range.min / scaleMax,
  };
}

function toNumber(value: string) {
  return Number(value.replace(/\D/g, ""));
}
