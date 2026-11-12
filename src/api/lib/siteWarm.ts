import type { ApiBindings } from "../env";

export const SITE_ORIGIN = "https://reptiles.ge";

export const WARM_CONCURRENCY = 3;

const WARM_USER_AGENT = "reptiles-cache-warmer";

export type Defer = (task: Promise<unknown>) => void;

export async function requestFullSiteWarm(env: ApiBindings) {
  const repository = env.WARM_DISPATCH_REPOSITORY;
  if (!env.WARM_DISPATCH_TOKEN || !repository) {
    console.error("Site warm is not configured");
    return false;
  }
  try {
    const response = await fetch(warmWorkflowUrl(repository), {
      body: JSON.stringify({ inputs: { warm_only: "true" }, ref: "main" }),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.WARM_DISPATCH_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": WARM_USER_AGENT,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      method: "POST",
    });
    if (!response.ok) {
      console.error(`Site warm dispatch answered ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error("Site warm dispatch failed", error);
    return false;
  }
}

export async function warmSitePaths(env: ApiBindings, paths: string[]) {
  const site = env.SITE;
  if (!site) return 0;
  const requests = paths.flatMap((path) => [
    new Request(`${SITE_ORIGIN}${path}`, {
      headers: { Accept: "text/html", "User-Agent": WARM_USER_AGENT },
    }),
    new Request(`${SITE_ORIGIN}${path}?_rsc`, {
      headers: { RSC: "1", "User-Agent": WARM_USER_AGENT },
    }),
  ]);
  let warmed = 0;
  let next = 0;
  const worker = async () => {
    while (next < requests.length) {
      const request = requests[next]!;
      next += 1;
      try {
        const response = await site.fetch(request);
        await response.arrayBuffer();
        if (response.ok) warmed += 1;
      } catch (error) {
        console.error(`Site warm failed for ${request.url}`, error);
      }
    }
  };
  await Promise.all(Array.from({ length: WARM_CONCURRENCY }, worker));
  return warmed;
}

export function warmWorkflowUrl(repository: string) {
  return `https://api.github.com/repos/${repository}/actions/workflows/warm-cache.yml/dispatches`;
}
