import type { ApiBindings } from "../env";

export const SITE_ORIGIN = "https://reptiles.ge";

const DEFAULT_ORIGINS = [SITE_ORIGIN];

export function allowedOrigins(env: ApiBindings | undefined) {
  const configured = env?.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_ORIGINS;
}
