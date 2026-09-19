import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { getPublishedCreditAuthors } from "../src/data/creditAuthors";
import { getPublishedNewsArticles } from "../src/data/news";
import { regions } from "../src/data/regions";
import { getCatalogSpecies } from "../src/data/species";
import { getSpeciesAtlasMeta, type AnimalGroup } from "../src/data/speciesAtlas";
import { localizeSpecies } from "../src/i18n/localizeSpecies";
import { type AppLocale, routing } from "../src/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "../src/lib/clusterGuides";
import { creditAuthorUrl } from "../src/lib/creditAuthors";
import { GROUP_HUB_LIST } from "../src/lib/groupHubs";
import { buildRobotsTxt } from "../src/lib/llmsFiles";
import { newsArticleUrl } from "../src/lib/news";
import { liveQuizzes } from "../src/lib/quizzes";
import {
  localePath,
  quizPageUrl,
  speciesPageUrl,
} from "../src/lib/site";
import { regionHref } from "../src/lib/speciesRoutes";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://reptiles.ge";

type Args = {
  command: string;
  flags: Record<string, string | true>;
};

type CacheOptions<T> = {
  fetcher: () => Promise<T>;
  key: string;
  ttlMs: number;
};

type DataFreshness = "INFERRED" | "OBSERVED" | "SYNTHETIC" | "UNKNOWN";

type DateWindow = {
  endDate: string;
  previousEndDate: string;
  previousStartDate: string;
  startDate: string;
};

type Evidence = {
  label: string;
  source: DataFreshness;
  value: string;
};

type Ga4Row = {
  activeUsers: number;
  averageSessionDuration: number;
  channelGroup: string;
  date: string;
  engagedSessions: number;
  landingPage: string;
  screenPageViews: number;
  sessions: number;
  sourceMedium: string;
};

type GoogleServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

type GscAggregate = {
  clicks: number;
  country: string;
  ctr: number;
  device: string;
  impressions: number;
  page: string;
  position: number;
  query: string;
};

type GscRow = GscAggregate & {
  date: string;
};

type InventoryItem = {
  alternates: Record<string, string>;
  canonicalUrl: string;
  description: null | string;
  group: AnimalGroup | null;
  h1: null | string;
  id: null | string;
  inSitemap: boolean;
  indexable: boolean;
  internalLinksIn: null | number;
  internalLinksOut: null | number;
  lastModified: null | string;
  locale: AppLocale;
  pageType: PageType;
  path: string;
  schemaTypes: string[];
  title: null | string;
  url: string;
};

type Opportunity = {
  autoFixable: boolean;
  confidence: number;
  currentMetrics?: {
    clicks?: number;
    ctr?: number;
    impressions?: number;
    position?: number;
    sessions?: number;
  };
  evidence: Evidence[];
  geoImpact: "HIGH" | "LOW" | "MEDIUM" | "UNKNOWN";
  humanReviewRequired: boolean;
  id: string;
  locale: AppLocale | "unknown";
  pageType: PageType | "unknown";
  priority: "CRITICAL" | "HIGH" | "IGNORE" | "LOW" | "MEDIUM";
  problemType:
    | "AI_CITATION_GAP"
    | "CANNIBALIZATION"
    | "CONTENT_GAP"
    | "CTR"
    | "FRESHNESS"
    | "HUMAN_REVIEW"
    | "INTERNAL_LINKING"
    | "MISSING_PAGE"
    | "QUERY_MISMATCH"
    | "TECHNICAL"
    | "WEAK_STRUCTURE";
  queryOrTopic: string;
  recommendedAction: string;
  seoImpact: "HIGH" | "LOW" | "MEDIUM" | "UNKNOWN";
  source: "GA4" | "GSC" | "REPOSITORY" | "SERP" | "SYNTHETIC";
  supportingUrls: string[];
  timestamp: string;
  trend?: "DECLINING" | "GROWING" | "STABLE" | "UNKNOWN";
  url: string;
};

type PageType =
  | "amphibian profile"
  | "author"
  | "bird profile"
  | "guide"
  | "home"
  | "hub/index"
  | "insect profile"
  | "legal"
  | "lizard profile"
  | "mammal profile"
  | "news"
  | "other species profile"
  | "quiz"
  | "region page"
  | "scorpion profile"
  | "snake profile"
  | "spider profile"
  | "turtle profile"
  | "unknown"
  | "utility";

type Report = {
  dataLimitations: string[];
  generatedAt: string;
  inventory: InventoryItem[];
  opportunities: Opportunity[];
  summary: {
    ga4Rows: number;
    gscRows: number;
    inventoryPages: number;
    opportunities: number;
    technicalIssues: number;
  };
  technicalIssues: Opportunity[];
};

type SeoGraph = {
  defaultLocale: AppLocale;
  generatedAt: string;
  locales: AppLocale[];
  productionOrigin: string;
  routes: SeoGraphRoute[];
};

type SeoGraphRoute = {
  allowOrphan?: boolean;
  alternates: Record<string, string>;
  canonicalUrl: string;
  inSitemap?: boolean;
  locale: AppLocale;
  path: string;
  type: string;
};

class MissingInput extends Error {
  constructor(message: string) {
    super(message);
  }
}

const AI_REFERRERS = [
  "chatgpt",
  "openai",
  "perplexity",
  "claude",
  "anthropic",
  "gemini",
  "copilot",
  "bing/chat",
];

const cacheRoot = path.join(process.cwd(), ".seo/cache");
const reportRoot = path.join(process.cwd(), ".seo/reports");

