import { z } from "zod";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { SpeciesSummary } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { defaultLocale } from "@/i18n/locales";
import { pathnames } from "@/i18n/pathnames";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUBS } from "@/lib/groupHubs";

import type { ApiDatabase } from "../db/database";

import { getPublishedNews, listPublishedNews } from "../db/newsView";
import {
  findPublishedSpeciesSlugs,
  getPublishedSpeciesPage,
} from "../db/species";
import { readLocalizedCatalog } from "../db/speciesCatalogView";
import {
  getNewsArgs,
  getSpeciesArgs,
  searchNewsArgs,
  searchSpeciesArgs,
} from "../schemas/mcp";
import { filterCatalog, sortCatalog } from "./catalogFilter";
import { SITE_ORIGIN } from "./origins";

export type McpTool = {
  description: string;
  inputSchema: Record<string, unknown>;
  name: string;
  run: (db: ApiDatabase, args: unknown) => Promise<McpToolOutcome>;
  title: string;
};

type CardEntry = SpeciesSummary & {
  checklistStatus: null | string;
  group: AnimalGroup;
  slug: string;
};

type LocalizedPath = keyof typeof pathnames;

type McpToolOutcome =
  | { data: Record<string, unknown>; kind: "found" }
  | { issues: z.core.$ZodIssue[]; kind: "invalid" }
  | { kind: "missing"; message: string };

type ToolSpec<S extends z.ZodType> = {
  description: string;
  input: S;
  name: string;
  run: (db: ApiDatabase, args: z.output<S>) => Promise<McpToolOutcome>;
  title: string;
};

export function speciesPageUrl(
  group: AnimalGroup,
  slug: string,
  locale: AppLocale,
) {
  const hub = GROUP_HUBS[ANIMAL_GROUP_TO_HUB[group]];
  return sitePageUrl(`${hub.path}/[slug]` as LocalizedPath, locale, slug);
}

function defineTool<S extends z.ZodType>(spec: ToolSpec<S>): McpTool {
  const { $schema: _ignored, ...inputSchema } = z.toJSONSchema(spec.input, {
    io: "input",
  });
  return {
    description: spec.description,
    inputSchema,
    name: spec.name,
    run: (db, args) => {
      const parsed = spec.input.safeParse(args ?? {});
      return parsed.success
        ? spec.run(db, parsed.data)
        : Promise.resolve({ issues: parsed.error.issues, kind: "invalid" });
    },
    title: spec.title,
  };
}

function sitePageUrl(path: LocalizedPath, locale: AppLocale, slug?: string) {
  const entry = pathnames[path];
  const localized = typeof entry === "string" ? entry : entry[locale];
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${SITE_ORIGIN}${prefix}${slug ? localized.replace("[slug]", slug) : localized}`;
}

function speciesCard(entry: CardEntry, locale: AppLocale) {
  return {
    checklistStatus: entry.checklistStatus,
    commonName: entry.commonName,
    danger: entry.danger ?? null,
    description: entry.description,
    family: entry.family,
    group: entry.group,
    id: entry.id,
    location: entry.location,
    scientificName: entry.scientificName,
    url: speciesPageUrl(entry.group, entry.slug, locale),
  };
}

export const MCP_TOOLS: McpTool[] = [
  defineTool({
    description:
      "Find species in the Reptiles.ge atlas of animals of Georgia (the country in the Caucasus) by name or by group, region, habitat and danger. Returns short cards with the species id for get_species. Lists only published atlas profiles, not a complete list of Georgia's fauna.",
    input: searchSpeciesArgs,
    name: "search_species",
    run: async (db, { limit, locale, offset, query, ...filters }) => {
      const rows = await readLocalizedCatalog(db, locale, "card");
      const entries = new Map(
        rows.map((row) => [row.index.id, row.entry as unknown as CardEntry]),
      );
      const matches = sortCatalog(
        filterCatalog(
          rows.map((row) => row.index),
          { ...filters, q: query },
        ),
        "catalog",
        locale,
      );
      const end = offset + limit;
      return {
        data: {
          locale,
          nextOffset: end < matches.length ? end : null,
          results: matches
            .slice(offset, end)
            .map((match) => speciesCard(entries.get(match.id)!, locale)),
          total: matches.length,
        },
        kind: "found",
      };
    },
    title: "Search species",
  }),
  defineTool({
    description:
      "Full profile of one species: names, taxonomy, description, identification, habitat, diet, behaviour, distribution in Georgia, conservation status, danger to people, lookalikes, facts, FAQ and sources. Text links are [label](target), where a target is a species id, a Reptiles.ge path or a URL.",
    input: getSpeciesArgs,
    name: "get_species",
    run: async (db, { id, locale }) => {
      const slugs = await findPublishedSpeciesSlugs(db, id);
      const found = slugs
        ? await getPublishedSpeciesPage(
            db,
            locale === "ka" ? slugs.kaSlug : slugs.id,
            locale,
          )
        : null;
      if (!found) {
        return {
          kind: "missing",
          message: `No published species "${id}". Use search_species to find the id.`,
        };
      }
      const {
        audio: _audio,
        gallery,
        mobileImage: _mobileImage,
        mobileImageCredit: _mobileImageCredit,
        ...profile
      } = found.data;
      return {
        data: {
          ...profile,
          locale,
          photoCount: gallery.length,
          url: speciesPageUrl(profile.group, profile.slug, locale),
        },
        kind: "found",
      };
    },
    title: "Get species profile",
  }),
  defineTool({
    description:
      "Find Reptiles.ge news articles (field finds, research, atlas updates), newest first. Filter by words, animal group, region or species id.",
    input: searchNewsArgs,
    name: "search_news",
    run: async (db, { limit, locale, page, query, ...filters }) => {
      const result = await listPublishedNews(
        db,
        locale,
        { ...filters, q: query },
        { limit, page },
      );
      return {
        data: {
          locale,
          page: result.page,
          pageCount: result.pageCount,
          results: result.data.map((article) => ({
            dek: article.dek,
            publishedAt: article.publishedAt,
            relatedSpeciesIds: article.relatedSpeciesIds,
            slug: article.slug,
            title: article.title,
            url: sitePageUrl("/news/[slug]", locale, article.slug),
          })),
          total: result.total,
        },
        kind: "found",
      };
    },
    title: "Search news",
  }),
  defineTool({
    description:
      "One Reptiles.ge news article with its sections and sources. Falls back to Georgian when the article has no translation in the requested language.",
    input: getNewsArgs,
    name: "get_news",
    run: async (db, { locale, slug }) => {
      const found = await getPublishedNews(db, slug, locale);
      if (!found) {
        return {
          kind: "missing",
          message: `No published article "${slug}". Use search_news to find the slug.`,
        };
      }
      return {
        data: {
          ...found.data,
          locale: found.locale,
          url: sitePageUrl("/news/[slug]", found.locale, slug),
        },
        kind: "found",
      };
    },
    title: "Get news article",
  }),
];
