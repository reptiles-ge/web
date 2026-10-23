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
  const transport =
    process.env.NODE_ENV === "development" ? loggedFetch(fetch) : fetch;
  return hc<AppType>(origin, {
    ...(transport ? { fetch: transport } : {}),
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
}

function loggedFetch(base?: typeof fetch): typeof fetch {
  return async (input, init) => {
    const method =
      init?.method ?? (input instanceof Request ? input.method : "GET");
    const url = input instanceof Request ? input.url : String(input);
    const started = Date.now();
    try {
      const response = await (base ?? globalThis.fetch)(input, init);
      console.info(
        `[api-request] ${method} ${url} → ${response.status} (${Date.now() - started} ms)`,
      );
      return response;
    } catch (error) {
      console.info(
        `[api-request] ${method} ${url} → failed (${Date.now() - started} ms)`,
        error,
      );
      throw error;
    }
  };
}
