import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CDN_BASE = "https://cdn.reptiles.ge";
const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, "src");
const SPECIES_ROOT = path.join(SRC_ROOT, "content", "species");

const IMAGE_EXT = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const CDN_URL_RE = /https:\/\/cdn\.reptiles\.ge\/[^"'\\\s)>]+/g;

const SKIP_DIR_NAMES = new Set([".git", ".next", "node_modules"]);
const SKIP_FILE_NAMES = new Set([
  "georgia-paths.generated.ts",
  "optimizedImages.generated.ts",
  "species.generated.ts",
]);
const SCAN_EXTS = new Set([
  ".css",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
]);

const REGION_PATH_IDS = [
  "abkhazia",
  "adjara",
  "guria",
  "imereti",
  "kakheti",
  "kvemo-kartli",
  "mtskheta-mtianeti",
  "racha",
  "samegrelo",
  "samtskhe-javakheti",
  "shida-kartli",
  "tbilisi",
] as const;

type CheckStatus = "ok" | "not_found" | "failed";

type ImageHit = {
  refs: Set<string>;
  url: string;
};

type CheckResult = {
  error?: string;
  status: CheckStatus;
  statusCode?: number;
  url: string;
};

type CliOptions = {
  concurrency: number;
  json: boolean;
  limit: number | undefined;
  timeoutMs: number;
};

function parseArguments(argv: string[]): CliOptions {
  let concurrency = 12;
  let json = false;
  let limit: number | undefined;
  let timeoutMs = 15_000;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--concurrency":
        index += 1;
        concurrency = Number(argv[index]);
        break;
      case "--json":
        json = true;
        break;
      case "--limit":
        index += 1;
        limit = Number(argv[index]);
        break;
      case "--timeout":
        index += 1;
        timeoutMs = Number(argv[index]);
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("--concurrency requires a positive integer.");
  }
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit requires a positive integer.");
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
    throw new Error("--timeout requires a positive integer (milliseconds).");
  }

  return { concurrency, json, limit, timeoutMs };
}

function isPhotoUrl(value: string) {
  if (!value.startsWith(`${CDN_BASE}/`)) return false;
  if (value.includes("/optimized/")) return false;
  return IMAGE_EXT.test(value);
}

function relPath(filePath: string) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function walkFiles(dir: string, out: string[] = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walkFiles(full, out);
      continue;
    }
    if (SKIP_FILE_NAMES.has(entry.name)) continue;
    if (SCAN_EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function collectUrls(): Map<string, ImageHit> {
  const byUrl = new Map<string, ImageHit>();

  const add = (raw: string | undefined, ref: string) => {
    if (!raw) return;
    const url = raw.trim();
    if (!isPhotoUrl(url)) return;
    const existing = byUrl.get(url);
    if (existing) {
      existing.refs.add(ref);
      return;
    }
    byUrl.set(url, { refs: new Set([ref]), url });
  };

  for (const filePath of walkFiles(SRC_ROOT)) {
    const source = relPath(filePath);
    const text = fs.readFileSync(filePath, "utf8");

    for (const match of text.matchAll(CDN_URL_RE)) {
      add(match[0], source);
    }

    if (!filePath.endsWith(".mdx")) continue;

    const { data } = matter(text);
    const fm = data as {
      gallery?: Array<{ src?: string }>;
      id?: string;
      image?: string;
      mobileImage?: string;
    };
    const speciesId = fm.id ?? path.basename(path.dirname(filePath));
    const locale = path.basename(filePath, ".mdx");
    const prefix = `${speciesId}/${locale}`;

    add(fm.image, `${prefix} image`);
    add(fm.mobileImage, `${prefix} mobileImage`);
    for (const photo of fm.gallery ?? []) {
      add(photo.src, `${prefix} gallery`);
    }
  }

  if (!fs.existsSync(SPECIES_ROOT)) {
    throw new Error(`Missing species content directory: ${SPECIES_ROOT}`);
  }

  for (const id of REGION_PATH_IDS) {
    add(`${CDN_BASE}/regions/${id}.jpg`, `regions/${id}`);
  }

  return byUrl;
}

async function requestStatus(
  url: string,
  method: "GET" | "HEAD",
  timeoutMs: number,
): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
    });
    controller.abort();
    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

