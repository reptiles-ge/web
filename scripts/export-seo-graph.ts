import fs from "node:fs";
import path from "node:path";

import { getPublishedCreditAuthors } from "../src/data/creditAuthors";
import { GUIDE_ARTICLE_PATHS } from "../src/data/guideArticlePaths";
import {
  getNewsArticleLocales,
  getPublishedNewsArticles,
} from "../src/data/news";
import { regions } from "../src/data/regions";
import { getCatalogSpecies } from "../src/data/species";
import { type AppLocale, routing } from "../src/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "../src/lib/clusterGuides";
import {
  creditAuthorAlternates,
  creditAuthorUrl,
} from "../src/lib/creditAuthors";
import { GROUP_HUB_LIST } from "../src/lib/groupHubs";
import {
  newsArticleAlternates,
  newsArticleUrl,
  newsIndexAlternates,
} from "../src/lib/news";
import { liveQuizzes } from "../src/lib/quizzes";
import {
  localeAlternates,
  localePath,
  quizAlternates,
  quizPageUrl,
  speciesAlternates,
} from "../src/lib/site";
import { regionHref } from "../src/lib/speciesRoutes";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://reptiles.ge";

const repoRoot = process.cwd();
const outFile = path.join(repoRoot, ".seo/graph.json");

type RouteInput = {
  allowOrphan?: boolean;
  alternates: Record<string, string>;
  canonicalUrl: string;
  inSitemap?: boolean;
  locale: AppLocale;
  path: string;
  type: RouteType;
};

type RouteType =
  | "author"
  | "guide"
  | "home"
  | "hub"
  | "legal"
  | "news"
  | "quiz"
  | "region"
  | "species"
  | "static";

const routes = new Map<string, RouteInput>();

function addAuthors() {
  for (const author of getPublishedCreditAuthors()) {
    for (const locale of routing.locales) {
      const { canonical, languages } = creditAuthorAlternates(
        locale,
        author.slug,
      );
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: new URL(creditAuthorUrl(locale, author.slug)).pathname,
        type: "author",
      });
    }
  }
}

function addGuides() {
  const guidePaths = [
    ...CLUSTER_GUIDE_LIST.map((guide) => guide.pathname),
    ...GUIDE_ARTICLE_PATHS,
  ];
  for (const pathname of guidePaths) {
    for (const locale of routing.locales) {
      const { canonical, languages } = localeAlternates(locale, pathname);
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: localePath(locale, pathname),
        type: "guide",
      });
    }
  }
}

function addHubs() {
  for (const hub of GROUP_HUB_LIST) {
    for (const locale of routing.locales) {
      const { canonical, languages } = localeAlternates(locale, hub.path);
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: localePath(locale, hub.path),
        type: "hub",
      });
    }
  }
}

function addLocalizedStatic() {
  const items: Array<{
    allowOrphan?: boolean;
    href: Parameters<typeof localePath>[1];
    inSitemap?: boolean;
    type: RouteType;
  }> = [
    { allowOrphan: true, href: "/", type: "home" },
    { href: "/about", type: "static" },
    { href: "/contact", type: "static" },
    { href: "/authors", type: "static" },
    { href: "/news", type: "news" },
    { href: "/privacy", inSitemap: false, type: "legal" },
    { href: "/quiz", type: "quiz" },
    { href: "/regions", type: "region" },
    { href: "/risk-to-humans", type: "static" },
    { href: "/snakes-in-the-yard", type: "guide" },
    { href: "/species", type: "static" },
    { href: "/terms-and-conditions", inSitemap: false, type: "legal" },
    { href: "/venomous-snakes", type: "guide" },
  ];

  for (const item of items) {
    for (const locale of routing.locales) {
      const { canonical, languages } = localeAlternates(locale, item.href);
      addRoute({
        allowOrphan: item.allowOrphan,
        alternates: languages,
        canonicalUrl: canonical,
        inSitemap: item.inSitemap ?? true,
        locale,
        path: localePath(locale, item.href),
        type: item.type,
      });
    }
  }
}

function addNews() {
  for (const locale of routing.locales) {
    const { canonical, languages } = newsIndexAlternates(locale);
    addRoute({
      alternates: languages,
      canonicalUrl: canonical,
      locale,
      path: localePath(locale, "/news"),
      type: "news",
    });
  }

  for (const article of getPublishedNewsArticles()) {
    for (const locale of getNewsArticleLocales(article)) {
      const { canonical, languages } = newsArticleAlternates(
        locale,
        article.slug,
      );
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: new URL(newsArticleUrl(locale, article.slug)).pathname,
        type: "news",
      });
    }
  }
}

function addQuizzes() {
  for (const quiz of liveQuizzes()) {
    for (const locale of routing.locales) {
      const { canonical, languages } = quizAlternates(locale, quiz.id);
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: new URL(quizPageUrl(locale, quiz.id)).pathname,
        type: "quiz",
      });
    }
  }
}

function addRegions() {
  for (const region of regions) {
    for (const locale of routing.locales) {
      const href = regionHref(region.id);
      const { canonical, languages } = localeAlternates(locale, href);
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: localePath(locale, href),
        type: "region",
      });
    }
  }
}

function addRoute(input: RouteInput) {
  const path = normalizePath(input.path);
  const key = `${input.locale}:${path}`;
  if (routes.has(key)) return;
  routes.set(key, {
    ...input,
    allowOrphan: input.allowOrphan ?? false,
    inSitemap: input.inSitemap ?? true,
    path,
  });
}

function addSpecies() {
  for (const item of getCatalogSpecies()) {
    for (const locale of routing.locales) {
      const { canonical, languages } = speciesAlternates(locale, item.id);
      addRoute({
        alternates: languages,
        canonicalUrl: canonical,
        locale,
        path: new URL(canonical).pathname,
        type: "species",
      });
    }
  }
}

function main() {
  addLocalizedStatic();
  addHubs();
  addGuides();
  addRegions();
  addSpecies();
  addAuthors();
  addNews();
  addQuizzes();

  const graph = {
    defaultLocale: routing.defaultLocale,
    generatedAt: new Date().toISOString(),
    locales: routing.locales,
    productionOrigin: "https://reptiles.ge",
    routes: [...routes.values()].sort(
      (a, b) =>
        a.path.localeCompare(b.path) || a.locale.localeCompare(b.locale),
    ),
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(graph, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outFile}`);
}

function normalizePath(value: string) {
  return value.replace(/\/+$/, "") || "/";
}

main();
