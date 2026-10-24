import type { InferResponseType } from "hono/client";

import { api } from "./apiClient";
import { SessionExpiredError } from "./species";

export type AdminNews = InferResponseType<
  typeof api.v1.admin.news.$get,
  200
>["data"][number];

export async function fetchAdminNews(): Promise<AdminNews[]> {
  const response = await api.v1.admin.news.$get();
  const status: number = response.status;
  if (status === 401 || status === 403) throw new SessionExpiredError();
  if (!response.ok) throw new Error(`News list failed: ${status}`);
  return (await response.json()).data;
}
