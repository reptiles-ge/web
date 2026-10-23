import type { InferResponseType } from "hono/client";

import { api } from "./apiClient";

export type AdminSpecies = InferResponseType<
  typeof api.v1.admin.species.$get,
  200
>["data"][number];

export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

export async function fetchAdminSpecies(): Promise<AdminSpecies[]> {
  const response = await api.v1.admin.species.$get();
  const status: number = response.status;
  if (status === 401 || status === 403) throw new SessionExpiredError();
  if (!response.ok) throw new Error(`Species list failed: ${status}`);
  return (await response.json()).data;
}
