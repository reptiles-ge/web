import type { ApiBindings } from "../env";

import { app } from "../app";

export type ErrorBody = {
  error: { code: string; details?: unknown; message: string };
};

export function jsonInit(body: unknown, token?: string): RequestInit {
  return {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method: "POST",
  };
}

export async function requestJson<T>(
  url: string,
  env: ApiBindings,
  init: RequestInit = {},
) {
  const response = await app.request(url, init, env);
  return { body: (await response.json()) as T, response };
}
