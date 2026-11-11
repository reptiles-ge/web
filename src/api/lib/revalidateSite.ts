import type { ApiBindings } from "../env";

import { purgeApiCache } from "./cachePurge";
import { ApiError } from "./errors";
import { type Defer, requestFullSiteWarm, warmSitePaths } from "./siteWarm";

const MAX_TAGS_PER_REQUEST = 20;

const ALL_API_TAGS = ["species", "catalog", "images", "news", "authors"];

type SitePayload = { groups: string[] } | { tags: string[] };

type Warm = { defer: Defer; scope: "full" | "paths" };

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

export function revalidateAuthorPages(
  env: ApiBindings,
  id: string,
  defer?: Defer,
) {
  const tags = ["authors", `author:${id}`, "species", "news"];
  return clearCaches(env, [...tags, "catalog"], { tags }, full(defer));
}

export function revalidateAuthorsSection(env: ApiBindings, defer?: Defer) {
  return clearCaches(env, ["authors"], { tags: ["authors"] }, full(defer));
}

export function revalidateContributorPage(
  env: ApiBindings,
  id: string,
  defer?: Defer,
) {
  const tags = [`author:${id}`];
  return clearCaches(env, tags, { tags }, paths(defer));
}

export function revalidateNewsArticle(
  env: ApiBindings,
  slug: string,
  defer?: Defer,
) {
  const tags = [`news:${slug}`];
  return clearCaches(env, tags, { tags }, paths(defer));
}

export function revalidateNewsPages(
  env: ApiBindings,
  slug: string,
  defer?: Defer,
) {
  const tags = ["news", `news:${slug}`];
  return clearCaches(env, tags, { tags }, paths(defer));
}

export function revalidateNewsSection(env: ApiBindings, defer?: Defer) {
  return clearCaches(env, ["news"], { tags: ["news"] }, full(defer));
}

export function revalidatePageGroup(
  env: ApiBindings,
  id: string,
  defer?: Defer,
) {
  return clearCaches(
    env,
    PAGE_GROUP_API_TAGS[id] ?? [],
    { groups: [id] },
    full(defer),
  );
}

export function revalidateSpeciesPage(
  env: ApiBindings,
  id: string,
  defer?: Defer,
) {
  return clearCaches(
    env,
    [`species:${id}`, "catalog", "images"],
    { tags: ["species", `species:${id}`] },
    paths(defer),
  );
}

export async function revalidateSpeciesSite(
  env: ApiBindings,
  ids: string[],
  defer?: Defer,
) {
  const purged = await purgeApiCache(env, ["species", "catalog", "images"]);
  const tags = ["species", ...ids.map((id) => `species:${id}`)];
  for (let start = 0; start < tags.length; start += MAX_TAGS_PER_REQUEST) {
    const warmPaths = await revalidateSite(env, {
      tags: tags.slice(start, start + MAX_TAGS_PER_REQUEST),
    });
    if (!warmPaths) return false;
  }
  defer?.(requestFullSiteWarm(env));
  return purged !== "failed";
}

function clearCaches(
  env: ApiBindings,
  apiTags: string[],
  payload: SitePayload,
  warm?: Warm,
) {
  return purgeApiCache(env, apiTags).then(async (purged) => {
    const warmPaths = await revalidateSite(env, payload);
    if (!warmPaths) return false;
    if (warm?.scope === "full") warm.defer(requestFullSiteWarm(env));
    if (warm?.scope === "paths" && warmPaths.length > 0) {
      warm.defer(warmSitePaths(env, warmPaths));
    }
    return purged !== "failed";
  });
}

function full(defer?: Defer): undefined | Warm {
  return defer && { defer, scope: "full" };
}

function paths(defer?: Defer): undefined | Warm {
  return defer && { defer, scope: "paths" };
}

async function revalidateSite(env: ApiBindings, payload: SitePayload) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return null;
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
      return null;
    }
    return await warmPathsOf(response);
  } catch (error) {
    console.error("Site revalidation failed", error);
    return null;
  }
}

async function warmPathsOf(response: Response) {
  const body = (await response.json().catch(() => null)) as null | {
    warm?: unknown;
  };
  const warm = body?.warm;
  return Array.isArray(warm)
    ? warm.filter(
        (path): path is string =>
          typeof path === "string" && path.startsWith("/"),
      )
    : [];
}
