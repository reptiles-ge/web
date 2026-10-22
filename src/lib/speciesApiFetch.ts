import { serverEnv } from "@/lib/env";

const SPECIES_REVALIDATE_SECONDS = 3600;

export function speciesFetchOptions(tags: string[]) {
  const token = serverEnv().REVALIDATE_TOKEN;
  const headers: Record<string, string> = token
    ? { "X-Cache-Bypass": token }
    : {};
  return {
    headers,
    init: { next: { revalidate: SPECIES_REVALIDATE_SECONDS, tags } },
  };
}
