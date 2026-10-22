import type { ApiBindings } from "../env";

const DEFAULT_ORIGINS = ["https://reptiles.ge"];

export function allowedOrigins(env: ApiBindings | undefined) {
  const configured = env?.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_ORIGINS;
}
