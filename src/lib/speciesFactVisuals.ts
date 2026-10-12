import type { SpeciesStat } from "@/data/speciesTypes";

import {
  isConservationStatLabel,
  isElevationStatLabel,
  isSizeStatLabel,
} from "@/lib/speciesContent";

export const IUCN_SCALE = ["LC", "NT", "VU", "EN", "CR"] as const;

export type SpeciesFactVisual =
  | {
      codes: IucnCode[];
      kind: "iucn";
      statusCode: IucnCode | null;
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
const IUCN_PATTERN = /^\s*(LC|NT|VU|EN|CR)\s*$|\((LC|NT|VU|EN|CR)\)/;
const IUCN_CODE_PATTERN = /(?<![\p{L}\p{N}])(LC|NT|VU|EN|CR)(?![\p{L}\p{N}])/gu;
const IUCN_NAME_PATTERNS: Array<[IucnCode, RegExp]> = [
  ["CR", /critically endangered/i],
  ["EN", /(?<!critically )endangered/i],
  ["VU", /vulnerable/i],
  ["NT", /near threatened/i],
  [
    "LC",
    /least concern|ნაკლ(?:\.|ებად) საფრთხ|наим(?:\.|еньшие) опасени|asgari endişe/iu,
  ],
];

export function getSpeciesFactVisual(
  stat: SpeciesStat,
  locale: string,
): null | SpeciesFactVisual {
  const iucn = IUCN_PATTERN.exec(stat.value);
  if (iucn) {
    const code = (iucn[1] ?? iucn[2]) as IucnCode;
    return { codes: [code], kind: "iucn", statusCode: code };
  }

  if (isConservationStatLabel(stat.label)) {
    const codes = iucnCodesIn(stat.value);
    return codes.length > 0 ? { codes, kind: "iucn", statusCode: null } : null;
  }

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

function iucnCodesIn(value: string) {
  const found = new Set<IucnCode>(
    Array.from(
      value.matchAll(IUCN_CODE_PATTERN),
      (match) => match[1] as IucnCode,
    ),
  );
  for (const [code, pattern] of IUCN_NAME_PATTERNS) {
    if (pattern.test(value)) found.add(code);
  }
  return IUCN_SCALE.filter((code) => found.has(code));
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
