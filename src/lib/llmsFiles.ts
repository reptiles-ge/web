import { getGuideArticles } from "@/data/guideArticles";
import { getPublishedNewsArticles } from "@/data/news";
import { regions } from "@/data/regions";
import { getCatalogSpecies, type Species } from "@/data/species";
import { type AnimalGroup, getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
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
  "scorpion",
  "insect",
];

const GROUP_HEADING: Record<AnimalGroup, string> = {
  amphibian: "Amphibians",
  bird: "Birds",
  insect: "Insects",
  lizard: "Lizards",
  mammal: "Mammals",
  scorpion: "Scorpions",
  snake: "Snakes",
  spider: "Spiders",
  turtle: "Turtles",
};

const GROUP_INDEX_PATH: Partial<Record<AnimalGroup, string>> = {
  amphibian: "/amphibians/saxeoebebi",
  bird: "/birds/saxeoebebi",
  insect: "/insects/saxeoebebi",
  lizard: "/lizards/saxeoebebi",
  mammal: "/mammals/saxeoebebi",
  snake: "/snakes/saxeoebebi",
  spider: "/spiders/saxeoebebi",
  turtle: "/turtles/saxeoebebi",
};

const GROUP_HUB_PATH: Record<AnimalGroup, string> = {
  amphibian: "/amphibians",
  bird: "/birds",
  insect: "/insects",
  lizard: "/lizards",
  mammal: "/mammals",
  scorpion: "/scorpions",
  snake: "/snakes",
  spider: "/spiders",
  turtle: "/turtles",
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
      "Citable facts from Tarkhnishvili et al. 2026: 12 amphibians, 56 reptiles; confirmed vs candidate; atlas is editorial, not the paper.",
    title: "Georgia herpetofauna checklist 2026",
    urlPath: "/news/georgia-herpetofauna-checklist-2026",
  },
  {
    blurb:
      "Medically significant vipers in Georgia (Caucasus), myths vs media errors, viper vs Montpellier compare table. Educational.",
    title: "Venomous snakes in Georgia",
    urlPath: "/gvelebi/shxamiani-gvelebi",
  },
  {
    blurb: "Educational snakebite page. Call 112. Not a medical protocol.",
    title: "Snakebite",
    urlPath: "/gvelebi/gvelis-nakbeni",
  },
  {
    blurb: "Visual cues are not universal; compare lookalikes and profiles.",
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
  "insect",
  "lizard",
  "scorpion",
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
    "Reptiles.ge is an editorial compilation, not a government agency and not a substitute for the papers it cites. Amphibians and reptiles follow Tarkhnishvili et al. 2026; birds, mammals, spiders, scorpions, and insects are published-profile sets, not complete national checklists. Empty size, region, IUCN, or Red List fields stay hidden. Checklist candidates stay candidates. Bite and venom pages are educational: call 112; they are not medical protocol.",
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
    "- Herpetofauna, spiders, scorpions, and insects use fuller cards; birds and mammals stay compact (thinner atlas layer).",
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

  parts.push("## Practical guides");
  parts.push("");
  for (const article of getGuideArticles()) {
    const copy = article.copy.en;
    parts.push(`### ${copy.title}`);
    parts.push("");
    parts.push(`- URL: ${absoluteUrl(localizedPath("ka", article.pathname))}`);
    parts.push(`- EN: ${absoluteUrl(localizedPath("en", article.pathname))}`);
    parts.push(`- ${copy.lead}`);
    for (const item of copy.faq) {
      parts.push(`- Q: ${item.question} A: ${item.answer}`);
    }
    parts.push("- Sources:");
    for (const source of article.sources) {
      parts.push(`  - ${source.name}: ${source.url}`);
    }
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

export function buildLlmsIndexText() {
  const species = sortSpecies(getCatalogSpecies());
  const news = getPublishedNewsArticles();
  const byGroup = new Map<AnimalGroup, Species[]>();
  for (const item of species) {
    const group = getSpeciesAtlasMeta(item.id).group;
    byGroup.set(group, [...(byGroup.get(group) ?? []), item]);
  }

  const parts: string[] = [
    "# Reptiles.ge",
    "",
    "> Digital atlas of animals of Georgia: species profiles, identification, regional records, and educational safety pages. Georgian is canonical. Herpetofauna is the deepest layer.",
    "",
    "Reptiles.ge is an editorial compilation, not a government agency and not a substitute for the papers it cites. Amphibians and reptiles follow Tarkhnishvili et al. 2026; birds, mammals, spiders, scorpions, and insects are published-profile sets, not complete national checklists. Empty size, region, IUCN, or Red List fields stay hidden. Checklist candidates stay candidates. Bite and venom pages are educational: call 112; they are not medical protocol.",
    "",
    "Use Georgian URLs below as canonical (`x-default`). Prefixed locales are `/en`, `/ru`, and `/tr`. Default-locale group paths are Georgian (`/gvelebi`); prefixed locales use English pathnames (`/en/snakes`). Species slugs are Georgian on `ka` and the catalog id on `en`/`ru`/`tr` (example: `https://reptiles.ge/en/snakes/macrovipera-lebetina`). Do not use `/ka` prefixes or unprefixed English hub paths such as `/snakes` on the default locale.",
    "",
    "Priority order: About (methods) → 2026 herpetofauna checklist article → species atlas → group hubs and indexes → species profiles → identification and safety guides → region pages (only taxa with an administrative-unit record in the atlas).",
    "",
    "## Machine-readable",
    "",
    `- [llms.txt](${absoluteUrl(LLMS_TXT_PATH)}): This index (navigation + scope).`,
    `- [llms-full.txt](${absoluteUrl(LLMS_FULL_PATH)}): One-shot extractable corpus — methods, priority guides, news, and published species cards. Prefer for ingestion; prefer live profile URLs when quoting.`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): Full indexable URL set, including locale alternates.`,
    "",
    "## Core",
    "",
    `- [Home](${absoluteUrl("/")}): Georgian homepage for the atlas.`,
    `- [Species atlas](${absoluteUrl("/species")}): Catalog of published profiles (${species.length} live pages). Not a complete national fauna.`,
    `- [About](${absoluteUrl("/about")}): What the atlas is, what it will not infer, photography credits, and herpetofauna sources.`,
    `- [Georgia herpetofauna checklist 2026](${absoluteUrl("/news/georgia-herpetofauna-checklist-2026")}): Editorial article on Tarkhnishvili et al. 2026 (12 amphibians, 56 reptiles in that paper).`,
    "",
    "## Group hubs",
    "",
  ];

  for (const group of GROUP_ORDER) {
    const items = byGroup.get(group) ?? [];
    if (items.length === 0) continue;
    parts.push(
      `- [${GROUP_HEADING[group]}](${absoluteUrl(localizedPath("ka", GROUP_HUB_PATH[group]))}): ${groupSummary(group, items.length)}.`,
    );
  }

  parts.push("", "## Species indexes", "");
  for (const group of GROUP_ORDER) {
    const path = GROUP_INDEX_PATH[group];
    const items = byGroup.get(group) ?? [];
    if (!path || items.length === 0) continue;
    parts.push(
      `- [${GROUP_HEADING[group]} index](${absoluteUrl(localizedPath("ka", path))}): Table of published ${group} profiles.`,
    );
  }

  parts.push(
    "",
    "## Identification and field guides",
    "",
    `- [Venomous vs harmless snakes](${absoluteUrl("/gvelebi/shxamiani-gvelis-amocnoba")}): Visual cues are not universal; compare lookalikes and profiles.`,
    `- [Lizard identification](${absoluteUrl("/xvlikebi/identifikacia")}): Field marks, lookalikes, and Darevskia caution (colour is not ID).`,
    `- [Darevskia](${absoluteUrl("/xvlikebi/darevskia")}): Sixteen rock-lizard profiles kept separate. Colour is not identification. Candidates stay candidates.`,
    `- [Lizard or glass lizard](${absoluteUrl("/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba")}): Glass lizard vs slow worm vs snakes. None of the three is venomous on this page.`,
    `- [Turtle identification](${absoluteUrl("/kuebi/identifikacia")}): Four-taxon comparison (land, native freshwater, introduced slider).`,
    `- [Frogs of Georgia](${absoluteUrl("/amfibiebi/bayayi")}): Anura guide (8 species in the atlas).`,
    `- [Frog index](${absoluteUrl("/amfibiebi/bayayi/saxeoebebi")}): Frog and toad index table.`,
    `- [Newts and salamanders](${absoluteUrl("/amfibiebi/tritoni-salamandra")}): Caudata guide (4 species in the atlas).`,
    `- [Land turtles](${absoluteUrl("/kuebi/xmelis-kuebi")}): Spur-thighed tortoise cluster.`,
    `- [Freshwater turtles](${absoluteUrl("/kuebi/tsqlis-kuebi")}): Pond turtle, Caspian turtle, and introduced slider.`,
    `- [Snake range](${absoluteUrl("/gvelebi/gavrtseleba")}): Snake occurrence across the 12 regions as recorded in the atlas.`,
    `- [Largest snakes](${absoluteUrl("/gvelebi/didi-gvelebi")}): Size only where profiles cite it. Glass lizard is a lizard.`,
    `- [Venomous spiders](${absoluteUrl("/obobebi/shxamiani-obobebi")}): Spider risk guide for published atlas profiles.`,
    `- [Spider bite](${absoluteUrl("/obobebi/obobis-nakbeni")}): Educational page. Call 112 for severe symptoms or uncertainty.`,
    "",
    "## Safety",
    "",
    `- [Venomous snakes in Georgia](${absoluteUrl("/gvelebi/shxamiani-gvelebi")}): Medically significant vipers in the atlas, plus identification links. Educational.`,
    `- [Snakebite](${absoluteUrl("/gvelebi/gvelis-nakbeni")}): Educational page. Call 112. Not a medical protocol and not first-aid instruction for unsupervised use.`,
    `- [Snakes in the yard](${absoluteUrl("/gvelebi/gveli-ezoshi")}): Practical notes on snakes near houses. Not a guaranteed repellent method.`,
    `- [Risk to humans](${absoluteUrl("/riskis-doneebi")}): What Harmless, Moderate, and High mean on atlas profiles.`,
    ...getGuideArticles().map(
      (article) =>
        `- [${article.copy.en.title}](${absoluteUrl(localizedPath("ka", article.pathname))}): ${article.copy.en.description}`,
    ),
    "",
    "## Regions",
    "",
    "Region lists include only taxa assigned to that administrative unit in the atlas. Absence is not a national-range claim.",
    "",
    `- [Regions](${absoluteUrl("/regions")}): Map of Georgia’s 12 regions used by the atlas.`,
  );

  for (const region of regions) {
    parts.push(
      `- [${region.name.en}](${absoluteUrl(`/regions/${region.id}`)}): Atlas records for ${region.name.en}.`,
    );
  }

  parts.push(
    "",
    "## News",
    "",
    "Editorial pieces with cited sources. The species profile remains the atlas record.",
    "",
    `- [News](${absoluteUrl("/news")}): Index of published articles.`,
  );
  for (const article of news) {
    const copy = article.copy.en;
    parts.push(
      `- [${copy.title}](${localizedNewsUrl("ka", article.slug)}): ${copy.dek}`,
    );
  }

  for (const group of GROUP_ORDER) {
    const items = byGroup.get(group) ?? [];
    if (items.length === 0) continue;
    parts.push("", `## ${GROUP_HEADING[group]} species`, "");
    if (group === "bird" || group === "mammal" || group === "spider") {
      parts.push(
        `Published ${GROUP_HEADING[group].toLowerCase()} profiles only. Not a complete national ${group === "bird" ? "avifauna" : "fauna"} list.`,
        "",
      );
    }
    for (const item of items) {
      parts.push(formatSpeciesIndexLine(item));
    }
  }

  parts.push(
    "",
    "## Secondary resources",
    "",
    `- [English](${absoluteUrl("/en")}): English homepage. Same catalog; English pathnames and scientific species slugs.`,
    `- [Russian](${absoluteUrl("/ru")}): Russian homepage (\`/ru/…\` + English pathnames).`,
    `- [Turkish](${absoluteUrl("/tr")}): Turkish homepage (\`/tr/…\` + English pathnames).`,
    `- [Contact](${absoluteUrl("/contact")}): Corrections and questions.`,
    `- [Quizzes](${absoluteUrl("/quiz")}): Quiz index. Turtle quiz is listed as coming soon (no URL).`,
    `- [Which snake?](${absoluteUrl("/quiz/romeli-gvelia")}): Snake photo quiz. Practice, not field ID. No result URLs.`,
    `- [Which lizard?](${absoluteUrl("/quiz/romeli-xvlikia")}): Lizard photo quiz. Practice, not field ID. No result URLs.`,
    `- [Tarkhnishvili et al. 2026](https://doi.org/10.3897/caucasiana.5.e189214): Annotated checklist cited for amphibians and reptiles.`,
    `- [Iankoshvili & Tarkhnishvili 2021](https://doi.org/10.1080/09397140.2021.1957208): Snake distribution paper cited on About and some snake profiles.`,
    "",
  );

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

function formatSpeciesIndexLine(item: Species) {
  const english = localizeSpecies(item, "en");
  const details = [
    english.commonName || item.commonName,
    item.danger,
    `Catalog id \`${item.id}\``,
  ].filter(Boolean);
  return `- [${item.scientificName}](${localizedSpeciesUrl("ka", item.id)}): ${details.join(". ")}.`;
}

function groupSummary(group: AnimalGroup, count: number) {
  const countLabel = `${count} published ${count === 1 ? "profile" : "profiles"}`;
  switch (group) {
    case "amphibian":
      return `Amphibian hub (${countLabel})`;
    case "bird":
      return `Bird hub (${countLabel}; published atlas profiles only, not a national avifauna list)`;
    case "insect":
      return `Insect hub (${countLabel}; published atlas profiles only)`;
    case "lizard":
      return `Lizard hub, including Darevskia and the glass lizard (${countLabel})`;
    case "mammal":
      return `Mammal hub (${countLabel}; published atlas profiles only, not a national mammal list)`;
    case "scorpion":
      return `Scorpion hub (${countLabel}; published atlas profiles only)`;
    case "snake":
      return `Snake hub for Georgia (${countLabel})`;
    case "spider":
      return `Spider hub (${countLabel}; published atlas profiles only, not a complete arachnofauna list)`;
    case "turtle":
      return `Turtle hub (${countLabel}, including one introduced slider)`;
  }
}

function localizedNewsUrl(locale: AppLocale, slug: string) {
  return absoluteUrl(withLocalePrefix(locale, `/news/${slug}`));
}

function localizedPath(locale: AppLocale, path: string) {
  const mapped = pathnames[path as keyof typeof pathnames];
  if (!mapped) return withLocalePrefix(locale, path);
  const template = typeof mapped === "string" ? mapped : mapped[locale];
  return withLocalePrefix(locale, template);
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
