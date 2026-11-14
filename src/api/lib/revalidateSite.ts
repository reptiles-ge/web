import type { ApiBindings } from "../env";

import { purgeApiCache } from "./cachePurge";
import { ApiError } from "./errors";

const MAX_TAGS_PER_REQUEST = 20;

const SITE_ORIGIN = "https://reptiles.ge";

const ALL_API_TAGS = ["species", "catalog", "images", "news", "authors"];

type SitePayload = { groups: string[] } | { tags: string[] };

const PAGE_GROUP_API_TAGS: Record<string, string[]> = {
  atlas: ["catalog"],
  contributors: ["authors"],
  home: ["catalog", "news", "authors"],
  news: ["news"],
  quizzes: ["catalog"],
  regions: ["catalog"],
  safety: ["catalog"],
  site: ALL_API_TAGS,
};

export async function ensureSiteRevalidated(pending: Promise<boolean>) {
  if (!(await pending)) {
    throw new ApiError(
      502,
      "site_unavailable",
      "The cache could not be cleared",
    );
  }
}

export function revalidateAuthorPages(env: ApiBindings, id: string) {
  const tags = ["authors", `author:${id}`, "species", "news"];
  return clearCaches(env, [...tags, "catalog"], { tags });
}

export function revalidateAuthorsSection(env: ApiBindings) {
  return clearCaches(env, ["authors"], { tags: ["authors"] });
}

export function revalidateContributorPage(env: ApiBindings, id: string) {
  const tags = [`author:${id}`];
  return clearCaches(env, tags, { tags });
}

export function revalidateMergedSpecies(env: ApiBindings, ids: string[]) {
  return clearSpecies(env, ids);
}

export function revalidateNewsArticle(env: ApiBindings, slug: string) {
  const tags = [`news:${slug}`];
  return clearCaches(env, tags, { tags });
}

export function revalidateNewsPages(env: ApiBindings, slug: string) {
  const tags = ["news", `news:${slug}`];
  return clearCaches(env, tags, { tags });
}

export function revalidateNewsSection(env: ApiBindings) {
  return clearCaches(env, ["news"], { tags: ["news"] });
}

export function revalidatePageGroup(env: ApiBindings, id: string) {
  return clearCaches(env, PAGE_GROUP_API_TAGS[id] ?? [], { groups: [id] });
}

export function revalidateSpeciesPage(env: ApiBindings, id: string) {
  return clearCaches(env, [`species:${id}`, "catalog", "images"], {
    tags: ["species", `species:${id}`],
  });
}

export function revalidateSpeciesSite(env: ApiBindings, ids: string[]) {
  return clearSpecies(env, ids);
}

function clearCaches(
  env: ApiBindings,
  apiTags: string[],
  payload: SitePayload,
) {
  return purgeApiCache(env, apiTags).then((purged) =>
    revalidateSite(env, payload).then(
      (revalidated) => revalidated && purged !== "failed",
    ),
  );
}

async function clearSpecies(env: ApiBindings, ids: string[]) {
  const purged = await purgeApiCache(env, ["species", "catalog", "images"]);
  const tags = ["species", ...ids.map((id) => `species:${id}`)];
  for (let start = 0; start < tags.length; start += MAX_TAGS_PER_REQUEST) {
    const revalidated = await revalidateSite(env, {
      tags: tags.slice(start, start + MAX_TAGS_PER_REQUEST),
    });
    if (!revalidated) return false;
  }
  return purged !== "failed";
}

async function revalidateSite(env: ApiBindings, payload: SitePayload) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return false;
  }
  try {
    const response = await env.SITE.fetch(
      new Request(`${SITE_ORIGIN}/api/revalidate`, {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${env.REVALIDATE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }),
    );
    if (!response.ok) {
      console.error(`Site revalidation answered ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error("Site revalidation failed", error);
    return false;
  }
}
