import type { InferResponseType } from "hono/client";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";

export type AdminApiKey = InferResponseType<
  (typeof api.v1.admin)["api-keys"]["$get"],
  200
>["data"][number];

export type CreatedApiKey = InferResponseType<
  (typeof api.v1.admin)["api-keys"]["$post"],
  201
>["data"];

export async function createApiKey(input: {
  expiresAt: null | string;
  name: string;
  note: null | string;
}): Promise<CreatedApiKey> {
  const response = await api.v1.admin["api-keys"].$post({ json: input });
  checkAdminResponse(response, "API key creation failed");
  return (await response.json()).data;
}

export async function fetchApiKeys(): Promise<AdminApiKey[]> {
  const response = await api.v1.admin["api-keys"].$get();
  checkAdminResponse(response, "API keys failed");
  return (await response.json()).data;
}

export async function revokeApiKey(id: string) {
  checkAdminResponse(
    await api.v1.admin["api-keys"][":id"].revoke.$post({ param: { id } }),
    "API key revoke failed",
  );
}
