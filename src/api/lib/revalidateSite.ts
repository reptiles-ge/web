import type { ApiBindings } from "../env";

const MAX_TAGS_PER_REQUEST = 20;

export function revalidateNewsPages(env: ApiBindings, slug: string) {
  return revalidateSite(env, ["news", `news:${slug}`]);
}

export async function revalidateSpeciesSite(env: ApiBindings, ids: string[]) {
  const tags = ["species", ...ids.map((id) => `species:${id}`)];
  for (let start = 0; start < tags.length; start += MAX_TAGS_PER_REQUEST) {
    const ok = await revalidateSite(
      env,
      tags.slice(start, start + MAX_TAGS_PER_REQUEST),
    );
    if (!ok) return false;
  }
  return true;
}

async function revalidateSite(env: ApiBindings, tags: string[]) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return false;
  }
  try {
    const response = await env.SITE.fetch(
      new Request("https://reptiles.ge/api/revalidate", {
        body: JSON.stringify({ tags }),
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
