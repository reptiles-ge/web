import { once } from "node:events";
import fs from "node:fs";
import http2 from "node:http2";
import path from "node:path";
import matter from "gray-matter";
import { optimizedBaseUrl } from "../src/data/optimizedImages.generated";
import { optimizedEntry } from "../src/data/optimizedImages";

const CDN_BASE = "https://cdn.reptiles.ge";
const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, "src");
const SPECIES_ROOT = path.join(SRC_ROOT, "content", "species");

const IMAGE_EXT = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const CDN_URL_RE = /https:\/\/cdn\.reptiles\.ge\/[^"'\\\s)>]+/g;
const LOCAL_IMAGE_RE = /(?<!cdn\.reptiles\.ge)\/images\/[^"'\\\s)>]+/g;

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
  let concurrency = 48;
  let json = false;
  let limit: number | undefined;
  let timeoutMs = 8_000;

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

function isSourceSrc(value: string) {
  if (value.includes("/optimized/")) return false;
  if (!IMAGE_EXT.test(value)) return false;
  return value.startsWith(`${CDN_BASE}/`) || value.startsWith("/images/");
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

function collectSources(): Map<string, ImageHit> {
  const bySrc = new Map<string, ImageHit>();

  const add = (raw: string | undefined, ref: string) => {
    if (!raw) return;
    const src = raw.trim();
    if (!isSourceSrc(src)) return;
    const existing = bySrc.get(src);
    if (existing) {
      existing.refs.add(ref);
      return;
    }
    bySrc.set(src, { refs: new Set([ref]), url: src });
  };

  for (const filePath of walkFiles(SRC_ROOT)) {
    const source = relPath(filePath);
    const text = fs.readFileSync(filePath, "utf8");

    for (const match of text.matchAll(CDN_URL_RE)) {
      add(match[0], source);
    }
    for (const match of text.matchAll(LOCAL_IMAGE_RE)) {
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

  return bySrc;
}

function servedUrlsFor(src: string): string[] {
  const entry = optimizedEntry(src);
  if (!entry) {
    return src.startsWith("http") ? [src] : [];
  }
  const urls: string[] = [];
  for (const format of entry.formats) {
    for (const width of entry.widths) {
      urls.push(`${optimizedBaseUrl}${entry.path}-${width}.${format}`);
    }
  }
  return urls;
}

function collectServedUrls(): {
  fallbacks: number;
  hits: Map<string, ImageHit>;
  optimized: number;
  sources: number;
} {
  const sources = collectSources();
  const hits = new Map<string, ImageHit>();
  let optimized = 0;
  let fallbacks = 0;

  for (const [src, source] of sources) {
    const served = servedUrlsFor(src);
    if (served.length === 0) continue;
    if (optimizedEntry(src)) optimized += 1;
    else fallbacks += 1;

    for (const url of served) {
      const existing = hits.get(url);
      if (existing) {
        for (const ref of source.refs) existing.refs.add(ref);
        continue;
      }
      hits.set(url, { refs: new Set(source.refs), url });
    }
  }

  return { fallbacks, hits, optimized, sources: sources.size };
}

type CdnClient = {
  close: () => void;
  status: (url: string) => Promise<number>;
};

function createCdnClient(timeoutMs: number): CdnClient {
  let session: http2.ClientHttp2Session | undefined;
  let connecting: Promise<http2.ClientHttp2Session> | undefined;

  async function connect() {
    if (session && !session.closed && !session.destroyed) return session;
    if (connecting) return connecting;

    connecting = (async () => {
      const next = http2.connect(CDN_BASE);
      next.on("error", () => {
        session = undefined;
      });
      next.on("close", () => {
        if (session === next) session = undefined;
      });
      await once(next, "connect");
      session = next;
      connecting = undefined;
      return next;
    })();

    try {
      return await connecting;
    } catch (error) {
      connecting = undefined;
      throw error;
    }
  }

  function requestStatus(
    client: http2.ClientHttp2Session,
    url: string,
  ): Promise<number> {
    const parsed = new URL(url);
    return new Promise((resolve, reject) => {
      const req = client.request({
        ":method": "HEAD",
        ":path": `${parsed.pathname}${parsed.search}`,
      });
      const timer = setTimeout(() => {
        req.close(http2.constants.NGHTTP2_CANCEL);
        reject(new Error("timeout"));
      }, timeoutMs);

      req.on("response", (headers) => {
        clearTimeout(timer);
        req.close();
        resolve(Number(headers[":status"]));
      });
      req.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      req.end();
    });
  }

  return {
    close() {
      session?.close();
      session = undefined;
    },
    async status(url: string) {
      try {
        return await requestStatus(await connect(), url);
      } catch {
        session?.close();
        session = undefined;
        connecting = undefined;
        return requestStatus(await connect(), url);
      }
    },
  };
}

function toCheckResult(url: string, statusCode: number): CheckResult {
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
}

async function checkUrl(url: string, client: CdnClient): Promise<CheckResult> {
  try {
    return toCheckResult(url, await client.status(url));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      status: "failed",
      url,
    };
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
  const collected = collectServedUrls();
  const sorted = [...collected.hits.values()].sort((a, b) =>
    a.url.localeCompare(b.url),
  );
  const targets = options.limit ? sorted.slice(0, options.limit) : sorted;

  if (targets.length === 0) {
    throw new Error("No photo URLs found.");
  }

  if (!options.json) {
    console.error(
      `Checking ${targets.length} served URL${targets.length === 1 ? "" : "s"} ` +
        `from ${collected.sources} sources ` +
        `(${collected.optimized} avif/webp, ${collected.fallbacks} original)…`,
    );
  }

  const started = Date.now();
  const client = createCdnClient(options.timeoutMs);
  let done = 0;
  let results: CheckResult[];
  try {
    results = await mapPool(targets, options.concurrency, async (hit) => {
      const result = await checkUrl(hit.url, client);
      done += 1;
      printProgress(done, targets.length, options.json);
      return result;
    });
  } finally {
    client.close();
  }
  const elapsedMs = Date.now() - started;

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
          elapsedMs,
          notFound: missing.length,
          ok,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `Checked: ${results.length} in ${(elapsedMs / 1000).toFixed(1)}s`,
  );
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
