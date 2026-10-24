import { hc } from "hono/client";

import type { AppType } from "@/api/app";

import { loggedFetch } from "@/lib/apiRequestLog";
import { publicEnv, serverEnv } from "@/lib/env";

export const API_ORIGIN = "https://api.reptiles.ge";

type ApiClientOptions = {
  fetch?: typeof fetch;
  origin?: string;
  token?: string;
};

export function apiOrigin() {
  return publicEnv().NEXT_PUBLIC_API_ORIGIN ?? API_ORIGIN;
}

export function createApiClient({
  fetch,
  origin = apiOrigin(),
  token,
}: ApiClientOptions = {}) {
  const transport =
    process.env.NODE_ENV === "development" ? loggedFetch(fetch) : fetch;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...siteApiKeyHeader(),
  };
  return hc<AppType>(origin, {
    ...(transport ? { fetch: transport } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
  });
}

function siteApiKeyHeader(): Record<string, string> {
  if (typeof window !== "undefined") return {};
  const key = serverEnv().SITE_API_KEY;
  return key ? { "X-Api-Key": key } : {};
}
