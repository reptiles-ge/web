import type { InferResponseType } from "hono/client";

import { api } from "./apiClient";

export type AdminUser = InferResponseType<
  typeof api.v1.auth.me.$get,
  200
>["data"];

export type SignInResult =
  | { status: "invalid" }
  | { status: "rate_limited" }
  | { status: "signed_in"; user: AdminUser };

export async function fetchCurrentUser(): Promise<AdminUser | null> {
  const response = await api.v1.auth.me.$get();
  const status: number = response.status;
  if (status === 401 || status === 403) return null;
  if (!response.ok) throw new Error(`Session check failed: ${status}`);
  return (await response.json()).data;
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  const response = await api.v1.auth.login.$post({
    json: { email, password },
  });
  const status: number = response.status;
  if (status === 401) return { status: "invalid" };
  if (status === 429) return { status: "rate_limited" };
  if (!response.ok) throw new Error(`Sign-in failed: ${status}`);
  return { status: "signed_in", user: (await response.json()).data };
}

export async function signOut() {
  const response = await api.v1.auth.logout.$post();
  if (!response.ok) throw new Error(`Sign-out failed: ${response.status}`);
}
