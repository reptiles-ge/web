import type { Species } from "@/data/species";
import type { CatalogFullSpecies } from "@/data/speciesCatalogTypes";

import { getGuideArticles } from "@/data/guideArticles";
import { getPublishedNewsArticles, newsSourceName } from "@/data/news";
import { regions } from "@/data/regions";
import { type AnimalGroup, getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { pathnames } from "@/i18n/pathnames";
import { type AppLocale, routing } from "@/i18n/routing";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { llmsFullPath, llmsIndexPath } from "@/lib/llmsPaths";
import { quizHref } from "@/lib/quizzes";
import { absoluteUrl } from "@/lib/site";
import { speciesHref } from "@/lib/speciesRoutes";
import { resolveSpeciesIdInHub } from "@/lib/speciesSlugTable";

export type LlmsSpecies = {
  base: readonly CatalogFullSpecies[];
  ids: ReadonlySet<string>;
  localized: (item: Species, locale: AppLocale) => Species;
};

export function createLlmsSpecies(
  catalogs: Partial<Record<AppLocale, readonly CatalogFullSpecies[]>>,
): LlmsSpecies {
  const base = catalogs[routing.defaultLocale] ?? [];
  const byLocale = new Map(
    Object.entries(catalogs).map(([locale, list]) => [
      locale,
      new Map(list.map((item) => [item.id, item])),
    ]),
  );
  return {
    base,
    ids: new Set(base.map((item) => item.id)),
    localized: (item, locale) => byLocale.get(locale)?.get(item.id) ?? item,
  };
}

const LOCALE_LABEL: Record<AppLocale, string> = {
  en: "English",
  ka: "Georgian",
  ru: "Russian",
  tr: "Turkish",
};

const GEORGIAN_SCRIPT = /[\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]/;

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
    urlPath: "/venomous-snakes",
  },
  {
    blurb: "Visual cues are not universal; compare lookalikes and profiles.",
    title: "Venomous vs harmless snakes",
    urlPath: "/snakes/shxamiani-gvelis-amocnoba",
  },
  {
    blurb:
      "Sixteen rock-lizard profiles kept separate. Colour is not identification.",
    title: "Darevskia",
    urlPath: "/lizards/darevskia",
  },
  {
    blurb: "What Harmless, Moderate, and High mean on atlas profiles.",
    title: "Risk to humans",
    urlPath: "/risk-to-humans",
  },
];

const MAX_FAQS_PER_SPECIES = 3;
const MAX_FACTS_PER_SPECIES = 4;
const MAX_SOURCES_FULL = 6;
const MAX_SOURCES_COMPACT = 2;
const MAX_OVERVIEW_FULL = 520;
const MAX_OVERVIEW_COMPACT = 220;

const SCOPE_NOTE =
  "Reptiles.ge is an editorial compilation, not a government agency and not a substitute for the papers it cites. Amphibians and reptiles follow Tarkhnishvili et al. 2026; birds, mammals, spiders, scorpions, and insects are published-profile sets, not complete national checklists. Empty size, region, IUCN, or Red List fields stay hidden. Checklist candidates stay candidates. Bite and venom pages are educational: call 112; they are not medical protocol.";

const DEEP_GROUPS = new Set<AnimalGroup>([
  "amphibian",
  "insect",
  "lizard",
  "scorpion",
  "snake",
  "spider",
  "turtle",
]);

