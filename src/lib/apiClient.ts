import { hc } from "hono/client";

import type { AppType } from "@/api/app";

import { loggedFetch } from "@/lib/apiRequestLog";
import { publicEnv } from "@/lib/env";

const API_ORIGIN = "https://api.reptiles.ge";

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
  return hc<AppType>(origin, {
    ...(transport ? { fetch: transport } : {}),
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
}
