import type { ApiBindings } from "../env";

import { ApiError } from "./errors";

const MAX_TAGS_PER_REQUEST = 20;

export async function ensureSiteRevalidated(pending: Promise<boolean>) {
  if (!(await pending)) {
    throw new ApiError(
      502,
      "site_unavailable",
      "The site could not be revalidated",
    );
  }
}

export function revalidateAuthorPages(env: ApiBindings, id: string) {
  return revalidateSite(env, {
    tags: ["authors", `author:${id}`, "species", "news"],
  });
}

export function revalidateAuthorsSection(env: ApiBindings) {
  return revalidateSite(env, { tags: ["authors"] });
}

export function revalidateContributorPage(env: ApiBindings, id: string) {
  return revalidateSite(env, { tags: [`author:${id}`] });
}

export function revalidateNewsArticle(env: ApiBindings, slug: string) {
  return revalidateSite(env, { tags: [`news:${slug}`] });
}

export function revalidateNewsPages(env: ApiBindings, slug: string) {
  return revalidateSite(env, { tags: ["news", `news:${slug}`] });
}

export function revalidateNewsSection(env: ApiBindings) {
  return revalidateSite(env, { tags: ["news"] });
}

export function revalidatePageGroup(env: ApiBindings, id: string) {
  return revalidateSite(env, { groups: [id] });
}

export function revalidateSpeciesPage(env: ApiBindings, id: string) {
  return revalidateSite(env, { tags: [`species:${id}`] });
}

export async function revalidateSpeciesSite(env: ApiBindings, ids: string[]) {
  const tags = ["species", ...ids.map((id) => `species:${id}`)];
  for (let start = 0; start < tags.length; start += MAX_TAGS_PER_REQUEST) {
    const ok = await revalidateSite(env, {
      tags: tags.slice(start, start + MAX_TAGS_PER_REQUEST),
    });
    if (!ok) return false;
  }
  return true;
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