async function main() {
  await loadDotEnv();
  const args = parseArgs(process.argv.slice(2));

  if (args.command === "selfcheck") {
    await selfcheck();
    return;
  }

  if (args.command === "gsc") {
    const window = dateWindow(Number(args.flags.days) || 28);
    const data = await collectGscComparison(
      window,
      String(args.flags.country ?? "geo"),
    );
    await writeJsonReport("gsc-raw", { generatedAt: now(), ...data, window });
    console.log(
      `Collected ${data.current.length} current and ${data.previous.length} previous Search Console rows`,
    );
    return;
  }

  if (args.command === "ga4") {
    const window = dateWindow(Number(args.flags.days) || 28);
    const rows = await collectGa4(window);
    await writeJsonReport("ga4-raw", { generatedAt: now(), rows, window });
    console.log(`Collected ${rows.length} GA4 rows`);
    return;
  }

  if (args.command === "serp") {
    const query = String(args.flags.query ?? "");
    if (!query) throw new Error("Use --query=\"...\" for SERP collection");
    const result = await collectSerp(query);
    await writeJsonReport("serp-raw", { generatedAt: now(), result });
    console.log(`Collected SERP data for "${query}"`);
    return;
  }

  const graph = await readSeoGraph();
  const inventory = buildInventory(graph);
  const technicalIssues = buildTechnicalIssues(graph, inventory);
  const gscData =
    args.command === "technical"
      ? { current: [], previous: [] }
      : await maybeCollectGscComparison(dateWindow(Number(args.flags.days) || 28));
  const ga4Rows =
    args.command === "technical"
      ? []
      : await maybeCollectGa4(dateWindow(Number(args.flags.days) || 28));
  const opportunities =
    args.command === "technical"
      ? technicalIssues
      : [
          ...technicalIssues,
          ...buildGscOpportunities(gscData.current, inventory, gscData.previous),
          ...buildGa4Opportunities(ga4Rows, inventory),
          ...buildGeoOpportunities(gscData.current, inventory),
        ];

  const filtered = filterReportOpportunities(opportunities, args);
  const report: Report = {
    dataLimitations: dataLimitations(gscData.current, ga4Rows),
    generatedAt: now(),
    inventory,
    opportunities: filtered,
    summary: {
      ga4Rows: ga4Rows.length,
      gscRows: gscData.current.length,
      inventoryPages: inventory.length,
      opportunities: filtered.length,
      technicalIssues: technicalIssues.length,
    },
    technicalIssues,
  };

  await writeJsonReport(`reptiles-seo-${args.command}`, report);
  await writeMarkdownReport(`reptiles-seo-${args.command}`, report);

  console.log(
    `Wrote ${filtered.length} opportunities for ${inventory.length} inventory pages`,
  );
}

function aggregateGscRows(rows: GscRow[]) {
  const buckets = new Map<string, GscAggregate>();
  for (const row of rows) {
    const key = [row.query, row.page, row.country, row.device].join("\t");
    const existing = buckets.get(key);
    if (!existing) {
      buckets.set(key, { ...row });
      continue;
    }
    const impressions = existing.impressions + row.impressions;
    existing.position =
      impressions === 0
        ? 0
        : (existing.position * existing.impressions +
            row.position * row.impressions) /
          impressions;
    existing.clicks += row.clicks;
    existing.impressions = impressions;
    existing.ctr = impressions === 0 ? 0 : existing.clicks / impressions;
  }
  return [...buckets.values()];
}

function buildGa4Opportunities(rows: Ga4Row[], inventory: InventoryItem[]) {
  const inventoryByPath = mapInventoryByPath(inventory);
  const aiRows = rows.filter((row) =>
    AI_REFERRERS.some((needle) =>
      row.sourceMedium.toLowerCase().includes(needle),
    ),
  );
  const buckets = new Map<string, Ga4Row>();
  for (const row of aiRows) {
    const existing = buckets.get(row.landingPage);
    if (!existing) {
      buckets.set(row.landingPage, { ...row });
      continue;
    }
    existing.sessions += row.sessions;
    existing.activeUsers += row.activeUsers;
    existing.engagedSessions += row.engagedSessions;
    existing.screenPageViews += row.screenPageViews;
  }
  return [...buckets.values()].map((row, index): Opportunity => {
    const path = normalizePath(row.landingPage || "/");
    const page = inventoryByPath.get(path);
    return {
      autoFixable: false,
      confidence: 0.7,
      currentMetrics: { sessions: row.sessions },
      evidence: [
        {
          label: "AI referral source/medium",
          source: "OBSERVED",
          value: row.sourceMedium,
        },
        {
          label: "sessions",
          source: "OBSERVED",
          value: String(row.sessions),
        },
      ],
      geoImpact: "MEDIUM",
      humanReviewRequired: true,
      id: stableId("ga4-ai", row.landingPage, String(index)),
      locale: page?.locale ?? localeFromPath(path),
      pageType: page?.pageType ?? "unknown",
      priority: row.sessions >= 10 ? "MEDIUM" : "LOW",
      problemType: "AI_CITATION_GAP",
      queryOrTopic: "AI assistant referral visibility",
      recommendedAction:
        "Review this landing page for extractable answers, visible sources, and clear entity naming; GA4 shows at least one AI-assistant referral path.",
      seoImpact: "LOW",
      source: "GA4",
      supportingUrls: page ? [page.url] : [],
      timestamp: now(),
      trend: "UNKNOWN",
      url: page?.url ?? absoluteFromPath(path),
    };
  });
}

function buildGeoOpportunities(rows: GscRow[], inventory: InventoryItem[]) {
  const observed = aggregateGscRows(rows)
    .filter((row) => localeFromUrl(row.page) === "ka")
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25)
    .map((row): Opportunity => {
      const page = inventory.find((item) => item.url === normalizeUrl(row.page));
      return {
        autoFixable: false,
        confidence: 0.68,
        currentMetrics: {
          clicks: row.clicks,
          ctr: row.ctr,
          impressions: row.impressions,
          position: row.position,
        },
        evidence: [
          {
            label: "query source",
            source: "OBSERVED",
            value: "Google Search Console",
          },
          {
            label: "impressions",
            source: "OBSERVED",
            value: String(row.impressions),
          },
        ],
        geoImpact: "MEDIUM",
        humanReviewRequired: true,
        id: stableId("geo-observed", row.query, row.page),
        locale: "ka",
        pageType: page?.pageType ?? "unknown",
        priority: row.impressions >= percentile(rows.map((item) => item.impressions), 0.8)
          ? "MEDIUM"
          : "LOW",
        problemType: "AI_CITATION_GAP",
        queryOrTopic: row.query,
        recommendedAction:
          "Check whether the page gives a direct, source-backed Georgian answer that can stand alone in an AI answer. Keep any biological claims tied to existing site sources.",
        seoImpact: "MEDIUM",
        source: "GSC",
        supportingUrls: [row.page],
        timestamp: now(),
        trend: "UNKNOWN",
        url: row.page,
      };
    });

  const synthetic = syntheticGeoQueries(inventory).slice(0, 40);
  return [...observed, ...synthetic];
}

