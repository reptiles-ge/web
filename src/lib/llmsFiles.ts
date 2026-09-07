import { getPublishedNewsArticles } from "@/data/news";
import { getCatalogSpecies, type Species } from "@/data/species";
import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
} from "@/data/speciesAtlasMeta";
import { pathnames } from "@/i18n/pathnames";
import { type AppLocale, routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { speciesHref } from "@/lib/speciesRoutes";

export const LLMS_FULL_PATH = "/llms-full.txt";
export const LLMS_TXT_PATH = "/llms.txt";

export const AI_CITATION_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
  "Applebot-Extended",
] as const;

const GROUP_ORDER: AnimalGroup[] = [
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "spider",
];

const GROUP_HEADING: Record<AnimalGroup, string> = {
  amphibian: "Amphibians",
  bird: "Birds",
  lizard: "Lizards",
  mammal: "Mammals",
  snake: "Snakes",
  spider: "Spiders",
  turtle: "Turtles",
};

const PRIORITY_PAGES: ReadonlyArray<{
  blurb: string;
  title: string;
  urlPath: string;
}> = [
  {
    blurb:
      "What the atlas is, what it will not infer, photography credits, and herpetofauna sources.",
    title: "About",
    urlPath: "/about",
  },
  {
    blurb:
      "Editorial article on Tarkhnishvili et al. 2026 (12 amphibians, 56 reptiles in that paper).",
    title: "Georgia herpetofauna checklist 2026",
    urlPath: "/news/georgia-herpetofauna-checklist-2026",
  },
  {
    blurb:
      "Medically significant vipers in the atlas, plus identification links. Educational.",
    title: "Venomous snakes in Georgia",
    urlPath: "/gvelebi/shxamiani-gvelebi",
  },
  {
    blurb:
      "Educational snakebite page. Call 112. Not a medical protocol.",
    title: "Snakebite",
    urlPath: "/gvelebi/gvelis-nakbeni",
  },
  {
    blurb:
      "Visual cues are not universal; compare lookalikes and profiles.",
    title: "Venomous vs harmless snakes",
    urlPath: "/gvelebi/shxamiani-gvelis-amocnoba",
  },
  {
    blurb:
      "Sixteen rock-lizard profiles kept separate. Colour is not identification.",
    title: "Darevskia",
    urlPath: "/xvlikebi/darevskia",
  },
  {
    blurb: "What Harmless, Moderate, and High mean on atlas profiles.",
    title: "Risk to humans",
    urlPath: "/riskis-doneebi",
  },
];

const MAX_FAQS_PER_SPECIES = 3;
const MAX_FACTS_PER_SPECIES = 4;
const MAX_SOURCES_FULL = 6;
const MAX_SOURCES_COMPACT = 2;
const MAX_OVERVIEW_FULL = 520;
const MAX_OVERVIEW_COMPACT = 220;

const DEEP_GROUPS = new Set<AnimalGroup>([
  "amphibian",
  "lizard",
  "snake",
  "spider",
  "turtle",
]);

