import path from "node:path";

import type { PhotoLicense } from "../src/data/photoLicenses";
import type { PhotoCredit } from "../src/data/speciesTypes";

import { getPublishedNewsArticles } from "../src/data/news";
import { getCatalogSpecies } from "../src/data/species";
import { createPoliteJson, writeOrCheckModule } from "./remoteDataScript";

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, "src/data/photoLicenses.ts");
const USER_AGENT =
  "reptiles.ge photo license lookup (https://reptiles.ge/contact)";
const REQUEST_GAP_MS = 1100;
const COMMONS_BATCH = 40;
const INATURALIST_LICENSE_VERSION = "4.0";

type CommonsPage = {
  imageinfo?: Array<{
    extmetadata?: Record<string, { value: string } | undefined>;
  }>;
  missing?: boolean;
  title: string;
};

type CommonsResponse = {
  query?: {
    normalized?: Array<{ from: string; to: string }>;
    pages?: CommonsPage[];
  };
};

type INaturalistObservation = {
  photos?: Array<{ id: number; license_code?: null | string }>;
};

type Lookup =
  | { kind: "commons"; title: string }
  | { kind: "inaturalist-observation"; id: string }
  | { kind: "unsupported"; reason: string };

type Options = { check: boolean };

type PhotoRef = { credit?: PhotoCredit; owner: string; src: string };

function parseArguments(args: string[]): Options {
  return { check: args.includes("--check") };
}

const cachedJson = createPoliteJson({
  gapMs: REQUEST_GAP_MS,
  userAgent: USER_AGENT,
});

function collectPhotos() {
  const photos: PhotoRef[] = [];
  for (const species of getCatalogSpecies()) {
    photos.push(
      { credit: species.imageCredit, owner: species.id, src: species.image },
      ...(species.mobileImage
        ? [
            {
              credit: species.mobileImageCredit,
              owner: species.id,
              src: species.mobileImage,
            },
          ]
        : []),
      ...species.gallery.map((photo) => ({
        credit: photo.credit,
        owner: species.id,
        src: photo.src,
      })),
    );
  }
  for (const article of getPublishedNewsArticles()) {
    if (article.image) {
      photos.push({
        credit: article.image.credit,
        owner: `news/${article.slug}`,
        src: article.image.src,
      });
    }
  }
  return photos.filter((photo) => photo.src && photo.credit?.url);
}

function lookupFor(sourceUrl: string): Lookup {
  const url = new URL(sourceUrl);
  if (url.hostname === "commons.wikimedia.org") {
    const match = url.pathname.match(/^\/wiki\/(File:.+)$/);
    if (match) {
      return { kind: "commons", title: decodeURIComponent(match[1]) };
    }
    return { kind: "unsupported", reason: "Commons URL is not a file page" };
  }
  if (
    url.hostname === "www.inaturalist.org" ||
    url.hostname === "inaturalist.org"
  ) {
    const observation = url.pathname.match(/^\/observations\/(\d+)$/);
    if (observation) {
      return { id: observation[1], kind: "inaturalist-observation" };
    }
    return {
      kind: "unsupported",
      reason: "iNaturalist photo pages have no public API lookup",
    };
  }
  return {
    kind: "unsupported",
    reason: `no license lookup for ${url.hostname}`,
  };
}

function iNaturalistLicenseUrl(code: null | string | undefined) {
  if (!code) return null;
  if (code === "cc0") {
    return "https://creativecommons.org/publicdomain/zero/1.0/";
  }
  const match = code.match(/^cc-(by(?:-nc)?(?:-sa|-nd)?)$/);
  if (!match) return undefined;
  return `https://creativecommons.org/licenses/${match[1]}/${INATURALIST_LICENSE_VERSION}/`;
}

async function lookupINaturalist(
  id: string,
): Promise<{ license: null | string } | { note: string }> {
  const response = await cachedJson<{ results?: INaturalistObservation[] }>(
    new URL(`https://api.inaturalist.org/v1/observations/${id}`),
  );
  const observation = response.results?.[0];
  if (!observation) return { note: "observation not found" };
  const codes = new Set(
    (observation.photos ?? []).map((photo) => photo.license_code ?? null),
  );
  if (codes.size === 0) return { note: "observation has no photos" };
  if (codes.size > 1) {
    return {
      note: `observation photos carry different licenses (${[...codes].join(", ")})`,
    };
  }
  const license = iNaturalistLicenseUrl([...codes][0]);
  if (license === undefined) {
    return { note: `unknown iNaturalist license code ${[...codes][0]}` };
  }
  return { license };
}