function buildGscOpportunities(
  rows: GscRow[],
  inventory: InventoryItem[],
  previousRows: GscRow[] = [],
) {
  if (rows.length === 0) return [];
  const inventoryByUrl = new Map(inventory.map((item) => [item.url, item]));
  const current = aggregateGscRows(rows).filter(
    (row) => row.country.toLowerCase() === "geo",
  );
  const impressionFloor = Math.max(
    10,
    percentile(
      current.map((row) => row.impressions),
      0.6,
    ),
  );
  const ctrMedianByPosition = medianCtrByPosition(current);
  const opportunities: Opportunity[] = [];

  for (const row of current) {
    const locale = localeFromUrl(row.page);
    if (locale !== "ka") continue;
    if (row.impressions < impressionFloor) continue;
    const page = inventoryByUrl.get(normalizeUrl(row.page));
    const pageType = page?.pageType ?? "unknown";
    if (row.position >= 4 && row.position <= 20) {
      opportunities.push({
        autoFixable: false,
        confidence: row.impressions >= impressionFloor * 2 ? 0.78 : 0.66,
        currentMetrics: {
          clicks: row.clicks,
          ctr: row.ctr,
          impressions: row.impressions,
          position: row.position,
        },
        evidence: metricEvidence(row),
        geoImpact: "LOW",
        humanReviewRequired: true,
        id: stableId("gsc-striking", row.query, row.page),
        locale,
        pageType,
        priority: row.impressions >= impressionFloor * 2 ? "HIGH" : "MEDIUM",
        problemType: "CONTENT_GAP",
        queryOrTopic: row.query,
        recommendedAction:
          "Inspect the ranking page against the observed Georgian query and improve the existing answer only where site sources support it.",
        seoImpact: "HIGH",
        source: "GSC",
        supportingUrls: [row.page],
        timestamp: now(),
        trend: "UNKNOWN",
        url: row.page,
      });
    }

    const medianCtr = ctrMedianByPosition.get(positionBucket(row.position));
    if (medianCtr && row.position <= 10 && row.ctr < medianCtr * 0.6) {
      opportunities.push({
        autoFixable: false,
        confidence: 0.7,
        currentMetrics: {
          clicks: row.clicks,
          ctr: row.ctr,
          impressions: row.impressions,
          position: row.position,
        },
        evidence: [
          ...metricEvidence(row),
          {
            label: "dataset median CTR for position band",
            source: "OBSERVED",
            value: formatPercent(medianCtr),
          },
        ],
        geoImpact: "LOW",
        humanReviewRequired: true,
        id: stableId("gsc-ctr", row.query, row.page),
        locale,
        pageType,
        priority: row.impressions >= impressionFloor * 2 ? "HIGH" : "MEDIUM",
        problemType: "CTR",
        queryOrTopic: row.query,
        recommendedAction:
          "Review the title, meta description, and visible lead for this observed query. Do not rewrite toward a clickbait promise.",
        seoImpact: "MEDIUM",
        source: "GSC",
        supportingUrls: [row.page],
        timestamp: now(),
        trend: "UNKNOWN",
        url: row.page,
      });
    }
  }

  opportunities.push(...cannibalizationOpportunities(current, inventoryByUrl));
  opportunities.push(...internalLinkOpportunities(current, inventory));
  opportunities.push(...trendOpportunities(current, previousRows, inventoryByUrl));
  return opportunities;
}

function buildInventory(graph: SeoGraph): InventoryItem[] {
  const speciesItems = speciesInventory();
  const byUrl = new Map(speciesItems.map((item) => [item.url, item]));
  for (const item of hubInventory()) byUrl.set(item.url, item);
  for (const item of guideInventory()) byUrl.set(item.url, item);
  for (const item of newsInventory()) byUrl.set(item.url, item);
  for (const item of authorInventory()) byUrl.set(item.url, item);
  for (const item of regionInventory()) byUrl.set(item.url, item);
  for (const item of quizInventory()) byUrl.set(item.url, item);

  return graph.routes.map((route) => {
    const url = normalizeUrl(route.canonicalUrl);
    const known = byUrl.get(url);
    if (known) {
      return {
        ...known,
        alternates: route.alternates,
        canonicalUrl: route.canonicalUrl,
        inSitemap: route.inSitemap ?? true,
        indexable: route.inSitemap ?? true,
        path: normalizePath(route.path),
      };
    }
    return {
      alternates: route.alternates,
      canonicalUrl: route.canonicalUrl,
      description: null,
      group: null,
      h1: null,
      id: null,
      inSitemap: route.inSitemap ?? true,
      indexable: route.inSitemap ?? true,
      internalLinksIn: null,
      internalLinksOut: null,
      lastModified: null,
      locale: route.locale,
      pageType: pageTypeFromRoute(route.type),
      path: normalizePath(route.path),
      schemaTypes: schemaTypesFromRoute(route.type),
      title: null,
      url,
    };
  });
}

function buildTechnicalIssues(graph: SeoGraph, inventory: InventoryItem[]) {
  const issues: Opportunity[] = [];
  const routeByUrl = new Map(graph.routes.map((route) => [route.canonicalUrl, route]));
  const titleBuckets = bucketInventory(inventory, (item) => item.title);
  const descriptionBuckets = bucketInventory(inventory, (item) => item.description);
  const robots = buildRobotsTxt();

  if (!robots.includes("Sitemap: https://reptiles.ge/sitemap.xml")) {
    issues.push(technicalIssue("robots-sitemap", "https://reptiles.ge/robots.txt", "Robots.txt should reference the production sitemap.", "HIGH"));
  }

  if (/Disallow:\s*\/\s*$/m.test(robots)) {
    issues.push(technicalIssue("robots-block", "https://reptiles.ge/robots.txt", "Robots.txt appears to block the full site.", "CRITICAL"));
  }

  for (const item of inventory) {
    const route = routeByUrl.get(item.canonicalUrl);
    if (!route) continue;
    const localeAlternate = route.alternates[item.locale];
    const kaAlternate = route.alternates.ka;
    if (!localeAlternate) {
      issues.push(technicalIssue("hreflang-self", item.url, "Missing self-referencing hreflang alternate.", "HIGH"));
    }
    if (route.alternates["x-default"] !== kaAlternate) {
      issues.push(technicalIssue("hreflang-x-default", item.url, "x-default should point at the Georgian canonical URL.", "HIGH"));
    }
    if (!Object.values(route.alternates).includes(route.canonicalUrl)) {
      issues.push(technicalIssue("canonical-hreflang", item.url, "Canonical URL is not present in its hreflang set.", "HIGH"));
    }
    if (item.locale === "ka" && item.path.startsWith("/ka")) {
      issues.push(technicalIssue("ka-prefix", item.url, "Default Georgian locale should not use a /ka prefix.", "HIGH"));
    }
    if (item.indexable && !item.inSitemap) {
      issues.push(technicalIssue("sitemap-indexable", item.url, "Indexable page is missing from the sitemap graph.", "MEDIUM"));
    }
  }

  for (const [title, items] of titleBuckets) {
    if (items.length <= 1 || !title) continue;
    issues.push(technicalIssue("duplicate-title", items[0].url, `Duplicate title across ${items.length} inventory pages: ${title}`, "MEDIUM", items.map((item) => item.url)));
  }

  for (const [description, items] of descriptionBuckets) {
    if (items.length <= 1 || !description) continue;
    issues.push(technicalIssue("duplicate-description", items[0].url, `Duplicate description across ${items.length} inventory pages.`, "LOW", items.map((item) => item.url)));
  }

  return issues;
}