export function buildLlmsFullText() {
  const generatedAt = new Date().toISOString();
  const species = sortSpecies(getCatalogSpecies());
  const news = getPublishedNewsArticles();

  const parts: string[] = [
    "# Reptiles.ge — llms-full",
    "",
    "> Digital atlas of animals of Georgia. Georgian URLs are canonical (`x-default`). Prefixed locales: `/en`, `/ru`, `/tr`.",
    "",
    "Reptiles.ge is an editorial compilation, not a government agency and not a substitute for the papers it cites. Amphibians and reptiles follow Tarkhnishvili et al. 2026; birds, mammals, and spiders are thinner published-profile sets, not complete national checklists. Empty size, region, IUCN, or Red List fields stay hidden. Checklist candidates stay candidates. Bite and venom pages are educational: call 112; they are not medical protocol.",
    "",
    `Generated: ${generatedAt}`,
    `Published species cards: ${species.length}`,
    `Index: ${absoluteUrl(LLMS_TXT_PATH)}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "## How to use this file",
    "",
    "- This corpus inlines extractable facts for one-shot ingestion.",
    "- For navigation and the full link map, use llms.txt.",
    "- Prefer the live profile URL when quoting; this file can lag a deploy by minutes.",
    "- Do not invent localities, measurements, or Red List status beyond what each card states.",
    "- Herpetofauna and spiders use fuller cards; birds and mammals stay compact (thinner atlas layer).",
    "",
    "## Priority pages",
    "",
  ];

  for (const page of PRIORITY_PAGES) {
    parts.push(`### ${page.title}`);
    parts.push("");
    parts.push(`- URL: ${absoluteUrl(page.urlPath)}`);
    parts.push(`- ${page.blurb}`);
    parts.push("");
  }

  parts.push("## News");
  parts.push("");
  for (const article of news) {
    const copy = article.copy.ka;
    parts.push(`### ${copy.title}`);
    parts.push("");
    parts.push(`- URL: ${localizedNewsUrl("ka", article.slug)}`);
    parts.push(`- EN: ${localizedNewsUrl("en", article.slug)}`);
    parts.push(`- Published: ${article.publishedAt}`);
    if (article.updatedAt) parts.push(`- Updated: ${article.updatedAt}`);
    parts.push(`- ${copy.dek}`);
    if (article.sources.length > 0) {
      parts.push("- Sources:");
      for (const source of article.sources) {
        parts.push(`  - ${source.name}: ${source.url}`);
      }
    }
    parts.push("");
  }

  let currentGroup: AnimalGroup | null = null;
  for (const item of species) {
    const group = getSpeciesAtlasMeta(item.id).group;
    if (group !== currentGroup) {
      currentGroup = group;
      parts.push(`## ${GROUP_HEADING[group]}`);
      parts.push("");
    }
    parts.push(formatSpeciesCard(item));
  }

  parts.push("## Authority");
  parts.push("");
  parts.push(
    `- Tarkhnishvili et al. 2026: https://doi.org/10.3897/caucasiana.5.e189214`,
  );
  parts.push(
    `- Iankoshvili & Tarkhnishvili 2021: https://doi.org/10.1080/09397140.2021.1957208`,
  );
  parts.push(`- About / methods: ${absoluteUrl("/about")}`);
  parts.push("");

  return parts.join("\n");
}

export function buildRobotsTxt() {
  const llmsTxt = absoluteUrl(LLMS_TXT_PATH);
  const llmsFull = absoluteUrl(LLMS_FULL_PATH);
  const sitemap = absoluteUrl("/sitemap.xml");

  const aiBlocks = AI_CITATION_USER_AGENTS.flatMap((agent) => [
    `User-agent: ${agent}`,
    "Allow: /",
    "",
  ]);

  return [
    "# reptiles.ge — public atlas of animals of Georgia",
    "# AI crawlers: citation and summarization of published pages is welcome.",
    `# Prefer ${llmsTxt} (index) and ${llmsFull} (extractable corpus).`,
    "# Do not treat empty atlas fields as negative evidence.",
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin",
    "Disallow: /admin/",
    "",
    ...aiBlocks,
    `Sitemap: ${sitemap}`,
    `# llms.txt: ${llmsTxt}`,
    `# llms-full.txt: ${llmsFull}`,
    "",
  ].join("\n");
}

