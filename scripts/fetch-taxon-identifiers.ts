import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type { TaxonIdentifiers } from "../src/data/taxonIdentifiers";

import { getCatalogSpecies } from "../src/data/species";

type IdentifierSource = keyof TaxonIdentifiers;

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, "src/data/taxonIdentifiers.ts");
const USER_AGENT =
  "reptiles.ge taxon identifier lookup (https://reptiles.ge/contact)";
const REQUEST_GAP_MS = 1100;
const WIKIDATA_BATCH = 40;

const EQUIVALENT_NAMES: Readonly<
  Record<string, Partial<Record<IdentifierSource, string>>>
> = {
  "capra-aegagrus": { gbif: "Capra hircus aegagrus" },
  "capra-cylindricornis": { gbif: "Capra caucasica cylindricornis" },
  "euscorpius-mingrelicus": {
    gbif: "Alpiscorpius mingrelicus",
    inaturalist: "Alpiscorpius mingrelicus",
  },
  "macrovipera-lebetina": { wikidata: "Macrovipera lebetina" },
};

const MANUAL_EXCLUSIONS: Readonly<
  Record<string, Partial<Record<IdentifierSource, string>>>
> = {
  "vipera-transcaucasiana": {
    gbif: "GBIF accepts Vipera transcaucasiana (5960866) apart from Vipera ammodytes, so the V. ammodytes key leaves out the Georgian snakes; the page name is an open owner decision (geo C1)",
    inaturalist:
      "iNaturalist files Georgian snakes under Vipera meridionalis transcaucasiana (1701183), not Vipera ammodytes (1701177)",
    wikidata:
      "the profile name Vipera ammodytes vs Vipera transcaucasiana is an open owner decision (geo C1)",
  },
};

type CatalogTaxon = { id: string; name: string };

type GbifMatch = {
  acceptedUsageKey?: number;
  matchType: string;
  rank?: string;
  status?: string;
  usageKey?: number;
};

type GbifUsage = { canonicalName?: string; key: number };

type INaturalistTaxon = {
  current_synonymous_taxon_ids?: null | number[];
  id: number;
  is_active?: boolean;
  name?: string;
};

type LookupResult<T> = { note?: string; value?: T };

type Options = { cacheDir: string; check: boolean };

type WikidataBinding = {
  gbif?: { value: string };
  inat?: { value: string };
  item: { value: string };
  name: { value: string };
};

type WikidataClaims = { gbif: Set<number>; inat: Set<number> };

const lastRequestAt = new Map<string, number>();

function parseArguments(args: string[]): Options {
  const cacheIndex = args.indexOf("--cache-dir");
  return {
    cacheDir:
      cacheIndex >= 0 && args[cacheIndex + 1]
        ? path.resolve(args[cacheIndex + 1])
        : path.join(ROOT, "node_modules/.cache/taxon-identifiers"),
    check: args.includes("--check"),
  };
}

async function cachedJson<T>(
  url: URL,
  cacheDir: string,
  init: RequestInit = {},
): Promise<T> {
  const cacheKey = createHash("sha256").update(url.toString()).digest("hex");
  const cacheFile = path.join(cacheDir, `${cacheKey}.json`);
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8")) as T;
  }
  const body = await politeFetch<T>(url, init);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(body));
  return body;
}

