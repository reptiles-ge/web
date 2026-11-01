import { setTimeout } from "node:timers/promises";
import { parseArgs } from "node:util";

import {
  metadataPlacementProblems,
  type MetadataPlacementProblem,
} from "../src/lib/metadataPlacement";
import { mapPool } from "./scriptUtils";

const { values } = parseArgs({
  options: {
    all: { default: false, type: "boolean" },
    concurrency: { default: "4", type: "string" },
    origin: { default: "http://127.0.0.1:8799", type: "string" },
  },
});

const ORIGIN = values.origin.replace(/\/$/, "");
const CONCURRENCY = Math.max(1, Number.parseInt(values.concurrency, 10) || 4);
const LOCALES = ["en", "ru", "tr"];
const CACHE_ADMISSION_MS = 1_500;
const REQUEST_TIMEOUT_MS = 60_000;

const USER_AGENTS: Record<string, string> = {
  bingbot:
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "cache-warmer": "reptiles-cache-warmer",
  chrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  empty: "",
  facebook: "facebookexternalhit/1.1",
  googlebot:
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "googlebot-smartphone":
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  gptbot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  "vinext-warmup": "vinext-cloudflare-cdn-warm",
};

const AGENT_NAMES = Object.keys(USER_AGENTS);

type Check = {
  agent: string;
  cache: string;
  cacheControl: string;
  problems: MetadataPlacementProblem[];
  status: number;
  url: string;
};

async function sitemapUrls(): Promise<string[]> {
  const response = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!response.ok) throw new Error(`sitemap responded ${response.status}`);
  const xml = await response.text();
  const urls = new Set<string>();
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1].trim().replaceAll("&amp;", "&"));
    urls.add(`${ORIGIN}${url.pathname}${url.search}`);
  }
  return [...urls];
}

function sectionKey(url: string): string {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  const locale = LOCALES.includes(segments[0] ?? "") ? segments.shift() : "ka";
  const kind =
    segments[1] === "page" ? "page" : segments.length > 1 ? "leaf" : "hub";
  return `${locale}:${segments[0] ?? ""}:${kind}`;
}

function sample(urls: string[]): string[] {
  const picked = new Map<string, string>();
  for (const url of urls) {
    const key = sectionKey(url);
    if (!picked.has(key)) picked.set(key, url);
  }
  return [...picked.values()];
}

async function check(url: string, agent: string): Promise<Check> {
  const response = await fetch(url, {
    headers: { "user-agent": USER_AGENTS[agent] ?? "" },
    redirect: "manual",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const html = await response.text();
  return {
    agent,
    cache: response.headers.get("x-vinext-cache") ?? "NONE",
    cacheControl: response.headers.get("cache-control") ?? "",
    problems: response.status === 200 ? metadataPlacementProblems(html) : [],
    status: response.status,
    url,
  };
}

async function checkUrl(url: string, index: number): Promise<Check[]> {
  const firstAgent = AGENT_NAMES[index % AGENT_NAMES.length] ?? "chrome";
  const agents = values.all ? [firstAgent] : AGENT_NAMES;
  const first = await check(url, firstAgent);
  await setTimeout(CACHE_ADMISSION_MS);
  const rest = await Promise.all(agents.map((agent) => check(url, agent)));
  return [first, ...rest];
}

function uncacheable(checks: Check[]): string[] {
  const urls = new Set<string>();
  for (const item of checks) {
    if (item.status === 200 && /\bno-cache\b/.test(item.cacheControl)) {
      urls.add(item.url);
    }
  }
  return [...urls];
}

function report(checks: Check[]): number {
  const cacheStates = new Map<string, number>();
  const statuses = new Map<number, number>();
  for (const { cache, status } of checks) {
    cacheStates.set(cache, (cacheStates.get(cache) ?? 0) + 1);
    statuses.set(status, (statuses.get(status) ?? 0) + 1);
  }
  const failed = checks.filter((item) => item.problems.length > 0);

  console.log(`${checks.length} responses checked on ${ORIGIN}`);
  console.log(
    `  status: ${[...statuses].map(([k, v]) => `${k} ${v}`).join(", ")}`,
  );
  console.log(
    `  cache: ${[...cacheStates].map(([k, v]) => `${k} ${v}`).join(", ")}`,
  );
  for (const item of failed.slice(0, 50)) {
    const issues = Object.entries(
      Object.groupBy(item.problems, ({ issue }) => issue),
    ).map(
      ([issue, list]) => `${issue} ${list?.map(({ tag }) => tag).join(",")}`,
    );
    console.log(
      `  ${item.agent} ${item.cache} ${item.url}: ${issues.join("; ")}`,
    );
  }
  console.log(`${failed.length} responses with metadata outside <head>`);
  const dynamic = uncacheable(checks);
  for (const url of dynamic.slice(0, 50)) console.log(`  uncacheable ${url}`);
  console.log(`${dynamic.length} sitemap URLs answered as uncacheable`);
  return failed.length + dynamic.length;
}

const urls = await sitemapUrls();
const targets = values.all ? urls : sample(urls);
const checks = (await mapPool(targets, CONCURRENCY, checkUrl)).flat();
if (report(checks) > 0) process.exitCode = 1;