export function buildLlmsFullText(
  catalog: LlmsSpecies,
  locale: AppLocale = routing.defaultLocale,
) {
  const generatedAt = new Date().toISOString();
  const species = sortSpecies(catalog.base);
  const news = getPublishedNewsArticles(locale);
  const canonical = locale === routing.defaultLocale;
  const label = LOCALE_LABEL[locale];

  const parts: string[] = [
    canonical
      ? "# Reptiles.ge — llms-full"
      : `# Reptiles.ge — llms-full (${label})`,
    "",
    canonical
      ? "> Digital atlas of animals of Georgia. Georgian URLs are canonical (`x-default`). Prefixed locales: `/en`, `/ru`, `/tr`."
      : `> Digital atlas of animals of Georgia. ${label} text and \`/${locale}\` URLs. Georgian URLs are canonical (\`x-default\`); each card also links its Georgian page.`,
    "",
    SCOPE_NOTE,
    "",
    `Generated: ${generatedAt}`,
    `Language: ${label} (${locale})`,
    `Published species cards: ${species.length}`,
    `Index: ${absoluteUrl(llmsIndexPath(locale))}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "## How to use this file",
    "",
    "- This corpus inlines extractable facts for one-shot ingestion.",
    "- For navigation and the full link map, use llms.txt.",
    "- Prefer the live profile URL when quoting; this file can lag a deploy by minutes.",
    "- Do not invent localities, measurements, or Red List status beyond what each card states.",
    "- Herpetofauna, spiders, scorpions, and insects use fuller cards; birds and mammals stay compact (thinner atlas layer).",
    "- Each language has its own llms.txt and llms-full.txt (see Languages).",
    "",
    ...languageSection(),
    "## Priority pages",
    "",
  ];

  for (const page of PRIORITY_PAGES) {
    parts.push(`### ${page.title}`);
    parts.push("");
    parts.push(`- URL: ${pageUrl(locale, page.urlPath)}`);
    parts.push(`- ${page.blurb}`);
    parts.push("");
  }

  parts.push("## Practical guides");
  parts.push("");
  for (const article of getGuideArticles()) {
    const copy = article.copy[proseLocale(locale)];
    parts.push(`### ${copy.title}`);
    parts.push("");
    parts.push(`- URL: ${pageUrl(locale, article.pathname)}`);
    parts.push(
      alternateLine(locale, pageUrl(alternateLocale(locale), article.pathname)),
    );
    parts.push(`- ${absoluteLinks(copy.summary, locale, catalog)}`);
    for (const item of copy.faq) {
      parts.push(
        `- Q: ${absoluteLinks(item.question, locale, catalog)} A: ${absoluteLinks(item.answer, locale, catalog)}`,
      );
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
    const copy = article.copy[locale];
    parts.push(`### ${copy.title}`);
    parts.push("");
    parts.push(`- URL: ${localizedNewsUrl(locale, article.slug)}`);
    parts.push(
      alternateLine(
        locale,
        localizedNewsUrl(alternateLocale(locale), article.slug),
      ),
    );
    parts.push(`- Published: ${article.publishedAt}`);
    if (article.updatedAt) parts.push(`- Updated: ${article.updatedAt}`);
    if (canonical) parts.push(`- English title: ${article.copy.en.title}`);
    parts.push(`- ${copy.dek}`);
    if (canonical) parts.push(`- English summary: ${article.copy.en.dek}`);
    if (article.sources.length > 0) {
      parts.push("- Sources:");
      for (const source of article.sources) {
        parts.push(`  - ${newsSourceName(source, locale)}: ${source.url}`);
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
    parts.push(formatSpeciesCard(item, locale, catalog));
  }

  parts.push("## Authority");
  parts.push("");
  parts.push(
    `- Tarkhnishvili et al. 2026: https://doi.org/10.3897/caucasiana.5.e189214`,
  );
  parts.push(
    `- Iankoshvili & Tarkhnishvili 2021: https://doi.org/10.1080/09397140.2021.1957208`,
  );
  parts.push(`- About / methods: ${pageUrl(locale, "/about")}`);
  parts.push("");

  return parts.join("\n");
}

export function buildLlmsIndexText(
  catalog: LlmsSpecies,
  locale: AppLocale = routing.defaultLocale,
) {
  const species = sortSpecies(catalog.base);
  const canonical = locale === routing.defaultLocale;
  const label = LOCALE_LABEL[locale];
  const prose = proseLocale(locale);
  const news = getPublishedNewsArticles(prose);
  const url = (path: string) => pageUrl(locale, path);
  const byGroup = new Map<AnimalGroup, Species[]>();
  for (const item of species) {
    const group = getSpeciesAtlasMeta(item.id).group;
    byGroup.set(group, [...(byGroup.get(group) ?? []), item]);
  }

  const parts: string[] = [
    canonical ? "# Reptiles.ge" : `# Reptiles.ge (${label})`,
    "",
    "> Digital atlas of animals of Georgia: species profiles, identification, regional records, and educational safety pages. Georgian is canonical. Herpetofauna is the deepest layer.",
    "",
    SCOPE_NOTE,
    "",
    canonical
      ? "Use Georgian URLs below as canonical (`x-default`). Prefixed locales are `/en`, `/ru`, and `/tr`. Default-locale group paths are Georgian (`/gvelebi`); prefixed locales use English pathnames (`/en/snakes`). Species slugs are Georgian on `ka` and the catalog id on `en`/`ru`/`tr` (example: `https://reptiles.ge/en/snakes/macrovipera-lebetina`). Do not use `/ka` prefixes or unprefixed English hub paths such as `/snakes` on the default locale."
      : `URLs below are the ${label} pages: \`/${locale}\` prefix, English pathnames, and the catalog id as the species slug (example: \`${absoluteUrl(`/${locale}/snakes/macrovipera-lebetina`)}\`). Georgian URLs are canonical (\`x-default\`); the Georgian index is ${absoluteUrl(llmsIndexPath(routing.defaultLocale))}.`,
    "",
    "Priority order: About (methods) → 2026 herpetofauna checklist article → species atlas → group hubs and indexes → species profiles → identification and safety guides → region pages (only taxa with an administrative-unit record in the atlas).",
    "",
    "## Machine-readable",
    "",
    `- [llms.txt](${absoluteUrl(llmsIndexPath(locale))}): This index (navigation + scope).`,
    `- [llms-full.txt](${absoluteUrl(llmsFullPath(locale))}): One-shot extractable corpus${canonical ? "" : ` in ${label}`} — methods, priority guides, news, and published species cards. Prefer for ingestion; prefer live profile URLs when quoting.`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): Full indexable URL set, including locale alternates.`,
    "",
    ...languageSection(),
    "## Core",
    "",
    `- [Home](${url("/")}): ${label} homepage for the atlas.`,
    `- [Species atlas](${url("/species")}): Catalog of published profiles (${species.length} live pages). Not a complete national fauna.`,
    `- [About](${url("/about")}): What the atlas is, what it will not infer, photography credits, and herpetofauna sources.`,
    `- [Georgia herpetofauna checklist 2026](${localizedNewsUrl(locale, "georgia-herpetofauna-checklist-2026")}): Editorial article on Tarkhnishvili et al. 2026 (12 amphibians, 56 reptiles in that paper).`,
    "",
    "## Group hubs",
    "",
  ];

  for (const group of GROUP_ORDER) {
    const items = byGroup.get(group) ?? [];
    if (items.length === 0) continue;
    parts.push(
      `- [${GROUP_HEADING[group]}](${url(GROUP_HUB_PATH[group])}): ${groupSummary(group, items.length)}.`,
    );
  }

  parts.push("", "## Species indexes", "");
  for (const group of GROUP_ORDER) {
    const path = GROUP_INDEX_PATH[group];
    const items = byGroup.get(group) ?? [];
    if (!path || items.length === 0) continue;
    parts.push(
      `- [${GROUP_HEADING[group]} index](${url(path)}): Table of published ${group} profiles.`,
    );
  }

  parts.push(
    "",
    "## Identification and field guides",
    "",
    `- [Venomous vs harmless snakes](${url("/snakes/shxamiani-gvelis-amocnoba")}): Visual cues are not universal; compare lookalikes and profiles.`,
    `- [Lizard identification](${url("/lizards/identifikacia")}): Field marks, lookalikes, and Darevskia caution (colour is not ID).`,
    `- [Darevskia](${url("/lizards/darevskia")}): Sixteen rock-lizard profiles kept separate. Colour is not identification. Candidates stay candidates.`,
    `- [Lizard or glass lizard](${url("/lizards/xvlikis-da-gvelxokeras-gansxvaveba")}): Glass lizard vs slow worm vs snakes. None of the three is venomous on this page.`,
    `- [Turtle identification](${url("/turtles/identifikacia")}): Four-taxon comparison (land, native freshwater, introduced slider).`,
    `- [Frogs of Georgia](${url("/amphibians/bayayi")}): Anura guide (8 species in the atlas).`,
    `- [Frog index](${url("/amphibians/bayayi/saxeoebebi")}): Frog and toad index table.`,
    `- [Newts and salamanders](${url("/amphibians/tritoni-salamandra")}): Caudata guide (4 species in the atlas).`,
    `- [Land turtles](${url("/turtles/xmelis-kuebi")}): Spur-thighed tortoise cluster.`,
    `- [Freshwater turtles](${url("/turtles/tsqlis-kuebi")}): Pond turtle, Caspian turtle, and introduced slider.`,
    `- [Snake range](${url("/snakes/gavrtseleba")}): Snake occurrence across the 12 regions as recorded in the atlas.`,
    `- [Largest snakes](${url("/snakes/didi-gvelebi")}): Size only where profiles cite it. Glass lizard is a lizard.`,
    `- [Venomous spiders](${url("/spiders/shxamiani-obobebi")}): Spider risk guide for published atlas profiles.`,
    `- [Spider bite](${url("/spiders/obobis-nakbeni")}): Educational page. Call 112 for severe symptoms or uncertainty.`,
    "",
    "## Safety",
    "",
    `- [Venomous snakes in Georgia](${url("/venomous-snakes")}): Medically significant vipers in the atlas, plus identification links. Educational.`,
    `- [Snakes in the yard](${url("/snakes-in-the-yard")}): Practical notes on snakes near houses. Not a guaranteed repellent method.`,
    `- [Risk to humans](${url("/risk-to-humans")}): What Harmless, Moderate, and High mean on atlas profiles.`,
    ...getGuideArticles().map(
      (article) =>
        `- [${article.copy[prose].title}](${url(article.pathname)}): ${article.copy[prose].description}`,
    ),
    "",
    "## Regions",
    "",
    "Region lists include only taxa assigned to that administrative unit in the atlas. Absence is not a national-range claim.",
    "",
    `- [Regions](${url("/regions")}): Map of Georgia’s 12 regions used by the atlas.`,
  );

  for (const region of regions) {
    parts.push(
      `- [${region.name.en}](${url(`/regions/${region.id}`)}): Atlas records for ${region.name.en}.`,
    );
  }

  parts.push(
    "",
    "## News",
    "",
    "Editorial pieces with cited sources. The species profile remains the atlas record.",
    "",
    `- [News](${url("/news")}): Index of published articles.`,
  );
  for (const article of news) {
    const copy = article.copy[prose];
    parts.push(
      `- [${copy.title}](${localizedNewsUrl(locale, article.slug)}): ${copy.dek}`,
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
      parts.push(formatSpeciesIndexLine(item, locale, catalog));
    }
  }

  parts.push(
    "",
    "## Secondary resources",
    "",
    `- [Contact](${url("/contact")}): Corrections and questions.`,
    `- [Quizzes](${url("/quiz")}): Quiz index. Turtle quiz is listed as coming soon (no URL).`,
    `- [Which snake?](${quizUrl(locale, "snake")}): Snake photo quiz. Practice, not field ID. No result URLs.`,
    `- [Which lizard?](${quizUrl(locale, "lizard")}): Lizard photo quiz. Practice, not field ID. No result URLs.`,
    `- [Tarkhnishvili et al. 2026](https://doi.org/10.3897/caucasiana.5.e189214): Annotated checklist cited for amphibians and reptiles.`,
    `- [Iankoshvili & Tarkhnishvili 2021](https://doi.org/10.1080/09397140.2021.1957208): Snake distribution paper cited on About and some snake profiles.`,
    "",
  );

  return parts.join("\n");
}

function absoluteLinks(text: string, locale: AppLocale, catalog: LlmsSpecies) {
  return text.replace(
    /\[([^\]]*)\]\(([^)\s]+)\)/g,
    (match, label: string, href: string) => {
      if (/^https?:\/\//.test(href)) return match;
      if (href.startsWith("/")) {
        const [path, hash] = href.split("#");
        return `[${label}](${absoluteUrl(localizedLinkPath(locale, path))}${hash ? `#${hash}` : ""})`;
      }
      if (catalog.ids.has(href)) {
        return `[${label}](${localizedSpeciesUrl(locale, href)})`;
      }
      return label;
    },
  );
}

function alternateLine(locale: AppLocale, href: string) {
  return locale === routing.defaultLocale
    ? `- EN: ${href}`
    : `- Georgian (canonical): ${href}`;
}

function alternateLocale(locale: AppLocale): AppLocale {
  return locale === routing.defaultLocale ? "en" : routing.defaultLocale;
}

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function comparisonOnlyLookalikes(item: Species, catalog: LlmsSpecies) {
  const english = catalog.localized(item, "en");
  const prose = [item, english]
    .flatMap((text) => [
      text.overview,
      text.description,
      text.habitat,
      text.diet,
      text.behavior,
      text.conservation,
      text.interaction ?? "",
      ...text.facts,
    ])
    .join("\n");
  const byId = new Map(catalog.base.map((peer) => [peer.id, peer]));
  return (byId.get(item.id)?.lookalikes ?? [])
    .map((id) => byId.get(id))
    .filter((peer): peer is CatalogFullSpecies => Boolean(peer))
    .filter(
      (peer) =>
        !prose.includes(`](${peer.id})`) &&
        !prose.includes(peer.scientificName),
    )
    .map((peer) => peer.scientificName);
}

function englishSpeciesText(item: Species, catalog: LlmsSpecies) {
  const english = catalog.localized(item, "en");
  const name = english.commonName.trim();
  const summary = compactText(english.overview || english.description);
  const kaSummary = compactText(item.overview || item.description);
  return {
    name: name && name !== item.commonName ? name : "",
    summary: summary && summary !== kaSummary ? summary : "",
  };
}

function formatSpeciesCard(
  item: Species,
  locale: AppLocale,
  catalog: LlmsSpecies,
) {
  const group = getSpeciesAtlasMeta(item.id).group;
  const deep = DEEP_GROUPS.has(group);
  const maxOverview = deep ? MAX_OVERVIEW_FULL : MAX_OVERVIEW_COMPACT;
  const canonical = locale === routing.defaultLocale;
  const text = catalog.localized(item, locale);
  const translated = (value: string, kaValues: string[]) =>
    canonical || (!kaValues.includes(value) && !GEORGIAN_SCRIPT.test(value));
  const english = englishSpeciesText(item, catalog);
  const name = translated(text.commonName, [item.commonName])
    ? text.commonName
    : item.commonName;
  const lines: string[] = [
    `### ${item.scientificName} — ${name}`,
    "",
    `- URL: ${localizedSpeciesUrl(locale, item.id)}`,
    alternateLine(
      locale,
      localizedSpeciesUrl(alternateLocale(locale), item.id),
    ),
    `- Catalog id: ${item.id}`,
    `- Updated: ${catalog.localized(item, locale).updatedAt}`,
  ];

  if (canonical && english.name) lines.push(`- English name: ${english.name}`);
  if (item.danger) lines.push(`- Risk to humans: ${item.danger}`);
  lines.push(`- Family: ${item.family}`);

  const overview = compactText(text.overview || text.description);
  if (
    overview &&
    translated(overview, [compactText(item.overview || item.description)])
  ) {
    lines.push("");
    lines.push(
      absoluteLinks(truncateText(overview, maxOverview), locale, catalog),
    );
  }

  if (canonical && english.summary) {
    lines.push("");
    lines.push(
      `English summary: ${absoluteLinks(truncateText(english.summary, maxOverview), "en", catalog)}`,
    );
  }

  if (deep)
    lines.push(
      ...formatSpeciesDetails(item, text, translated, locale, catalog),
    );

  const sources = pickSources(
    item.sources,
    deep ? MAX_SOURCES_FULL : MAX_SOURCES_COMPACT,
  );
  if (sources.length > 0) {
    const lookalikes = comparisonOnlyLookalikes(item, catalog);
    lines.push("");
    lines.push("Sources:");
    for (const source of sources) {
      const sourceName = labelLookalikeSource(source.name, item, lookalikes);
      lines.push(
        source.url ? `- ${sourceName}: ${source.url}` : `- ${sourceName}`,
      );
    }
  }

  lines.push("");
  return lines.join("\n");
}

function formatSpeciesDetails(
  item: Species,
  text: Species,
  translated: (value: string, kaValues: string[]) => boolean,
  locale: AppLocale,
  catalog: LlmsSpecies,
) {
  const lines: string[] = [];
  const kaStats = item.stats.map((stat) => `${stat.label}: ${stat.value}`);
  const stats = text.stats
    .filter((stat) => stat.label && stat.value)
    .map((stat) => `${stat.label}: ${stat.value}`)
    .filter((stat) => translated(stat, kaStats))
    .slice(0, 6);
  if (stats.length > 0) {
    lines.push("", "Facts:", ...stats.map((stat) => `- ${stat}`));
  }

  const facts = text.facts
    .filter((fact) => fact && translated(fact, item.facts))
    .slice(0, MAX_FACTS_PER_SPECIES);
  if (facts.length > 0) {
    lines.push("");
    for (const fact of facts) {
      lines.push(
        `- ${absoluteLinks(truncateText(compactText(fact), MAX_OVERVIEW_COMPACT), locale, catalog)}`,
      );
    }
  }

  const identification = text.identification?.summary ?? "";
  if (
    identification &&
    translated(identification, [item.identification?.summary ?? ""])
  ) {
    lines.push(
      "",
      `Identification: ${absoluteLinks(truncateText(compactText(identification), MAX_OVERVIEW_COMPACT), locale, catalog)}`,
    );
  }

  const kaFaq = (item.faq ?? []).map(
    (entry) => `${entry.question} ${entry.answer}`,
  );
  const faqs = (text.faq ?? [])
    .filter((entry) => translated(`${entry.question} ${entry.answer}`, kaFaq))
    .slice(0, MAX_FAQS_PER_SPECIES);
  if (faqs.length > 0) {
    lines.push("", "FAQ:");
    for (const entry of faqs) {
      lines.push(
        `- Q: ${absoluteLinks(compactText(entry.question), locale, catalog)}`,
      );
      lines.push(
        `  A: ${absoluteLinks(truncateText(compactText(entry.answer), MAX_OVERVIEW_COMPACT), locale, catalog)}`,
      );
    }
  }
  return lines;
}

function formatSpeciesIndexLine(
  item: Species,
  locale: AppLocale,
  catalog: LlmsSpecies,
) {
  const named = catalog.localized(item, proseLocale(locale));
  const details = [
    named.commonName || item.commonName,
    item.danger,
    `Catalog id \`${item.id}\``,
  ].filter(Boolean);
  return `- [${item.scientificName}](${localizedSpeciesUrl(locale, item.id)}): ${details.join(". ")}.`;
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

function isDoiUrl(url: string | undefined) {
  if (!url || !URL.canParse(url)) return false;
  const host = new URL(url).hostname.toLowerCase();
  return host === "doi.org" || host.endsWith(".doi.org");
}

function labelLookalikeSource(
  name: string,
  item: Species,
  lookalikes: string[],
) {
  if (name.includes(item.scientificName) || name.includes(item.genus)) {
    return name;
  }
  const peer = lookalikes.find((scientificName) =>
    name.includes(scientificName),
  );
  return peer ? `${name} (lookalike source: ${peer})` : name;
}

function languageSection() {
  return [
    "## Languages",
    "",
    ...routing.locales.map(
      (locale) =>
        `- ${LOCALE_LABEL[locale]} (\`${locale}\`): [home](${pageUrl(locale, "/")}), [llms.txt](${absoluteUrl(llmsIndexPath(locale))}), [llms-full.txt](${absoluteUrl(llmsFullPath(locale))})`,
    ),
    "",
  ];
}

function localizedLinkPath(locale: AppLocale, path: string) {
  const species = path.match(/^\/([a-z]+)\/([^/]+)$/);
  if (species && species[1] in GROUP_HUBS) {
    const id = resolveSpeciesIdInHub(species[1] as GroupHubId, species[2]);
    if (id) return new URL(localizedSpeciesUrl(locale, id)).pathname;
  }
  return localizedPath(locale, path);
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

function pageUrl(locale: AppLocale, path: string) {
  return absoluteUrl(localizedPath(locale, path));
}

function pickSources(sources: Species["sources"], limit: number) {
  const ranked = sources.slice().sort((a, b) => {
    return sourceRank(a) - sourceRank(b);
  });
  return ranked.slice(0, limit);
}

function proseLocale(locale: AppLocale): AppLocale {
  return locale === routing.defaultLocale ? "en" : locale;
}

function quizUrl(locale: AppLocale, id: string) {
  return absoluteUrl(
    withLocalePrefix(locale, `/quiz/${quizHref(id, locale).params.slug}`),
  );
}

function sortSpecies(items: readonly Species[]) {
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
  if (isDoiUrl(source.url) || hay.includes("10.3897")) return 0;
  if (hay.includes("iucn")) return 1;
  if (hay.includes("tarkhnishvili") || hay.includes("checklist")) return 2;
  if (source.url) return 3;
  return 4;
}

const SENTENCE_END =
  /(?<![\s(.][A-Za-z]|\b(?:al|approx|ca|cf|e\.g|i\.e|sp|spp|ssp|subsp|var|vs))[.!?](?=["”»)]?(?:\s|$))/g;

const MIN_SENTENCE_CUT = 60;

const SENTENCE_OVERRUN = 1.5;

function truncateText(value: string, max: number) {
  if (value.length <= max) return value;
  let lastWithin = -1;
  let firstAfter = -1;
  for (const match of value.matchAll(SENTENCE_END)) {
    const end = match.index + 1;
    if (end <= max) {
      lastWithin = end;
    } else {
      firstAfter = end;
      break;
    }
  }
  if (lastWithin >= Math.min(MIN_SENTENCE_CUT, max / 2)) {
    return value.slice(0, lastWithin);
  }
  if (firstAfter !== -1 && firstAfter <= max * SENTENCE_OVERRUN) {
    return value.slice(0, firstAfter);
  }
  if (lastWithin > 0) return value.slice(0, lastWithin);
  const slice = value.slice(0, max - 1);
  const at = slice.lastIndexOf(" ");
  return `${(at > 40 ? slice.slice(0, at) : slice).trimEnd()}…`;
}

function withLocalePrefix(locale: AppLocale, path: string) {
  if (locale === routing.defaultLocale) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
