import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Manifest } from "@reptiles-ge/img-compression";

import type { OptimizedImageEntry } from "../src/lib/optimizedImageSources";
import type { SchemaCrop } from "../src/lib/schemaCropTypes";

import {
  getUploadedOptimizedImages,
  type ImageManifestWrite,
  putImageManifest,
  putSchemaImageCrops,
} from "../src/lib/optimizedImagesApi";
import { loadEnv } from "./scriptUtils";

const MANIFEST_FILE = "src/data/image-manifest.json";
const GENERATED_FILE = "src/data/optimizedImages.generated.ts";
const SCHEMA_FILE = "src/data/schemaImages.json";

type CliOptions = {
  dryRun: boolean;
  ref: string | undefined;
  schemaFile: string | undefined;
};

function parseArguments(argv: string[]): CliOptions {
  let dryRun = false;
  let ref: string | undefined;
  let schemaFile: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--dry-run":
        dryRun = true;
        break;
      case "--ref":
        ref = argv[++index];
        if (!ref) throw new Error("--ref requires a git ref.");
        break;
      case "--schema-file":
        schemaFile = argv[++index];
        if (!schemaFile) throw new Error("--schema-file requires a path.");
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }
  return { dryRun, ref, schemaFile };
}

function readSource(file: string, ref: string | undefined): string {
  if (ref) {
    return execFileSync("git", ["show", `${ref}:${file}`], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  }
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

function parseGeneratedImages(
  raw: string,
): Record<string, OptimizedImageEntry> {
  const marker =
    "export const optimizedImages: Record<string, OptimizedImageEntry> = ";
  const start = raw.indexOf(marker);
  if (start < 0)
    throw new Error(`${GENERATED_FILE} is not in the expected format`);
  const objectPart = raw.slice(start + marker.length).trimEnd();
  if (!objectPart.endsWith(";")) {
    throw new Error(`${GENERATED_FILE} is not in the expected format`);
  }
  const jsonReady = objectPart
    .slice(0, -1)
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\b(path|width|height|widths|formats)\s*:/g, '"$1":');
  return JSON.parse(jsonReady) as Record<string, OptimizedImageEntry>;
}

function toStorageKey(src: string): string | null {
  const cdn = "https://cdn.reptiles.ge/";
  if (src.startsWith(cdn)) return decodeURIComponent(src.slice(cdn.length));
  if (src.startsWith("/")) return src.slice(1);
  return null;
}

async function main() {
  loadEnv();
  const options = parseArguments(process.argv.slice(2));
  const token = process.env.API_WRITE_TOKEN;
  if (!token) throw new Error("API_WRITE_TOKEN must be in .env.local");

  const manifest = JSON.parse(
    readSource(MANIFEST_FILE, options.ref),
  ) as Manifest;
  const generated = parseGeneratedImages(
    readSource(GENERATED_FILE, options.ref),
  );
  const schema = JSON.parse(
    options.schemaFile
      ? fs.readFileSync(options.schemaFile, "utf8")
      : readSource(SCHEMA_FILE, options.ref),
  ) as { entries: Record<string, SchemaCrop[]> };
  const live = (await getUploadedOptimizedImages()) ?? {};

  const srcByKey = new Map<string, string>();
  for (const src of Object.keys(generated)) {
    const key = toStorageKey(src);
    if (key) srcByKey.set(key, src);
  }

  const writes: ImageManifestWrite[] = [];
  let unresolved = 0;
  for (const [key, entry] of Object.entries(manifest.entries)) {
    let src = srcByKey.get(key);
    if (!src) {
      unresolved += 1;
      src = key.startsWith("images/")
        ? `/${key}`
        : `https://cdn.reptiles.ge/${key}`;
    }
    writes.push({
      asset: live[src] ?? generated[src] ?? null,
      entry: { ...entry, derivatives: [...entry.derivatives] },
      key,
      src,
    });
  }
  const crops = Object.entries(schema.entries).map(([src, list]) => ({
    crops: list,
    src,
  }));

  const kept = writes.filter((write) => live[write.src]).length;
  console.log(
    `${kept} photo(s) already in the API keep their live sizes.\n${writes.length} manifest entries (${writes.filter((w) => w.asset).length} with derivatives, ${unresolved} with no page source in the generated file, keyed by their CDN or site path) and ${crops.length} schema crop sets${options.ref ? ` from ${options.ref}` : ""}.`,
  );
  if (options.dryRun) {
    console.log("Dry run: nothing written.");
    return;
  }
  await putImageManifest(token, writes);
  await putSchemaImageCrops(token, crops);
  console.log("Written to the API.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
