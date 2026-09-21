import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { SpeciesFieldRecord } from "../src/data/speciesTypes";
import {
  type INaturalistObservation,
  mergeINaturalistFieldRecords,
  replaceFieldRecordsInMdx,
} from "../src/lib/inaturalistFieldRecords";

const DEFAULT_PLACE_ID = 8857;
const DEFAULT_PER_PAGE = 200;
const DEFAULT_COORDINATE_DECIMALS = 5;
const INATURALIST_API = "https://api.inaturalist.org/v1";
const ROOT = process.cwd();

type CliOptions = {
  coordinateDecimals: number;
  dryRun: boolean;
  includeWithoutPhotos: boolean;
  limit?: number;
  perPage: number;
  placeId: number;
  speciesId: string;
  taxonId?: number;
};

type INaturalistObservationsResponse = {
  results: INaturalistObservation[];
  total_results?: number;
};

type INaturalistTaxaResponse = {
  results: Array<{
    id: number;
    matched_term?: null | string;
    name?: null | string;
    rank?: null | string;
  }>;
};

function fieldRecordsFromFrontmatter(value: unknown): SpeciesFieldRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isFieldRecord);
}

function helpText() {
  return [
    "Usage: pnpm inaturalist:field-records <species-id> [options]",
    "",
    "Options:",
    `  --place-id <id>               iNaturalist place id (default: ${DEFAULT_PLACE_ID})`,
    "  --taxon-id <id>               iNaturalist taxon id; inferred from scientificName when omitted",
    `  --per-page <n>                API page size, 1-200 (default: ${DEFAULT_PER_PAGE})`,
    "  --limit <n>                   stop after n fetched observations",
    `  --coordinate-decimals <n>     coordinate precision for dedupe (default: ${DEFAULT_COORDINATE_DECIMALS})`,
    "  --include-without-photos      do not require photos=true",
    "  --dry-run                     fetch and report without writing MDX",
    "  --help                        show this help",
  ].join("\n");
}

function isFieldRecord(value: unknown): value is SpeciesFieldRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<SpeciesFieldRecord>;
  return (
    typeof record.locality === "string" &&
    typeof record.lat === "number" &&
    typeof record.lng === "number"
  );
}

function mdxPathForSpecies(speciesId: string) {
  return path.join(ROOT, "src", "content", "species", speciesId, "ka.mdx");
}

function parseArguments(argv: string[]): CliOptions {
  let coordinateDecimals = DEFAULT_COORDINATE_DECIMALS;
  let dryRun = false;
  let includeWithoutPhotos = false;
  let limit: number | undefined;
  let perPage = DEFAULT_PER_PAGE;
  let placeId = DEFAULT_PLACE_ID;
  let speciesId = "";
  let taxonId: number | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--coordinate-decimals":
        index += 1;
        coordinateDecimals = numberOption("--coordinate-decimals", argv[index]);
        break;
      case "--dry-run":
        dryRun = true;
        break;
      case "--help":
        console.log(helpText());
        process.exit(0);
      case "--include-without-photos":
        includeWithoutPhotos = true;
        break;
      case "--limit":
        index += 1;
        limit = numberOption("--limit", argv[index]);
        break;
      case "--per-page":
        index += 1;
        perPage = numberOption("--per-page", argv[index]);
        break;
      case "--place-id":
        index += 1;
        placeId = numberOption("--place-id", argv[index]);
        break;
      case "--taxon-id":
        index += 1;
        taxonId = numberOption("--taxon-id", argv[index]);
        break;
      default:
        if (argument.startsWith("--")) {
          throw new Error(`Unknown argument "${argument}".`);
        }
        if (speciesId) throw new Error(`Unexpected argument "${argument}".`);
        speciesId = argument;
    }
  }

  if (!speciesId) throw new Error(`Missing species id.\n\n${helpText()}`);
  if (!Number.isInteger(placeId) || placeId < 1) {
    throw new Error("--place-id requires a positive integer.");
  }
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 200) {
    throw new Error("--per-page requires an integer from 1 to 200.");
  }
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit requires a positive integer.");
  }
  if (
    !Number.isInteger(coordinateDecimals) ||
    coordinateDecimals < 0 ||
    coordinateDecimals > 8
  ) {
    throw new Error("--coordinate-decimals requires an integer from 0 to 8.");
  }
  if (taxonId !== undefined && (!Number.isInteger(taxonId) || taxonId < 1)) {
    throw new Error("--taxon-id requires a positive integer.");
  }

  return {
    coordinateDecimals,
    dryRun,
    includeWithoutPhotos,
    limit,
    perPage,
    placeId,
    speciesId,
    taxonId,
  };
}

