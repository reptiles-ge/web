import type { ApiBindings } from "../env";

export async function revalidateSpeciesPages(env: ApiBindings, id: string) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return;
  }
  try {
    const response = await env.SITE.fetch(
      new Request("https://reptiles.ge/api/revalidate", {
        body: JSON.stringify({ tags: ["species", `species:${id}`] }),
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