async function politeFetch<T>(
  url: URL,
  init: RequestInit,
  attempt = 1,
): Promise<T> {
  const wait = (lastRequestAt.get(url.host) ?? 0) + REQUEST_GAP_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt.set(url.host, Date.now());

  try {
    const response = await fetch(url, {
      ...init,
      headers: { "User-Agent": USER_AGENT, ...init.headers },
    });
    if (!response.ok) {
      throw new Error(`${url.toString()} failed with HTTP ${response.status}.`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    return politeFetch(url, init, attempt + 1);
  }
}

async function lookupGbif(
  taxon: CatalogTaxon,
  cacheDir: string,
): Promise<LookupResult<number> & { keys: Set<number> }> {
  const url = new URL("https://api.gbif.org/v1/species/match");
  url.searchParams.set("name", taxon.name);
  url.searchParams.set("kingdom", "Animalia");
  url.searchParams.set("strict", "true");
  const match = await cachedJson<GbifMatch>(url, cacheDir);
  const keys = new Set<number>();
  if (match.usageKey) keys.add(match.usageKey);

  if (match.matchType !== "EXACT" || !match.usageKey) {
    return { keys, note: `GBIF match type ${match.matchType}` };
  }
  if (match.rank !== "SPECIES" && match.rank !== "SUBSPECIES") {
    return { keys, note: `GBIF rank ${match.rank}` };
  }
  if (match.status === "ACCEPTED" || match.status === "DOUBTFUL") {
    return { keys, value: match.usageKey };
  }
  if (!match.acceptedUsageKey) {
    return { keys, note: `GBIF status ${match.status}` };
  }

  keys.add(match.acceptedUsageKey);
  const accepted = await cachedJson<GbifUsage>(
    new URL(`https://api.gbif.org/v1/species/${match.acceptedUsageKey}`),
    cacheDir,
  );
  if (accepted.canonicalName !== EQUIVALENT_NAMES[taxon.id]?.gbif) {
    return {
      keys,
      note: `GBIF lists ${taxon.name} as a ${match.status} of ${accepted.canonicalName} (${match.acceptedUsageKey}), which the profile does not present as equivalent`,
    };
  }
  return { keys, value: match.acceptedUsageKey };
}

async function lookupINaturalist(
  taxon: CatalogTaxon,
  cacheDir: string,
): Promise<LookupResult<number>> {
  const names = [taxon.name, EQUIVALENT_NAMES[taxon.id]?.inaturalist].filter(
    (name): name is string => Boolean(name),
  );
  const notes: string[] = [];
  for (const name of names) {
    const url = new URL("https://api.inaturalist.org/v1/taxa");
    url.searchParams.set("q", name);
    url.searchParams.set("rank", "species,subspecies");
    url.searchParams.set("per_page", "30");
    const { results } = await cachedJson<{ results: INaturalistTaxon[] }>(
      url,
      cacheDir,
    );
    const exact = results.filter((entry) => entry.name === name);
    const active = exact.filter((entry) => entry.is_active);
    if (active.length === 1) return { value: active[0].id };
    if (active.length > 1) {
      notes.push(`${active.length} active iNaturalist taxa named ${name}`);
    } else if (exact.length > 0) {
      notes.push(`iNaturalist taxon ${exact[0].id} (${name}) is inactive`);
    } else {
      notes.push(`no exact iNaturalist taxon named ${name}`);
    }
  }
  return { note: notes.join("; ") };
}

async function lookupWikidata(names: string[], cacheDir: string) {
  const bindings: WikidataBinding[] = [];
  const unique = [...new Set(names)];
  for (let start = 0; start < unique.length; start += WIKIDATA_BATCH) {
    const values = unique
      .slice(start, start + WIKIDATA_BATCH)
      .map((name) => JSON.stringify(name))
      .join(" ");
    const query = `SELECT ?item ?name ?gbif ?inat WHERE { VALUES ?name { ${values} } ?item wdt:P225 ?name . OPTIONAL { ?item wdt:P846 ?gbif } OPTIONAL { ?item wdt:P3151 ?inat } }`;
    const url = new URL("https://query.wikidata.org/sparql");
    url.searchParams.set("query", query);
    url.searchParams.set("format", "json");
    const body = await cachedJson<{
      results: { bindings: WikidataBinding[] };
    }>(url, cacheDir, {
      headers: { Accept: "application/sparql-results+json" },
    });
    bindings.push(...body.results.bindings);
  }

  const byName = new Map<string, Map<string, WikidataClaims>>();
  for (const binding of bindings) {
    const qid = binding.item.value.replace(
      "http://www.wikidata.org/entity/",
      "",
    );
    const items = byName.get(binding.name.value) ?? new Map();
    const claims = items.get(qid) ?? { gbif: new Set(), inat: new Set() };
    if (binding.gbif) claims.gbif.add(Number(binding.gbif.value));
    if (binding.inat) claims.inat.add(Number(binding.inat.value));
    items.set(qid, claims);
    byName.set(binding.name.value, items);
  }
  return byName;
}

async function inaturalistIdsAgree(
  claimed: Set<number>,
  inaturalist: number,
  cacheDir: string,
) {
  if (claimed.has(inaturalist)) return true;
  for (const id of claimed) {
    const { results } = await cachedJson<{ results: INaturalistTaxon[] }>(
      new URL(`https://api.inaturalist.org/v1/taxa/${id}`),
      cacheDir,
    );
    const replacedBy = results[0]?.current_synonymous_taxon_ids ?? [];
    const swappedIntoOurs =
      results[0]?.is_active === false &&
      replacedBy.length === 1 &&
      replacedBy[0] === inaturalist;
    if (!swappedIntoOurs) return false;
  }
  return true;
}

async function resolveWikidata(
  taxon: CatalogTaxon,
  wikidata: Map<string, Map<string, WikidataClaims>>,
  gbifKeys: Set<number>,
  inaturalist: number | undefined,
  cacheDir: string,
): Promise<LookupResult<string>> {
  const names = [taxon.name, EQUIVALENT_NAMES[taxon.id]?.wikidata].filter(
    (name): name is string => Boolean(name),
  );
  const name = names.find((candidate) => wikidata.get(candidate)?.size);
  const items = name ? wikidata.get(name) : undefined;
  if (!name || !items) {
    return { note: `no item with P225 "${names.join('" or "')}"` };
  }
  if (items.size > 1) {
    return {
      note: `${items.size} items with P225 "${name}" (${[...items.keys()].join(", ")})`,
    };
  }

  const [[qid, claims]] = [...items.entries()];
  if ([...claims.gbif].some((key) => !gbifKeys.has(key))) {
    return {
      note: `${qid} P846 ${[...claims.gbif].join("/")} does not match GBIF ${[...gbifKeys].join("/") || "none"}`,
    };
  }
  if (
    inaturalist !== undefined &&
    !(await inaturalistIdsAgree(claims.inat, inaturalist, cacheDir))
  ) {
    return {
      note: `${qid} P3151 ${[...claims.inat].join("/")} does not resolve to iNaturalist ${inaturalist}`,
    };
  }
  return { value: qid };
}

function renderModule(identifiers: Map<string, TaxonIdentifiers>) {
  const lines = [...identifiers.entries()]
    .filter(([, ids]) => Object.keys(ids).length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([id, ids]) => [
      `  "${id}": {`,
      ...(ids.gbif === undefined ? [] : [`    gbif: ${ids.gbif},`]),
      ...(ids.inaturalist === undefined
        ? []
        : [`    inaturalist: ${ids.inaturalist},`]),
      ...(ids.wikidata === undefined
        ? []
        : [`    wikidata: "${ids.wikidata}",`]),
      "  },",
    ]);
  return `export type TaxonIdentifiers = {
  gbif?: number;
  inaturalist?: number;
  wikidata?: string;
};

export const taxonIdentifiers: Readonly<Record<string, TaxonIdentifiers>> = {
${lines.join("\n")}
};
`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const taxa: CatalogTaxon[] = getCatalogSpecies().map((species) => ({
    id: species.id,
    name: species.scientificName.trim(),
  }));
  const wikidata = await lookupWikidata(
    taxa.flatMap((taxon) => {
      const equivalent = EQUIVALENT_NAMES[taxon.id]?.wikidata;
      return equivalent ? [taxon.name, equivalent] : [taxon.name];
    }),
    options.cacheDir,
  );
  const identifiers = new Map<string, TaxonIdentifiers>();
  const exclusions: string[] = [];

  for (const taxon of taxa) {
    const [gbif, inaturalist] = await Promise.all([
      lookupGbif(taxon, options.cacheDir),
      lookupINaturalist(taxon, options.cacheDir),
    ]);
    const wikidataResult = await resolveWikidata(
      taxon,
      wikidata,
      gbif.keys,
      inaturalist.value,
      options.cacheDir,
    );
    const results: Record<IdentifierSource, LookupResult<number | string>> = {
      gbif,
      inaturalist,
      wikidata: wikidataResult,
    };
    const ids: Record<string, number | string> = {};
    for (const source of ["gbif", "inaturalist", "wikidata"] as const) {
      const manual = MANUAL_EXCLUSIONS[taxon.id]?.[source];
      const { note, value } = results[source];
      if (manual) exclusions.push(`${taxon.id}: ${source} — ${manual}`);
      else if (value !== undefined) ids[source] = value;
      else exclusions.push(`${taxon.id}: ${source} — ${note}`);
    }
    identifiers.set(taxon.id, ids as TaxonIdentifiers);
  }

  const counts = { gbif: 0, inaturalist: 0, wikidata: 0 };
  for (const ids of identifiers.values()) {
    for (const source of Object.keys(ids) as IdentifierSource[]) {
      counts[source] += 1;
    }
  }
  console.log(
    `${taxa.length} catalog species — GBIF ${counts.gbif}, iNaturalist ${counts.inaturalist}, Wikidata ${counts.wikidata}`,
  );
  for (const line of exclusions) console.log(`  left out ${line}`);

  const output = renderModule(identifiers);
  if (options.check) {
    const current = fs.existsSync(OUT_FILE)
      ? fs.readFileSync(OUT_FILE, "utf8")
      : "";
    if (current !== output) {
      console.error(`${path.relative(ROOT, OUT_FILE)} is out of date.`);
      process.exitCode = 1;
    }
    return;
  }
  fs.writeFileSync(OUT_FILE, output);
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)}`);
}

await main();
