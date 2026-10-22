import { Hono } from "hono";
import { cors } from "hono/cors";
import { timingSafeEqual } from "hono/utils/buffer";

import type { AppLocale } from "@/i18n/routing";

import { getCatalogSpecies } from "@/data/species";
import { type AnimalGroup, speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies, speciesUpdatedAt } from "@/i18n/localizeSpecies";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import {
  type ApiDatabase,
  insertRating,
  parseRating,
  ratingSummary,
} from "./ratings";

export const API_LOCALES = [
  "ka",
  "en",
  "ru",
  "tr",
] as const satisfies readonly AppLocale[];

const ANIMAL_GROUPS = new Set<AnimalGroup>([
  "amphibian",
  "bird",
  "insect",
  "lizard",
  "mammal",
  "scorpion",
  "snake",
  "spider",
  "turtle",
]);

const CACHE_CONTROL = "public, max-age=300, s-maxage=3600";

const SUMMARY_DEFAULT_DAYS = 30;

const SUMMARY_MAX_DAYS = 365;

const DAY_MS = 86_400_000;

export function listSpecies(locale: AppLocale, group?: AnimalGroup) {
  return getCatalogSpecies()
    .filter((item) => !group || speciesAtlasMeta[item.id]?.group === group)
    .map((item) => {
      const localized = localizeSpecies(item, locale);
      return {
        commonName: localized.commonName,
        danger: localized.danger ?? null,
        group: speciesAtlasMeta[item.id]?.group ?? null,
        id: item.id,
        image: localized.image,
        scientificName: localized.scientificName,
        slug: getSpeciesPublicSlug(item.id, locale),
        updatedAt: speciesUpdatedAt(item, locale),
      };
    });
}

function isAnimalGroup(value: string): value is AnimalGroup {
  return ANIMAL_GROUPS.has(value as AnimalGroup);
}

function isApiLocale(value: string): value is AppLocale {
  return (API_LOCALES as readonly string[]).includes(value);
}

const app = new Hono<{
  Bindings: { API_WRITE_TOKEN?: string; DB: ApiDatabase };
}>();

const invalidLocale = { error: "invalid_locale", expected: API_LOCALES };

app.use("*", cors({ allowMethods: ["GET", "OPTIONS"], origin: "*" }));

app.use("*", async (c, next) => {
  await next();
  c.header("X-Robots-Tag", "noindex");
});

app.use("/v1/ratings/*", async (c, next) => {
  const token = c.env.API_WRITE_TOKEN;
  const header = c.req.header("Authorization") ?? "";
  if (!token || !(await timingSafeEqual(header, `Bearer ${token}`))) {
    return c.json({ error: "unauthorized" }, { status: 401 });
  }
  await next();
});

app.post("/v1/ratings", async (c) => {
  const body: unknown = await c.req.json().catch(() => null);
  const rating = parseRating(body, API_LOCALES);
  if (!rating) return c.json({ error: "invalid_rating" }, { status: 400 });
  await insertRating(c.env.DB, rating);
  return c.body(null, 201);
});

app.get("/v1/ratings/summary", async (c) => {
  const days = Number(c.req.query("days") ?? SUMMARY_DEFAULT_DAYS);
  if (!Number.isInteger(days) || days < 1 || days > SUMMARY_MAX_DAYS) {
    return c.json(
      { error: "invalid_days", max: SUMMARY_MAX_DAYS },
      { status: 400 },
    );
  }
  const since = new Date(Date.now() - days * DAY_MS).toISOString();
  c.header("Cache-Control", "no-store");
  return c.json({ data: await ratingSummary(c.env.DB, since) });
});

app.get("/v1/species", (c) => {
  const locale = c.req.query("locale") ?? "ka";
  const group = c.req.query("group");
  if (!isApiLocale(locale)) return c.json(invalidLocale, { status: 400 });
  if (group !== undefined && !isAnimalGroup(group)) {
    return c.json(
      { error: "invalid_group", expected: [...ANIMAL_GROUPS] },
      { status: 400 },
    );
  }
  const data = listSpecies(locale, group);
  c.header("Cache-Control", CACHE_CONTROL);
  return c.json({ data, locale, total: data.length });
});

app.notFound((c) => c.json({ error: "not_found" }, { status: 404 }));

export default app;
