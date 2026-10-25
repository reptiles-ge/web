import type { ApiBindings } from "../env";

import { purgeApiCache } from "./cachePurge";
import { ApiError } from "./errors";

const MAX_TAGS_PER_REQUEST = 20;

const ALL_API_TAGS = ["species", "catalog", "images", "news", "authors"];

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
  return clearCaches(env, [`author:${id}`], { tags: [`author:${id}`] });
}

export function revalidateNewsArticle(env: ApiBindings, slug: string) {
  return clearCaches(env, [`news:${slug}`], { tags: [`news:${slug}`] });
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

export async function revalidateSpeciesSite(env: ApiBindings, ids: string[]) {
  const purged = await purgeApiCache(env, ["species", "catalog", "images"]);
  const tags = ["species", ...ids.map((id) => `species:${id}`)];
  for (let start = 0; start < tags.length; start += MAX_TAGS_PER_REQUEST) {
    const ok = await revalidateSite(env, {
      tags: tags.slice(start, start + MAX_TAGS_PER_REQUEST),
    });
    if (!ok) return false;
  }
  return purged !== "failed";
}

function clearCaches(
  env: ApiBindings,
  apiTags: string[],
  payload: { groups: string[] } | { tags: string[] },
) {
  return purgeApiCache(env, apiTags).then(
    async (purged) =>
      (await revalidateSite(env, payload)) && purged !== "failed",
  );
}

async function revalidateSite(
  env: ApiBindings,
  payload: { groups: string[] } | { tags: string[] },
) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return false;
  }
  try {
    const response = await env.SITE.fetch(
      new Request("https://reptiles.ge/api/revalidate", {
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
