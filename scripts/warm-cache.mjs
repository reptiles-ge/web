#!/usr/bin/env node

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    concurrency: { default: "8", type: "string" },
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
const CACHE_HEADER = "x-vinext-cache";
const POLL_INTERVAL_MS = 10_000;
const REQUEST_TIMEOUT_MS = 30_000;
const RETRIES = 2;
const SLOWEST_REPORTED = 5;
const USER_AGENT = "reptiles-cache-warmer";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(url) {
  return fetch(url, {
    headers: { "user-agent": USER_AGENT },
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
  if (!response.ok) throw new Error(`sitemap responded ${response.status}`);

  const xml = await response.text();
  const urls = new Set();
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1].trim().replaceAll("&amp;", "&"));
    urls.add(`${ORIGIN}${url.pathname}${url.search}`);
  }
  return [...urls];
}

async function warm(url) {
  let failure = "failed";

  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const started = performance.now();
    try {
      const response = await get(url);
      await response.arrayBuffer();
      if (response.status < 500) {
        return {
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

  return { failed: true, ms: 0, state: failure, url };
}

async function warmAll(urls) {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < urls.length) {
      const url = urls[next];
      next += 1;
      results.push(await warm(url));
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

function report(results, seconds) {
  const counts = {};
  for (const result of results) {
    counts[result.state] = (counts[result.state] ?? 0) + 1;
  }
  const summary = Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, count]) => `${state} ${count}`)
    .join(", ");
  console.log(`${results.length} urls in ${seconds.toFixed(1)}s: ${summary}`);

  const slowest = results
    .toSorted((a, b) => b.ms - a.ms)
    .slice(0, SLOWEST_REPORTED);
  for (const result of slowest) {
    console.log(`  ${Math.round(result.ms)}ms ${result.state} ${result.url}`);
  }

  const failed = results.filter((result) => result.failed);
  for (const result of failed) {
    console.log(`  failed ${result.state} ${result.url}`);
  }
  return failed.length;
}

async function main() {
  if (WAIT_SECONDS > 0) await waitForDeploy();

  const urls = await readSitemap();
  console.log(`warming ${urls.length} urls on ${ORIGIN}`);

  const started = performance.now();
  const results = await warmAll(urls);
  return report(results, (performance.now() - started) / 1000);
}

try {
  const failed = await main();
  if (failed > 0 && values.strict) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (values.strict) process.exitCode = 1;
}
