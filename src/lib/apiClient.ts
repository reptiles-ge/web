import { hc } from "hono/client";

import type { AppType } from "@/api/app";

const API_ORIGIN = "https://api.reptiles.ge";

export type ApiFetcher = {
  fetch: (
    input: Request | string | URL,
    init?: RequestInit,
  ) => Promise<Response>;
};

type ApiClientOptions = {
  fetch?: typeof fetch;
  origin?: string;
  token?: string;
};

export function createApiClient({
  fetch,
  origin = API_ORIGIN,
  token,
}: ApiClientOptions = {}) {
  return hc<AppType>(origin, {
    ...(fetch ? { fetch } : {}),
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
}

export function serviceBindingFetch(binding: ApiFetcher): typeof fetch {
  return (input, init) => binding.fetch(input, init);
}
