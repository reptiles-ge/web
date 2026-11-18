import { z } from "zod";

import { defaultLocale, locales } from "@/i18n/locales";
import { ANIMAL_GROUPS } from "@/lib/animalGroups";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import { REGION_IDS } from "../lib/catalogFilter";
import { speciesIdText } from "./common";
import { HABITATS } from "./speciesRecord";

const MAX_SPECIES_RESULTS = 50;

const MAX_NEWS_RESULTS = 20;

const DEFAULT_RESULTS = 10;

export const mcpMessage = z.object({
  id: z.union([z.string().max(200), z.number().int()]).optional(),
  jsonrpc: z.literal("2.0"),
  method: z.string().min(1).max(100),
  params: z.record(z.string(), z.unknown()).optional(),
});

export const mcpProtocolHeader = z.object({
  "mcp-protocol-version": z.string().max(40).optional(),
});

export const mcpToolCallParams = z.object({
  arguments: z.record(z.string(), z.unknown()).optional(),
  name: z.string().min(1).max(100),
});

const locale = z
  .enum(locales)
  .default(defaultLocale)
  .describe(
    "Language of the answer: ka (Georgian, canonical), en, ru or tr. Use the user's language.",
  );

const query = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .optional()
  .describe(
    "Words to find in the common name (any of the four languages), scientific name, genus, family or distribution text.",
  );

export const searchSpeciesArgs = z
  .object({
    danger: z
      .enum(["harmless", "venomous"])
      .optional()
      .describe(
        "Only harmless or only venomous species, in groups where venom applies.",
      ),
    group: z.enum(ANIMAL_GROUPS).optional().describe("Only this animal group."),
    habitat: z.enum(HABITATS).optional().describe("Only this habitat."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(MAX_SPECIES_RESULTS)
      .default(DEFAULT_RESULTS)
      .describe("How many species to return."),
    locale,
    offset: z
      .number()
      .int()
      .min(0)
      .default(0)
      .describe("Skip this many results (use nextOffset from the last call)."),
    query,
    region: z
      .enum(REGION_IDS as [string, ...string[]])
      .optional()
      .describe(
        "Only species recorded in this region of Georgia. A species is listed only where a source names the region.",
      ),
  })
  .strict();

export const getSpeciesArgs = z
  .object({
    id: speciesIdText.describe(
      "Species id from search_species (for example macrovipera-lebetina). The Georgian slug (giurza) works too.",
    ),
    locale,
  })
  .strict();

export const searchNewsArgs = z
  .object({
    hub: z
      .enum(Object.keys(GROUP_HUBS) as [GroupHubId, ...GroupHubId[]])
      .optional()
      .describe("Only articles about this animal group."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(MAX_NEWS_RESULTS)
      .default(DEFAULT_RESULTS)
      .describe("How many articles to return."),
    locale,
    page: z.number().int().min(1).default(1).describe("Page number, from 1."),
    query: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .describe("Words to find in the title, summary or lead."),
    region: speciesIdText
      .optional()
      .describe("Only articles about this region id (for example kakheti)."),
    species: speciesIdText
      .optional()
      .describe("Only articles about this species id."),
  })
  .strict();

export const getNewsArgs = z
  .object({
    locale,
    slug: speciesIdText.describe("Article slug from search_news."),
  })
  .strict();
