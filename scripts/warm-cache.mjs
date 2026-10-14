#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    concurrency: { default: "8", type: "string" },
    "indexnow-state": { type: "string" },
    origin: { default: "https://reptiles.ge", type: "string" },
    strict: { default: false, type: "boolean" },
    "wait-for-deploy": { default: "0", type: "string" },
  },
});

const ORIGIN = values.origin.replace(/\/$/, "");
const CONCURRENCY = Math.max(1, Number.parseInt(values.concurrency, 10) || 8);
const WAIT_SECONDS = Math.max(
  0,
  Number.parseInt(values["wait-for-deploy"], 10) || 0,
);
const BUILD_HEADER = "x-vinext-build-id";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY_PATH = "/indexnow.txt";
const INDEXNOW_MAX_URLS = 10_000;
const INDEXNOW_RETRIES = 4;
const INDEXNOW_MAX_DELAY_MS = 60_000;
const CACHE_HEADER = "x-vinext-cache";
const MAINTENANCE_HEADER = "x-reptiles-maintenance";
const POLL_INTERVAL_MS = 10_000;
const REQUEST_TIMEOUT_MS = 30_000;
const RETRIES = 2;
const RSC_CACHE_PARAM = "_rsc";
const SLOWEST_REPORTED = 5;
const USER_AGENT = "reptiles-cache-warmer";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(url, rsc = false) {
  return fetch(url, {
    headers: rsc
      ? { rsc: "1", "user-agent": USER_AGENT }
      : { "user-agent": USER_AGENT },
    redirect: "manual",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function readBuildId() {
  try {
    const response = await get(`${ORIGIN}/`);
    await response.arrayBuffer();
    return response.headers.get(BUILD_HEADER);
  } catch {
    return null;
  }
}

async function waitForDeploy() {
  const initial = await readBuildId();
  const deadline = Date.now() + WAIT_SECONDS * 1000;
  console.log(`waiting up to ${WAIT_SECONDS}s for a build after ${initial}`);

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const current = await readBuildId();
    if (current && current !== initial) {
      console.log(`new build is live: ${current}`);
      return;
    }
  }

  console.log("no new build appeared, warming the current one");
}

async function readSitemap() {
  const response = await get(`${ORIGIN}/sitemap.xml`);
  if (response.headers.has(MAINTENANCE_HEADER)) return null;
  if (!response.ok) throw new Error(`sitemap responded ${response.status}`);

  const xml = await response.text();
  const entries = new Map();
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = match[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    const url = new URL(loc.trim().replaceAll("&amp;", "&"));
    const lastmod = match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    entries.set(`${ORIGIN}${url.pathname}${url.search}`, lastmod?.trim());
  }
  return entries;
}

async function readIndexNowState(path) {
  try {
    return new Map(Object.entries(JSON.parse(await readFile(path, "utf8"))));
  } catch {
    return new Map();
  }
}

function changedUrls(before, after) {
  const changed = [];
  for (const [url, lastmod] of after) {
    if (!before.has(url) || before.get(url) !== lastmod) changed.push(url);
  }
  for (const url of before.keys()) {
    if (!after.has(url)) changed.push(url);
  }
  return changed;
}

function retryDelay(response, attempt) {
  const retryAfter = Number.parseInt(
    response?.headers.get("retry-after") ?? "",
    10,
  );
  const ms = Number.isNaN(retryAfter) ? 2000 * 2 ** attempt : retryAfter * 1000;
  return Math.min(ms, INDEXNOW_MAX_DELAY_MS);
}

async function postIndexNow(body) {
  let status = "failed";

  for (let attempt = 0; attempt <= INDEXNOW_RETRIES; attempt += 1) {
    let response = null;
    try {
      response = await fetch(INDEXNOW_ENDPOINT, {
        body,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "user-agent": USER_AGENT,
        },
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await response.arrayBuffer();
      if (response.ok) return { ok: true, status: String(response.status) };
      status = String(response.status);
      if (response.status !== 429 && response.status < 500) break;
    } catch (error) {
      status = error instanceof Error ? error.name : "failed";
    }
    if (attempt < INDEXNOW_RETRIES) await sleep(retryDelay(response, attempt));
  }

  return { ok: false, status };
}

async function submitToIndexNow(urls) {
  const unsent = new Set();
  if (urls.length === 0) {
    console.log("indexnow: no changed urls");
    return unsent;
  }

  const keyResponse = await get(`${ORIGIN}${INDEXNOW_KEY_PATH}`);
  if (!keyResponse.ok) {
    console.log(`indexnow: key file responded ${keyResponse.status}`);
    return new Set(urls);
  }
  const key = (await keyResponse.text()).trim();
  const host = new URL(ORIGIN).host;

  for (let start = 0; start < urls.length; start += INDEXNOW_MAX_URLS) {
    const urlList = urls.slice(start, start + INDEXNOW_MAX_URLS);
    const result = await postIndexNow(
      JSON.stringify({
        host,
        key,
        keyLocation: `${ORIGIN}${INDEXNOW_KEY_PATH}`,
        urlList,
      }),
    );
    console.log(`indexnow: ${urlList.length} urls, ${result.status}`);
    if (!result.ok) for (const url of urlList) unsent.add(url);
  }
  for (const url of urls) {
    console.log(`  indexnow ${unsent.has(url) ? "unsent" : "sent"} ${url}`);
  }
  return unsent;
}

async function syncIndexNow(path, sitemap) {
  const before = await readIndexNowState(path);
  const unsent = await submitToIndexNow(changedUrls(before, sitemap));

  const state = new Map(sitemap);
  for (const url of unsent) {
    if (before.has(url)) state.set(url, before.get(url));
    else state.delete(url);
  }
  await writeFile(path, `${JSON.stringify(Object.fromEntries(state))}\n`);
  return unsent.size > 0 ? 1 : 0;
}

function rscUrl(url) {
  return `${url}${url.includes("?") ? "&" : "?"}${RSC_CACHE_PARAM}`;
}

async function warm({ kind, url }) {
  let failure = "failed";

  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const started = performance.now();
    try {
      const response = await get(url, kind === "rsc");
      await response.arrayBuffer();
      if (response.status < 500) {
        return {
          kind,
          ms: performance.now() - started,
          state:
            response.status === 200
              ? (response.headers.get(CACHE_HEADER) ?? "UNCACHED")
              : String(response.status),
          url,
        };
      }
      failure = String(response.status);
    } catch (error) {
      failure = error instanceof Error ? error.name : "failed";
    }
    await sleep(500 * (attempt + 1));
  }

  return { failed: true, kind, ms: 0, state: failure, url };
}

async function warmAll(targets) {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < targets.length) {
      const target = targets[next];
      next += 1;
      results.push(await warm(target));
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

function summarize(results, kind) {
  const counts = {};
  for (const result of results) {
    if (result.kind !== kind) continue;
    counts[result.state] = (counts[result.state] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, count]) => `${state} ${count}`)
    .join(", ");
}

function report(results, seconds) {
  console.log(`${results.length} requests in ${seconds.toFixed(1)}s`);
  console.log(`  html: ${summarize(results, "html")}`);
  console.log(`  rsc: ${summarize(results, "rsc")}`);

  const slowest = results
    .toSorted((a, b) => b.ms - a.ms)
    .slice(0, SLOWEST_REPORTED);
  for (const result of slowest) {
    console.log(
      `  ${Math.round(result.ms)}ms ${result.kind} ${result.state} ${result.url}`,
    );
  }

  const failed = results.filter((result) => result.failed);
  for (const result of failed) {
    console.log(`  failed ${result.kind} ${result.state} ${result.url}`);
  }
  return failed.length;
}

async function main() {
  if (WAIT_SECONDS > 0) await waitForDeploy();

  const sitemap = await readSitemap();
  if (!sitemap) {
    console.log(`${ORIGIN} is under maintenance, nothing to warm`);
    return 0;
  }
  const urls = [...sitemap.keys()];
  console.log(`warming ${urls.length} urls on ${ORIGIN}`);

  const started = performance.now();
  const results = await warmAll([
    ...urls.map((url) => ({ kind: "html", url })),
    ...urls.map((url) => ({ kind: "rsc", url: rscUrl(url) })),
  ]);
  const failed = report(results, (performance.now() - started) / 1000);

  const statePath = values["indexnow-state"];
  if (!statePath) return failed;
  return failed + (await syncIndexNow(statePath, sitemap));
}

try {
  const failed = await main();
  if (failed > 0 && values.strict) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (values.strict) process.exitCode = 1;
}
