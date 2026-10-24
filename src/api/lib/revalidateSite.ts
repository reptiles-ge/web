import type { ApiBindings } from "../env";

export function revalidateAuthorPages(env: ApiBindings, id: string) {
  return revalidateSite(env, ["authors", `author:${id}`, "species", "news"]);
}

export function revalidateNewsPages(env: ApiBindings, slug: string) {
  return revalidateSite(env, ["news", `news:${slug}`]);
}

export function revalidateSpeciesPages(env: ApiBindings, id: string) {
  return revalidateSite(env, ["species", `species:${id}`]);
}

async function revalidateSite(env: ApiBindings, tags: string[]) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return;
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
  } catch (error) {
    console.error("Site revalidation failed", error);
  }
}