async function cachedJson<T>({ fetcher, key, ttlMs }: CacheOptions<T>) {
  const file = path.join(cacheRoot, `${safeFileName(key)}.json`);
  try {
    const stat = await fs.stat(file);
    if (Date.now() - stat.mtimeMs < ttlMs) {
      return JSON.parse(await fs.readFile(file, "utf8")) as T;
    }
  } catch {}
  const value = await fetcher();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return value;
}

function cannibalizationOpportunities(
  rows: GscAggregate[],
  inventoryByUrl: Map<string, InventoryItem>,
) {
  const byQuery = new Map<string, GscAggregate[]>();
  for (const row of rows) {
    if (row.impressions < 5) continue;
    const key = row.query.trim().toLowerCase();
    byQuery.set(key, [...(byQuery.get(key) ?? []), row]);
  }
  const opportunities: Opportunity[] = [];
  for (const [query, group] of byQuery) {
    const urls = [...new Set(group.map((row) => row.page))];
    if (urls.length < 2) continue;
    const totalImpressions = group.reduce((sum, row) => sum + row.impressions, 0);
    if (totalImpressions < 20) continue;
    const top = group.sort((a, b) => b.impressions - a.impressions)[0];
    const page = inventoryByUrl.get(normalizeUrl(top.page));
    opportunities.push({
      autoFixable: false,
      confidence: 0.64,
      currentMetrics: { impressions: totalImpressions },
      evidence: [
        {
          label: "competing URLs",
          source: "OBSERVED",
          value: urls.join(", "),
        },
        {
          label: "combined impressions",
          source: "OBSERVED",
          value: String(totalImpressions),
        },
      ],
      geoImpact: "LOW",
      humanReviewRequired: true,
      id: stableId("gsc-cannibalization", query, urls.join("|")),
      locale: "ka",
      pageType: page?.pageType ?? "unknown",
      priority: totalImpressions >= 100 ? "MEDIUM" : "LOW",
      problemType: "CANNIBALIZATION",
      queryOrTopic: query,
      recommendedAction:
        "Review whether these URLs serve distinct Georgian intents. If they do, leave them separate; if not, clarify titles, intros, and internal links.",
      seoImpact: "MEDIUM",
      source: "GSC",
      supportingUrls: urls,
      timestamp: now(),
      trend: "UNKNOWN",
      url: top.page,
    });
  }
  return opportunities;
}

async function collectGa4(window: DateWindow) {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    throw new MissingInput(
      "I need one thing from you: the GA4 property ID for reptiles.ge. Find it in Google Analytics Admin > Property details; it is not a secret. Add it as GA4_PROPERTY_ID in .env, while keeping the service-account JSON in GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_JSON.",
    );
  }
  const token = await googleAccessToken(["https://www.googleapis.com/auth/analytics.readonly"]);
  const body = {
    dateRanges: [{ endDate: window.endDate, startDate: window.startDate }],
    dimensions: [
      { name: "landingPagePlusQueryString" },
      { name: "date" },
      { name: "sessionDefaultChannelGroup" },
      { name: "sessionSourceMedium" },
    ],
    limit: 250000,
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "screenPageViews" },
    ],
  };
  return cachedJson<Ga4Row[]>({
    fetcher: async () => {
      const response = await postJson<{
        rows?: Array<{
          dimensionValues: Array<{ value: string }>;
          metricValues: Array<{ value: string }>;
        }>;
      }>(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        body,
        { Authorization: `Bearer ${token}` },
      );
      return (response.rows ?? []).map((row) => ({
        activeUsers: Number(row.metricValues[0]?.value ?? 0),
        averageSessionDuration: Number(row.metricValues[3]?.value ?? 0),
        channelGroup: row.dimensionValues[2]?.value ?? "",
        date: row.dimensionValues[1]?.value ?? "",
        engagedSessions: Number(row.metricValues[2]?.value ?? 0),
        landingPage: row.dimensionValues[0]?.value ?? "",
        screenPageViews: Number(row.metricValues[4]?.value ?? 0),
        sessions: Number(row.metricValues[1]?.value ?? 0),
        sourceMedium: row.dimensionValues[3]?.value ?? "",
      }));
    },
    key: `ga4-${hash(JSON.stringify({ body, propertyId }))}`,
    ttlMs: 12 * 60 * 60 * 1000,
  });
}

async function collectGscComparison(window: DateWindow, country = "geo") {
  const [current, previous] = await Promise.all([
    collectGscRows(window.startDate, window.endDate, country),
    collectGscRows(window.previousStartDate, window.previousEndDate, country),
  ]);
  return { current, previous };
}

async function collectGscRows(startDate: string, endDate: string, country = "geo") {
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) {
    throw new MissingInput(
      "I need one thing from you: the Google Search Console property string for reptiles.ge, usually https://reptiles.ge/ or sc-domain:reptiles.ge. Find it in Search Console's property selector; it is not a password. Add it as GSC_SITE_URL in .env.",
    );
  }
  const token = await googleAccessToken(["https://www.googleapis.com/auth/webmasters.readonly"]);
  const baseBody = {
    dataState: "final",
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: "country",
            expression: country,
            operator: "equals",
          },
        ],
        groupType: "and",
      },
    ],
    dimensions: ["query", "page", "country", "device", "date"],
    endDate,
    rowLimit: 25000,
    startDate,
  };
  return cachedJson<GscRow[]>({
    fetcher: async () => {
      const rows: GscRow[] = [];
      for (let startRow = 0; ; startRow += baseBody.rowLimit) {
        const body = { ...baseBody, startRow };
        const response = await postJson<{
          rows?: Array<{
            clicks: number;
            ctr: number;
            impressions: number;
            keys: string[];
            position: number;
          }>;
        }>(
          `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
          body,
          { Authorization: `Bearer ${token}` },
        );
        const page = response.rows ?? [];
        for (const row of page) {
          rows.push({
            clicks: row.clicks,
            country: row.keys[2] ?? "",
            ctr: row.ctr,
            date: row.keys[4] ?? "",
            device: row.keys[3] ?? "",
            impressions: row.impressions,
            page: normalizeUrl(row.keys[1] ?? ""),
            position: row.position,
            query: row.keys[0] ?? "",
          });
        }
        if (page.length < baseBody.rowLimit) break;
      }
      return rows;
    },
    key: `gsc-${hash(JSON.stringify({ baseBody, siteUrl }))}`,
    ttlMs: 12 * 60 * 60 * 1000,
  });
}

async function collectSerp(query: string) {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new MissingInput(
      "I need one thing from you: DataForSEO API credentials if you want reproducible Google/Bing SERP collection for Georgia + Georgian. Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD to .env; they are sensitive credentials.",
    );
  }
  const [locations, languages] = await Promise.all([
    dataForSeoGet<Array<{ country_iso_code?: string; location_code?: number; location_name?: string }>>("/v3/serp/google/locations"),
    dataForSeoGet<Array<{ language_code?: string; language_name?: string }>>("/v3/serp/google/languages"),
  ]);
  const location = locations.find(
    (item) =>
      item.country_iso_code === "GE" &&
      String(item.location_name ?? "").toLowerCase() === "georgia",
  );
  const language = languages.find(
    (item) =>
      item.language_code === "ka" ||
      String(item.language_name ?? "").toLowerCase() === "georgian",
  );
  if (!location?.location_code || !language?.language_code) {
    throw new Error("DataForSEO did not return a verified Georgia + Georgian configuration.");
  }
  const task = {
    depth: 20,
    keyword: query,
    language_code: language.language_code,
    location_code: location.location_code,
  };
  return cachedJson({
    fetcher: () =>
      dataForSeoPost("/v3/serp/google/organic/live/advanced", [task]),
    key: `serp-google-${hash(JSON.stringify(task))}`,
    ttlMs: 7 * 24 * 60 * 60 * 1000,
  });
}

async function dataForSeoGet<T>(apiPath: string) {
  return cachedJson<T>({
    fetcher: async () => {
      const response = await fetch(`https://api.dataforseo.com${apiPath}`, {
        headers: dataForSeoHeaders(),
      });
      if (!response.ok) throw new Error(await response.text());
      const json = (await response.json()) as { tasks?: Array<{ result?: T }> };
      const result = json.tasks?.[0]?.result;
      if (!result) throw new Error(`No DataForSEO result for ${apiPath}`);
      return result;
    },
    key: `dataforseo-${hash(apiPath)}`,
    ttlMs: 30 * 24 * 60 * 60 * 1000,
  });
}