export function llmsTextResponseHeaders(options?: { noindex?: boolean }) {
  return {
    "Cache-Control":
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    "Content-Type": "text/plain; charset=utf-8",
    ...(options?.noindex ? { "X-Robots-Tag": "noindex, follow" } : {}),
  };
}

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatSpeciesCard(item: Species) {
  const group = getSpeciesAtlasMeta(item.id).group;
  const deep = DEEP_GROUPS.has(group);
  const lines: string[] = [
    `### ${item.scientificName} — ${item.commonName}`,
    "",
    `- URL: ${localizedSpeciesUrl("ka", item.id)}`,
    `- EN: ${localizedSpeciesUrl("en", item.id)}`,
    `- Catalog id: ${item.id}`,
    `- Updated: ${item.updatedAt}`,
  ];

  if (item.danger) lines.push(`- Risk to humans: ${item.danger}`);
  lines.push(`- Family: ${item.family}`);

  const overview = truncateText(
    compactText(item.overview || item.description),
    deep ? MAX_OVERVIEW_FULL : MAX_OVERVIEW_COMPACT,
  );
  if (overview) {
    lines.push("");
    lines.push(overview);
  }

  if (deep) {
    const stats = item.stats
      .filter((stat) => stat.label && stat.value)
      .slice(0, 6);
    if (stats.length > 0) {
      lines.push("");
      lines.push("Facts:");
      for (const stat of stats) {
        lines.push(`- ${stat.label}: ${stat.value}`);
      }
    }

    const facts = item.facts.filter(Boolean).slice(0, MAX_FACTS_PER_SPECIES);
    if (facts.length > 0) {
      lines.push("");
      for (const fact of facts) {
        lines.push(
          `- ${truncateText(compactText(fact), MAX_OVERVIEW_COMPACT)}`,
        );
      }
    }

    if (item.identification?.summary) {
      lines.push("");
      lines.push(
        `Identification: ${truncateText(compactText(item.identification.summary), MAX_OVERVIEW_COMPACT)}`,
      );
    }

    const faqs = (item.faq ?? []).slice(0, MAX_FAQS_PER_SPECIES);
    if (faqs.length > 0) {
      lines.push("");
      lines.push("FAQ:");
      for (const entry of faqs) {
        lines.push(`- Q: ${compactText(entry.question)}`);
        lines.push(
          `  A: ${truncateText(compactText(entry.answer), MAX_OVERVIEW_COMPACT)}`,
        );
      }
    }
  }

  const sources = pickSources(
    item.sources,
    deep ? MAX_SOURCES_FULL : MAX_SOURCES_COMPACT,
  );
  if (sources.length > 0) {
    lines.push("");
    lines.push("Sources:");
    for (const source of sources) {
      lines.push(
        source.url ? `- ${source.name}: ${source.url}` : `- ${source.name}`,
      );
    }
  }

  lines.push("");
  return lines.join("\n");
}

function localizedNewsUrl(locale: AppLocale, slug: string) {
  return absoluteUrl(withLocalePrefix(locale, `/news/${slug}`));
}

function localizedSpeciesUrl(locale: AppLocale, id: string) {
  const href = speciesHref(id, locale);
  const mapped = pathnames[href.pathname];
  const template =
    typeof mapped === "string" ? mapped : mapped[locale] || mapped.en;
  return absoluteUrl(
    withLocalePrefix(locale, template.replace("[slug]", href.params.slug)),
  );
}

function pickSources(sources: Species["sources"], limit: number) {
  const ranked = sources.slice().sort((a, b) => {
    return sourceRank(a) - sourceRank(b);
  });
  return ranked.slice(0, limit);
}

function sortSpecies(items: Species[]) {
  return items.slice().sort((a, b) => {
    const groupA = getSpeciesAtlasMeta(a.id).group;
    const groupB = getSpeciesAtlasMeta(b.id).group;
    const order = GROUP_ORDER.indexOf(groupA) - GROUP_ORDER.indexOf(groupB);
    if (order !== 0) return order;
    return a.scientificName.localeCompare(b.scientificName);
  });
}

function sourceRank(source: Species["sources"][number]) {
  const hay = `${source.name} ${source.url ?? ""}`.toLowerCase();
  if (hay.includes("doi.org") || hay.includes("10.3897")) return 0;
  if (hay.includes("iucn")) return 1;
  if (hay.includes("tarkhnishvili") || hay.includes("checklist")) return 2;
  if (source.url) return 3;
  return 4;
}

function truncateText(value: string, max: number) {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  const at = slice.lastIndexOf(" ");
  return `${(at > 40 ? slice.slice(0, at) : slice).trimEnd()}…`;
}

function withLocalePrefix(locale: AppLocale, path: string) {
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