function shouldConfirmWithGet(status: number) {
  return status === 403 || status === 404 || status === 405 || status === 501;
}

async function checkUrl(url: string, timeoutMs: number): Promise<CheckResult> {
  try {
    let statusCode = await requestStatus(url, "HEAD", timeoutMs);
    if (shouldConfirmWithGet(statusCode)) {
      statusCode = await requestStatus(url, "GET", timeoutMs);
    }
    if (statusCode === 404) {
      return { status: "not_found", statusCode, url };
    }
    if (statusCode >= 200 && statusCode < 400) {
      return { status: "ok", statusCode, url };
    }
    return {
      error: `HTTP ${statusCode}`,
      status: "failed",
      statusCode,
      url,
    };
  } catch (error) {
    try {
      const statusCode = await requestStatus(url, "GET", timeoutMs);
      if (statusCode === 404) {
        return { status: "not_found", statusCode, url };
      }
      if (statusCode >= 200 && statusCode < 400) {
        return { status: "ok", statusCode, url };
      }
      return {
        error: `HTTP ${statusCode}`,
        status: "failed",
        statusCode,
        url,
      };
    } catch (retryError) {
      const message =
        retryError instanceof Error
          ? retryError.message
          : error instanceof Error
            ? error.message
            : String(retryError);
      return { error: message, status: "failed", url };
    }
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  return results;
}

function printProgress(done: number, total: number, json: boolean) {
  if (json) return;
  process.stderr.write(`\rChecked ${done}/${total}`);
  if (done === total) process.stderr.write("\n");
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const collected = [...collectUrls().values()].sort((a, b) =>
    a.url.localeCompare(b.url),
  );
  const targets = options.limit ? collected.slice(0, options.limit) : collected;

  if (targets.length === 0) {
    throw new Error("No photo URLs found.");
  }

  if (!options.json) {
    console.error(
      `Checking ${targets.length} unique photo URL${targets.length === 1 ? "" : "s"}…`,
    );
  }

  let done = 0;
  const results = await mapPool(targets, options.concurrency, async (hit) => {
    const result = await checkUrl(hit.url, options.timeoutMs);
    done += 1;
    printProgress(done, targets.length, options.json);
    return result;
  });

  const missing = results.filter((item) => item.status === "not_found");
  const failed = results.filter((item) => item.status === "failed");
  const ok = results.length - missing.length - failed.length;
  const refsByUrl = new Map(targets.map((hit) => [hit.url, [...hit.refs]]));

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          checked: results.length,
          failed: failed.map((item) => ({
            error: item.error,
            refs: refsByUrl.get(item.url) ?? [],
            statusCode: item.statusCode,
            url: item.url,
          })),
          missing: missing.map((item) => ({
            refs: refsByUrl.get(item.url) ?? [],
            url: item.url,
          })),
          notFound: missing.length,
          ok,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`Checked: ${results.length}`);
  console.log(`OK: ${ok}`);
  console.log(`404 Not Found: ${missing.length}`);
  if (failed.length > 0) {
    console.log(`Other failures: ${failed.length}`);
  }

  if (missing.length > 0) {
    console.log("\n404 Not Found:");
    for (const item of missing) {
      const refs = (refsByUrl.get(item.url) ?? []).join(", ");
      console.log(`  ${item.url}`);
      if (refs) console.log(`    ${refs}`);
    }
  }

  if (failed.length > 0) {
    console.log("\nOther failures:");
    for (const item of failed) {
      const refs = (refsByUrl.get(item.url) ?? []).join(", ");
      console.log(`  ${item.url} (${item.error ?? "failed"})`);
      if (refs) console.log(`    ${refs}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
