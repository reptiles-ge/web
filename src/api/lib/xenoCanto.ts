import {
  parseXenoCantoPage,
  sortXenoCantoRecordings,
  XENO_CANTO_API,
  XENO_CANTO_PER_PAGE,
  type XenoCantoPage,
  xenoCantoQueries,
} from "@/lib/xenoCanto";

import type { ApiBindings } from "../env";

import { ApiError } from "./errors";

const TIMEOUT_MS = 15_000;

export async function searchXenoCanto(
  env: ApiBindings,
  scientificName: string,
  page: number,
): Promise<XenoCantoPage & { query: string }> {
  const key = env.XENO_CANTO_API_KEY?.trim();
  if (!key) {
    throw new ApiError(
      503,
      "service_unavailable",
      "xeno-canto search is not configured",
    );
  }
  const queries = xenoCantoQueries(scientificName);
  let last: null | (XenoCantoPage & { query: string }) = null;
  for (const query of queries) {
    const result = await fetchPage(key, query, page);
    last = { ...result, query };
    if (result.total > 0) break;
  }
  return {
    ...last!,
    recordings: sortXenoCantoRecordings(last!.recordings),
  };
}

async function fetchPage(key: string, query: string, page: number) {
  const url = new URL(XENO_CANTO_API);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(XENO_CANTO_PER_PAGE));
  url.searchParams.set("key", key);
  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  }).catch(() => null);
  const payload = response
    ? ((await response.json().catch(() => null)) as unknown)
    : null;
  const parsed = response?.ok ? parseXenoCantoPage(payload) : null;
  if (!parsed) {
    console.error("xeno-canto search failed", {
      message:
        payload && typeof payload === "object" && "message" in payload
          ? String(payload.message).slice(0, 300)
          : undefined,
      query,
      status: response?.status ?? null,
    });
    throw new ApiError(502, "upstream_failed", "xeno-canto search failed");
  }
  return parsed;
}