function numberOption(name: string, value: string | undefined) {
  if (!value) throw new Error(`${name} requires a value.`);
  return Number(value);
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url.toString()} failed with HTTP ${response.status}.`);
  }
  return (await response.json()) as T;
}

async function findTaxonId(scientificName: string): Promise<number> {
  const url = new URL(`${INATURALIST_API}/taxa`);
  url.searchParams.set("is_active", "true");
  url.searchParams.set("per_page", "10");
  url.searchParams.set("q", scientificName);
  url.searchParams.set("rank", "species");

  const response = await fetchJson<INaturalistTaxaResponse>(url);
  const normalized = scientificName.toLowerCase();
  const exact =
    response.results.find(
      (taxon) => taxon.name?.toLowerCase() === normalized,
    ) ??
    response.results.find(
      (taxon) => taxon.matched_term?.toLowerCase() === normalized,
    );

  if (!exact) {
    throw new Error(
      `Could not resolve iNaturalist taxon for "${scientificName}". Pass --taxon-id.`,
    );
  }

  return exact.id;
}

async function fetchObservations(options: CliOptions, taxonId: number) {
  const observations: INaturalistObservation[] = [];
  let totalResults: number | undefined;

  for (let page = 1; ; page += 1) {
    const remaining = options.limit
      ? options.limit - observations.length
      : options.perPage;
    if (remaining <= 0) break;

    const url = new URL(`${INATURALIST_API}/observations`);
    url.searchParams.set("geo", "true");
    url.searchParams.set("order", "desc");
    url.searchParams.set("order_by", "observed_on");
    url.searchParams.set("page", String(page));
    url.searchParams.set(
      "per_page",
      String(Math.min(options.perPage, remaining)),
    );
    url.searchParams.set("place_id", String(options.placeId));
    url.searchParams.set("taxon_id", String(taxonId));
    if (!options.includeWithoutPhotos) url.searchParams.set("photos", "true");

    const response = await fetchJson<INaturalistObservationsResponse>(url);
    totalResults ??= response.total_results;
    observations.push(...response.results);
    process.stderr.write(
      `\rFetched ${observations.length}/${totalResults ?? "?"} observations`,
    );

    if (response.results.length === 0) break;
    if (response.results.length < Math.min(options.perPage, remaining)) break;
  }

  process.stderr.write("\n");
  return { observations, totalResults };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const filePath = mdxPathForSpecies(options.speciesId);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = parsed.data as {
    fieldRecords?: unknown;
    scientificName?: string;
  };
  const scientificName = frontmatter.scientificName?.trim();

  if (!scientificName && !options.taxonId) {
    throw new Error(
      `${path.relative(ROOT, filePath)} has no scientificName. Pass --taxon-id.`,
    );
  }

  const taxonId = options.taxonId ?? (await findTaxonId(scientificName ?? ""));
  const existing = fieldRecordsFromFrontmatter(frontmatter.fieldRecords);
  const { observations, totalResults } = await fetchObservations(
    options,
    taxonId,
  );
  const merge = mergeINaturalistFieldRecords({
    coordinateDecimals: options.coordinateDecimals,
    existing,
    observations,
  });

  if (!options.dryRun) {
    await fs.writeFile(filePath, replaceFieldRecordsInMdx(raw, merge.records));
  }

  console.log(
    JSON.stringify(
      {
        added: merge.added,
        existing: existing.length,
        fetched: observations.length,
        file: path.relative(ROOT, filePath),
        missingCoordinates: merge.skippedMissingCoordinates,
        output: options.dryRun ? "dry-run" : "written",
        skippedDuplicateCoordinates: merge.skippedDuplicateCoordinates,
        skippedDuplicateObservations: merge.skippedDuplicateObservations,
        skippedExistingDuplicateCoordinates:
          merge.skippedExistingDuplicateCoordinates,
        speciesId: options.speciesId,
        taxonId,
        totalResults,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
