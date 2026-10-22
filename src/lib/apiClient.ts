import { hc } from "hono/client";

import type { AppType } from "@/api/app";

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
  return hc<AppType>(origin, {
    ...(fetch ? { fetch } : {}),
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
}