async function dataForSeoPost<T>(apiPath: string, body: unknown) {
  const response = await fetch(`https://api.dataforseo.com${apiPath}`, {
    body: JSON.stringify(body),
    headers: {
      ...dataForSeoHeaders(),
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as T;
}

function dataForSeoHeaders() {
  const login = process.env.DATAFORSEO_LOGIN ?? "";
  const password = process.env.DATAFORSEO_PASSWORD ?? "";
  return {
    Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`,
  };
}

function dataLimitations(gscRows: GscRow[], ga4Rows: Ga4Row[]) {
  const limitations: string[] = [];
  if (gscRows.length === 0) {
    limitations.push("Search Console was not collected in this run; query opportunity findings are limited to repository-derived checks and synthetic GEO prompts.");
  }
  if (ga4Rows.length === 0) {
    limitations.push("GA4 was not collected in this run; organic/referral trend and AI-referral attribution findings are unavailable.");
  }
  limitations.push("Synthetic Georgian query expansions are hypotheses only until supported by GSC, SERP, or another observed source.");
  limitations.push("No traffic gains are estimated; impact is ranked HIGH/MEDIUM/LOW from evidence strength and page importance.");
  return limitations;
}

function dateWindow(days: number): DateWindow {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days + 1);
  const previousEnd = new Date(start);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(previousStart.getUTCDate() - days + 1);
  return {
    endDate: isoDate(end),
    previousEndDate: isoDate(previousEnd),
    previousStartDate: isoDate(previousStart),
    startDate: isoDate(start),
  };
}

function filterReportOpportunities(opportunities: Opportunity[], args: Args) {
  let filtered = opportunities;
  if (args.flags.url) {
    const needle = normalizeUrl(String(args.flags.url));
    filtered = filtered.filter(
      (item) => normalizeUrl(item.url) === needle || item.supportingUrls.some((url) => normalizeUrl(url) === needle),
    );
  }
  if (args.command === "geo") {
    filtered = filtered.filter((item) => item.problemType === "AI_CITATION_GAP");
  }
  if (args.command === "technical") {
    filtered = filtered.filter((item) => item.problemType === "TECHNICAL");
  }
  return filtered.sort(sortOpportunities);
}

function internalLinkOpportunities(rows: GscAggregate[], inventory: InventoryItem[]) {
  const species = inventory.filter((item) => item.pageType.endsWith("profile") && item.locale === "ka" && item.title);
  const opportunities: Opportunity[] = [];
  for (const row of rows) {
    if (row.impressions < 20) continue;
    const current = inventory.find((item) => item.url === normalizeUrl(row.page));
    if (!current || current.pageType.endsWith("profile")) continue;
    const query = row.query.toLowerCase();
    const target = species.find((item) => item.title && query.includes(item.title.toLowerCase()));
    if (!target) continue;
    opportunities.push({
      autoFixable: false,
      confidence: 0.72,
      currentMetrics: {
        clicks: row.clicks,
        impressions: row.impressions,
        position: row.position,
      },
      evidence: [
        {
          label: "observed query",
          source: "OBSERVED",
          value: row.query,
        },
        {
          label: "matching species page",
          source: "INFERRED",
          value: target.url,
        },
      ],
      geoImpact: "LOW",
      humanReviewRequired: true,
      id: stableId("internal-link", row.query, row.page, target.url),
      locale: "ka",
      pageType: current.pageType,
      priority: row.impressions >= 100 ? "MEDIUM" : "LOW",
      problemType: "INTERNAL_LINKING",
      queryOrTopic: row.query,
      recommendedAction:
        "Check whether a natural internal link from the observed landing page to the matching species profile helps the reader. Avoid keyword-stuffed anchors.",
      seoImpact: "MEDIUM",
      source: "GSC",
      supportingUrls: [row.page, target.url],
      timestamp: now(),
      trend: "UNKNOWN",
      url: row.page,
    });
  }
  return dedupeOpportunities(opportunities);
}

function trendOpportunities(
  currentRows: GscAggregate[],
  previousRows: GscRow[],
  inventoryByUrl: Map<string, InventoryItem>,
) {
  if (previousRows.length === 0) return [];
  const current = pageTotals(currentRows);
  const previous = pageTotals(aggregateGscRows(previousRows));
  const impressionFloor = Math.max(
    20,
    percentile(
      [...previous.values()].map((row) => row.impressions),
      0.6,
    ),
  );
  const opportunities: Opportunity[] = [];
  for (const [url, before] of previous) {
    if (before.impressions < impressionFloor) continue;
    const after = current.get(url) ?? { clicks: 0, impressions: 0 };
    const impressionDelta = after.impressions - before.impressions;
    const clickDelta = after.clicks - before.clicks;
    const ratio = before.impressions === 0 ? 0 : impressionDelta / before.impressions;
    if (Math.abs(ratio) < 0.3 && Math.abs(impressionDelta) < 50) continue;
    const page = inventoryByUrl.get(url);
    const declining = impressionDelta < 0;
    opportunities.push({
      autoFixable: false,
      confidence: Math.min(0.88, 0.55 + Math.abs(ratio)),
      currentMetrics: {
        clicks: after.clicks,
        impressions: after.impressions,
      },
      evidence: [
        {
          label: "previous impressions",
          source: "OBSERVED",
          value: String(before.impressions),
        },
        {
          label: "current impressions",
          source: "OBSERVED",
          value: String(after.impressions),
        },
        {
          label: "click delta",
          source: "OBSERVED",
          value: String(clickDelta),
        },
      ],
      geoImpact: "LOW",
      humanReviewRequired: true,
      id: stableId("gsc-trend", declining ? "down" : "up", url),
      locale: page?.locale ?? localeFromUrl(url),
      pageType: page?.pageType ?? "unknown",
      priority: declining ? "HIGH" : "MEDIUM",
      problemType: declining ? "FRESHNESS" : "CONTENT_GAP",
      queryOrTopic: declining ? "declining page" : "growing page",
      recommendedAction: declining
        ? "Compare current and previous GSC queries for this page, then check freshness, changed snippets, and lost internal context before editing content."
        : "Review the queries driving growth and strengthen the page or related internal links where the intent is already proven.",
      seoImpact: declining ? "HIGH" : "MEDIUM",
      source: "GSC",
      supportingUrls: [url],
      timestamp: now(),
      trend: declining ? "DECLINING" : "GROWING",
      url,
    });
  }
  return opportunities;
}

async function googleAccessToken(scopes: string[]) {
  const account = await loadServiceAccount();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const tokenUri = account.token_uri ?? "https://oauth2.googleapis.com/token";
  const assertion = [
    base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" })),
    base64Url(
      JSON.stringify({
        aud: tokenUri,
        exp: nowSeconds + 3600,
        iat: nowSeconds,
        iss: account.client_email,
        scope: scopes.join(" "),
      }),
    ),
  ].join(".");
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(assertion)
    .sign(account.private_key);
  const jwt = `${assertion}.${base64Url(signature)}`;
  const body = new URLSearchParams({
    assertion: jwt,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
  });
  const response = await fetch(tokenUri, {
    body,
    method: "POST",
  });
  if (!response.ok) throw new Error(await response.text());
  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Google OAuth did not return an access token.");
  return json.access_token;
}

function hubInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    GROUP_HUB_LIST.map((hub) => ({
      alternates: {},
      canonicalUrl: "",
      description: null,
      group: hub.group,
      h1: null,
      id: hub.id,
      inSitemap: true,
      indexable: true,
      internalLinksIn: null,
      internalLinksOut: null,
      lastModified: null,
      locale,
      pageType: "hub/index",
      path: localePath(locale, hub.path),
      schemaTypes: ["CollectionPage", "FAQPage", "BreadcrumbList"],
      title: hub.id,
      url: absoluteFromPath(localePath(locale, hub.path)),
    })),
  );
}

function guideInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    CLUSTER_GUIDE_LIST.map((guide) => ({
      alternates: {},
      canonicalUrl: "",
      description: null,
      group: GROUP_HUB_LIST.find((hub) => hub.id === guide.parentHub)?.group ?? null,
      h1: null,
      id: guide.id,
      inSitemap: true,
      indexable: true,
      internalLinksIn: null,
      internalLinksOut: null,
      lastModified: null,
      locale,
      pageType: "guide",
      path: localePath(locale, guide.pathname),
      schemaTypes: [
        guide.schema === "collection" ? "CollectionPage" : "WebPage",
        guide.emitFaqSchema === false ? "" : "FAQPage",
        "BreadcrumbList",
      ].filter(Boolean),
      title: guide.id,
      url: absoluteFromPath(localePath(locale, guide.pathname)),
    })),
  );
}

function newsInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    getPublishedNewsArticles(locale).map((article) => {
      const copy = article.copy[locale] ?? article.copy.ka;
      return {
        alternates: {},
        canonicalUrl: "",
        description: copy.dek,
        group: null,
        h1: copy.title,
        id: article.slug,
        inSitemap: true,
        indexable: true,
        internalLinksIn: null,
        internalLinksOut: null,
        lastModified: article.updatedAt ?? article.publishedAt,
        locale,
        pageType: "news",
        path: new URL(newsArticleUrl(locale, article.slug)).pathname,
        schemaTypes: ["NewsArticle", "BreadcrumbList"],
        title: copy.metaTitle ?? copy.title,
        url: normalizeUrl(newsArticleUrl(locale, article.slug)),
      } satisfies InventoryItem;
    }),
  );
}

function authorInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    getPublishedCreditAuthors().map((author) => {
      const name = author.name[locale] ?? author.name.ka;
      return {
        alternates: {},
        canonicalUrl: "",
        description: null,
        group: null,
        h1: name,
        id: author.slug,
        inSitemap: true,
        indexable: true,
        internalLinksIn: null,
        internalLinksOut: null,
        lastModified: null,
        locale,
        pageType: "author",
        path: new URL(creditAuthorUrl(locale, author.slug)).pathname,
        schemaTypes: ["ProfilePage", "BreadcrumbList"],
        title: name,
        url: normalizeUrl(creditAuthorUrl(locale, author.slug)),
      };
    }),
  );
}

function regionInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    regions.map((region) => {
      const name = region.name[locale] ?? region.name.ka;
      return {
        alternates: {},
        canonicalUrl: "",
        description: null,
        group: null,
        h1: name,
        id: region.id,
        inSitemap: true,
        indexable: true,
        internalLinksIn: null,
        internalLinksOut: null,
        lastModified: null,
        locale,
        pageType: "region page",
        path: localePath(locale, regionHref(region.id)),
        schemaTypes: ["CollectionPage", "BreadcrumbList"],
        title: name,
        url: absoluteFromPath(localePath(locale, regionHref(region.id))),
      };
    }),
  );
}

function quizInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    liveQuizzes().map((quiz) => ({
      alternates: {},
      canonicalUrl: "",
      description: null,
      group: null,
      h1: quiz.id,
      id: quiz.id,
      inSitemap: true,
      indexable: true,
      internalLinksIn: null,
      internalLinksOut: null,
      lastModified: null,
      locale,
      pageType: "quiz",
      path: new URL(quizPageUrl(locale, quiz.id)).pathname,
      schemaTypes: ["WebPage", "BreadcrumbList"],
      title: quiz.id,
      url: normalizeUrl(quizPageUrl(locale, quiz.id)),
    })),
  );
}

function speciesInventory(): InventoryItem[] {
  return routing.locales.flatMap((locale) =>
    getCatalogSpecies().map((raw) => {
      const item = localizeSpecies(raw, locale);
      const group = getSpeciesAtlasMeta(raw.id).group;
      const url = speciesPageUrl(locale, raw.id);
      return {
        alternates: {},
        canonicalUrl: "",
        description: item.description || item.overview || null,
        group,
        h1: item.commonName,
        id: raw.id,
        inSitemap: true,
        indexable: true,
        internalLinksIn: null,
        internalLinksOut: null,
        lastModified: raw.updatedAt,
        locale,
        pageType: speciesPageType(group),
        path: new URL(url).pathname,
        schemaTypes: [
          "Article",
          "Taxon",
          "BreadcrumbList",
          ...(item.faq?.length ? ["FAQPage"] : []),
        ],
        title: `${item.commonName} (${item.scientificName})`,
        url: normalizeUrl(url),
      };
    }),
  );
}

function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const file = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (raw) {
    return Promise.resolve(parseServiceAccount(raw));
  }
  if (file) {
    return fs.readFile(file, "utf8").then(parseServiceAccount);
  }
  throw new MissingInput(
    "I need one thing from you: a read-only Google service-account JSON key that has Viewer access to the GA4 property and restricted/read access to the Search Console property. Put the file path in GOOGLE_APPLICATION_CREDENTIALS or the JSON in GOOGLE_SERVICE_ACCOUNT_JSON in .env; it is sensitive and must not be committed.",
  );
}

function parseServiceAccount(raw: string): GoogleServiceAccount {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : Buffer.from(trimmed, "base64").toString("utf8");
  const parsed = JSON.parse(jsonText) as Partial<GoogleServiceAccount>;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("Google service-account JSON is missing client_email or private_key.");
  }
  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
    token_uri: parsed.token_uri,
  };
}

async function loadDotEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = await fs.readFile(path.join(process.cwd(), file), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const index = trimmed.indexOf("=");
        if (index === -1) continue;
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
        process.env[key] ??= value;
      }
    } catch {}
  }
}

function mapInventoryByPath(inventory: InventoryItem[]) {
  return new Map(inventory.map((item) => [item.path, item]));
}

function medianCtrByPosition(rows: GscAggregate[]) {
  const values = new Map<string, number[]>();
  for (const row of rows) {
    const bucket = positionBucket(row.position);
    values.set(bucket, [...(values.get(bucket) ?? []), row.ctr]);
  }
  return new Map([...values].map(([key, ctrs]) => [key, percentile(ctrs, 0.5)]));
}

function metricEvidence(row: GscAggregate): Evidence[] {
  return [
    { label: "clicks", source: "OBSERVED", value: String(row.clicks) },
    { label: "impressions", source: "OBSERVED", value: String(row.impressions) },
    { label: "CTR", source: "OBSERVED", value: formatPercent(row.ctr) },
    { label: "average position", source: "OBSERVED", value: row.position.toFixed(1) },
  ];
}

async function maybeCollectGa4(window: DateWindow) {
  try {
    if (!hasGoogleEnv() || !process.env.GA4_PROPERTY_ID) return [];
    return await collectGa4(window);
  } catch (error) {
    if (error instanceof MissingInput) return [];
    throw error;
  }
}

async function maybeCollectGscComparison(window: DateWindow) {
  try {
    if (!hasGoogleEnv() || !process.env.GSC_SITE_URL) {
      return { current: [], previous: [] };
    }
    return await collectGscComparison(window, "geo");
  } catch (error) {
    if (error instanceof MissingInput) return { current: [], previous: [] };
    throw error;
  }
}

function hasGoogleEnv() {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

function pageTypeFromRoute(routeType: string): PageType {
  if (routeType === "author") return "author";
  if (routeType === "guide") return "guide";
  if (routeType === "home") return "home";
  if (routeType === "hub") return "hub/index";
  if (routeType === "legal") return "legal";
  if (routeType === "news") return "news";
  if (routeType === "quiz") return "quiz";
  if (routeType === "region") return "region page";
  if (routeType === "species") return "other species profile";
  if (routeType === "static") return "utility";
  return "unknown";
}

function schemaTypesFromRoute(routeType: string) {
  if (routeType === "species") return ["Article", "Taxon", "BreadcrumbList"];
  if (routeType === "guide") return ["WebPage", "BreadcrumbList"];
  if (routeType === "hub" || routeType === "region") return ["CollectionPage", "BreadcrumbList"];
  if (routeType === "news") return ["NewsArticle", "BreadcrumbList"];
  if (routeType === "home") return ["WebSite", "Organization"];
  return ["WebPage"];
}

function speciesPageType(group: AnimalGroup): PageType {
  const map: Record<AnimalGroup, PageType> = {
    amphibian: "amphibian profile",
    bird: "bird profile",
    insect: "insect profile",
    lizard: "lizard profile",
    mammal: "mammal profile",
    scorpion: "scorpion profile",
    snake: "snake profile",
    spider: "spider profile",
    turtle: "turtle profile",
  };
  return map[group];
}

function positionBucket(position: number) {
  if (position <= 3) return "1-3";
  if (position <= 5) return "4-5";
  if (position <= 10) return "6-10";
  if (position <= 20) return "11-20";
  return "21+";
}

function pageTotals(rows: GscAggregate[]) {
  const totals = new Map<string, { clicks: number; impressions: number }>();
  for (const row of rows) {
    const url = normalizeUrl(row.page);
    const existing = totals.get(url) ?? { clicks: 0, impressions: 0 };
    existing.clicks += row.clicks;
    existing.impressions += row.impressions;
    totals.set(url, existing);
  }
  return totals;
}

async function postJson<T>(url: string, body: unknown, headers: Record<string, string>) {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as T;
}

function syntheticGeoQueries(inventory: InventoryItem[]) {
  const profiles = inventory
    .filter((item) => item.locale === "ka" && item.pageType.endsWith("profile") && item.title)
    .slice(0, 30);
  return profiles.flatMap((item) => {
    const name = item.h1 ?? item.title ?? "";
    const templates = [
      `${name} საქართველოში`,
      `${name} შხამიანია?`,
      `${name} სად გვხვდება?`,
    ];
    return templates.map((query): Opportunity => ({
      autoFixable: false,
      confidence: 0.42,
      evidence: [
        {
          label: "query source",
          source: "SYNTHETIC",
          value: "Generated from the reptiles.ge species inventory, not search volume.",
        },
      ],
      geoImpact: "UNKNOWN",
      humanReviewRequired: true,
      id: stableId("geo-synthetic", query, item.url),
      locale: "ka",
      pageType: item.pageType,
      priority: "LOW",
      problemType: "AI_CITATION_GAP",
      queryOrTopic: query,
      recommendedAction:
        "Use only as an audit prompt unless GSC or SERP data confirms demand. Check whether the current page has a direct, sourced Georgian answer.",
      seoImpact: "UNKNOWN",
      source: "SYNTHETIC",
      supportingUrls: [item.url],
      timestamp: now(),
      trend: "UNKNOWN",
      url: item.url,
    }));
  });
}

function technicalIssue(
  seed: string,
  url: string,
  message: string,
  priority: Opportunity["priority"],
  supportingUrls: string[] = [url],
): Opportunity {
  return {
    autoFixable: ["canonical-hreflang", "hreflang-self", "sitemap-indexable"].includes(seed),
    confidence: 0.9,
    evidence: [{ label: "repository graph check", source: "OBSERVED", value: message }],
    geoImpact: "LOW",
    humanReviewRequired: false,
    id: stableId("technical", seed, url),
    locale: localeFromUrl(url),
    pageType: "unknown",
    priority,
    problemType: "TECHNICAL",
    queryOrTopic: seed,
    recommendedAction: message,
    seoImpact: priority === "CRITICAL" || priority === "HIGH" ? "HIGH" : "MEDIUM",
    source: "REPOSITORY",
    supportingUrls,
    timestamp: now(),
    trend: "UNKNOWN",
    url,
  };
}

async function readSeoGraph() {
  const file = path.join(process.cwd(), ".seo/graph.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as SeoGraph;
  } catch {
    throw new Error("Missing .seo/graph.json. Run pnpm seo:graph first.");
  }
}

function bucketInventory(
  inventory: InventoryItem[],
  keyFn: (item: InventoryItem) => null | string,
) {
  const buckets = new Map<string, InventoryItem[]>();
  for (const item of inventory) {
    const raw = keyFn(item);
    const value = typeof raw === "string" ? raw.trim() : "";
    const key = value ? `${item.locale}: ${value}` : "";
    if (!key) continue;
    buckets.set(key, [...(buckets.get(key) ?? []), item]);
  }
  return buckets;
}

function parseArgs(argv: string[]): Args {
  const [command = "audit", ...rest] = argv;
  const flags: Record<string, string | true> = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (!arg.startsWith("--")) continue;
    const trimmed = arg.slice(2);
    if (trimmed.includes("=")) {
      const [key, ...parts] = trimmed.split("=");
      flags[key] = parts.join("=");
    } else if (rest[index + 1] && !rest[index + 1].startsWith("--")) {
      flags[trimmed] = rest[index + 1];
      index += 1;
    } else {
      flags[trimmed] = true;
    }
  }
  return { command, flags };
}

async function selfcheck() {
  const window = dateWindow(28);
  assert(window.startDate < window.endDate, "date window sorts");
  const rows: GscRow[] = [
    {
      clicks: 1,
      country: "geo",
      ctr: 0.1,
      date: "2026-09-01",
      device: "DESKTOP",
      impressions: 10,
      page: "https://reptiles.ge/gvelebi/giurza",
      position: 8,
      query: "გიურზა",
    },
    {
      clicks: 2,
      country: "geo",
      ctr: 0.1,
      date: "2026-09-02",
      device: "DESKTOP",
      impressions: 20,
      page: "https://reptiles.ge/gvelebi/giurza",
      position: 10,
      query: "გიურზა",
    },
  ];
  const [aggregate] = aggregateGscRows(rows);
  assert(aggregate.impressions === 30, "aggregates impressions");
  assert(aggregate.clicks === 3, "aggregates clicks");
  assert(localeFromPath("/en/snakes/foo") === "en", "detects prefixed locale");
  assert(localeFromPath("/gvelebi/foo") === "ka", "detects default locale");
  console.log("reptiles-seo selfcheck passed");
}

function assert(value: unknown, message: string) {
  if (!value) throw new Error(`selfcheck failed: ${message}`);
}

function sortOpportunities(a: Opportunity, b: Opportunity) {
  const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, IGNORE: 4 };
  return (
    rank[a.priority] - rank[b.priority] ||
    b.confidence - a.confidence ||
    a.url.localeCompare(b.url)
  );
}

function stableId(...parts: string[]) {
  return hash(parts.join("\u0000")).slice(0, 16);
}

function dedupeOpportunities(items: Opportunity[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function percentile(values: number[], p: number) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[index];
}

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function base64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function localeFromPath(urlPath: string): AppLocale {
  const segment = normalizePath(urlPath).split("/")[1];
  return routing.locales.includes(segment as AppLocale) && segment !== "ka"
    ? (segment as AppLocale)
    : "ka";
}

function localeFromUrl(url: string): AppLocale | "unknown" {
  try {
    return localeFromPath(new URL(url).pathname);
  } catch {
    return "unknown";
  }
}

function normalizePath(value: string) {
  const pathOnly = value.startsWith("http") ? new URL(value).pathname : value;
  const normalized = pathOnly.replace(/\/+$/, "") || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizeUrl(url: string) {
  if (!url) return url;
  const parsed = new URL(url, "https://reptiles.ge");
  parsed.hash = "";
  parsed.search = "";
  parsed.pathname = normalizePath(parsed.pathname);
  return parsed.toString().replace(/\/$/, "");
}

function absoluteFromPath(urlPath: string) {
  return normalizeUrl(`https://reptiles.ge${normalizePath(urlPath)}`);
}

function now() {
  return new Date().toISOString();
}

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 180);
}

async function writeJsonReport(name: string, value: unknown) {
  await fs.mkdir(reportRoot, { recursive: true });
  const file = path.join(reportRoot, `${safeFileName(name)}.json`);
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeMarkdownReport(name: string, report: Report) {
  await fs.mkdir(reportRoot, { recursive: true });
  const file = path.join(reportRoot, `${safeFileName(name)}.md`);
  const top = report.opportunities.slice(0, 25);
  const lines = [
    "# reptiles.ge SEO/GEO Intelligence Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Executive summary",
    "",
    `- Inventory pages: ${report.summary.inventoryPages}`,
    `- Opportunities: ${report.summary.opportunities}`,
    `- Technical issues: ${report.summary.technicalIssues}`,
    `- GSC rows: ${report.summary.gscRows}`,
    `- GA4 rows: ${report.summary.ga4Rows}`,
    "",
    "## Top opportunities",
    "",
    ...top.flatMap((item) => [
      `### ${item.priority}: ${item.problemType} — ${item.queryOrTopic}`,
      "",
      `URL: ${item.url}`,
      "",
      `Action: ${item.recommendedAction}`,
      "",
      `Evidence: ${item.evidence.map((evidence) => `${evidence.label}=${evidence.value} [${evidence.source}]`).join("; ")}`,
      "",
    ]),
    "## Data limitations",
    "",
    ...report.dataLimitations.map((item) => `- ${item}`),
    "",
  ];
  await fs.writeFile(file, `${lines.join("\n")}\n`, "utf8");
}

main().catch((error) => {
  if (error instanceof MissingInput) {
    console.error(error.message);
    process.exit(2);
  }
  console.error(error);
  process.exit(1);
});