function commonsLicenseUrl(metadata: CommonsPage["imageinfo"]) {
  const fields = metadata?.[0]?.extmetadata ?? {};
  const url = fields.LicenseUrl?.value?.trim();
  if (url) {
    const normalized = url
      .replace(/^http:/, "https:")
      .replace(/\/deed\.[a-z-]+\/?$/i, "")
      .replace(/\/?$/, "/");
    if (normalized.startsWith("https://creativecommons.org/")) {
      return normalized;
    }
  }
  const license = fields.License?.value?.trim().toLowerCase();
  if (license === "pd" || license?.startsWith("pd-")) {
    return "https://creativecommons.org/publicdomain/mark/1.0/";
  }
  if (license === "cc0") {
    return "https://creativecommons.org/publicdomain/zero/1.0/";
  }
  return undefined;
}

async function lookupCommons(titles: string[]) {
  const licenses = new Map<string, string | undefined>();
  for (let index = 0; index < titles.length; index += COMMONS_BATCH) {
    const batch = titles.slice(index, index + COMMONS_BATCH);
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "extmetadata");
    url.searchParams.set("iiextmetadatafilter", "LicenseUrl|License");
    url.searchParams.set("titles", batch.join("|"));
    const response = await cachedJson<CommonsResponse>(url);
    const aliases = new Map<string, string>();
    for (const entry of response.query?.normalized ?? []) {
      aliases.set(entry.to, entry.from);
    }
    for (const page of response.query?.pages ?? []) {
      const title = aliases.get(page.title) ?? page.title;
      licenses.set(
        title,
        page.missing ? undefined : commonsLicenseUrl(page.imageinfo),
      );
    }
  }
  return licenses;
}

function renderModule(entries: Map<string, PhotoLicense>) {
  const lines = [...entries.keys()].sort().map((src) => {
    const entry = entries.get(src)!;
    return `  ${JSON.stringify(src)}: {\n    license: ${JSON.stringify(entry.license)},\n    source: ${JSON.stringify(entry.source)},\n    sourceUrl: ${JSON.stringify(entry.sourceUrl)},\n  },`;
  });
  return `export type PhotoLicense = {
  license: null | string;
  source: "commons" | "inaturalist";
  sourceUrl: string;
};

export const photoLicenses: Readonly<Record<string, PhotoLicense>> = {
${lines.join("\n")}
};
`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const photos = collectPhotos();
  const bySrc = new Map<string, PhotoRef>();
  for (const photo of photos) {
    if (!bySrc.has(photo.src)) bySrc.set(photo.src, photo);
  }

  const notes: string[] = [];
  const entries = new Map<string, PhotoLicense>();
  const commonsTitles = new Set<string>();
  const lookups = new Map<string, Lookup>();
  for (const [src, photo] of bySrc) {
    const lookup = lookupFor(photo.credit!.url!);
    lookups.set(src, lookup);
    if (lookup.kind === "commons") commonsTitles.add(lookup.title);
  }
  const commons = await lookupCommons([...commonsTitles]);

  for (const [src, lookup] of lookups) {
    const photo = bySrc.get(src)!;
    const sourceUrl = photo.credit!.url!;
    if (lookup.kind === "unsupported") {
      if (!lookup.reason.startsWith("no license lookup")) {
        notes.push(`${photo.owner}: ${src} — ${lookup.reason}`);
      }
      continue;
    }
    if (lookup.kind === "commons") {
      const license = commons.get(lookup.title);
      if (license) {
        entries.set(src, { license, source: "commons", sourceUrl });
      } else {
        notes.push(`${photo.owner}: ${src} — no license URL on Commons`);
      }
      continue;
    }
    const result = await lookupINaturalist(lookup.id);
    if ("note" in result) {
      notes.push(`${photo.owner}: ${src} — ${result.note}`);
      continue;
    }
    entries.set(src, {
      license: result.license,
      source: "inaturalist",
      sourceUrl,
    });
  }

  const counts = new Map<string, number>();
  for (const entry of entries.values()) {
    const key = `${entry.source} ${entry.license ?? "all rights reserved"}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  console.log(`${entries.size} photos with a license record`);
  for (const [key, count] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count}\t${key}`);
  }
  for (const note of notes) console.log(`  left out ${note}`);

  await writeOrCheckModule(OUT_FILE, renderModule(entries), options.check);
}

await main();
