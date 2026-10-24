import { base64Url } from "./passwords";
import { hashSessionToken } from "./sessions";

export const API_KEY_HEADER = "X-Api-Key";

const API_KEY_PREFIX = "rpt_";

const VISIBLE_PREFIX_LENGTH = 12;

const API_KEY_MODES = ["enforce", "log", "off"] as const;

const KEYLESS_PATHS = ["/v1/admin", "/v1/auth", "/v1/docs", "/v1/views"];

export type ApiKeyMode = (typeof API_KEY_MODES)[number];

export function apiKeyMode(value: string | undefined): ApiKeyMode {
  const mode = value?.trim().toLowerCase();
  return API_KEY_MODES.find((known) => known === mode) ?? "off";
}

export const hashApiKey = hashSessionToken;

export function looksLikeApiKey(value: string) {
  return value.startsWith(API_KEY_PREFIX) && value.length <= 128;
}

export function needsApiKey(path: string) {
  return (
    path.startsWith("/v1/") &&
    !KEYLESS_PATHS.some(
      (keyless) => path === keyless || path.startsWith(`${keyless}/`),
    )
  );
}

export function newApiKey() {
  const key = `${API_KEY_PREFIX}${base64Url(crypto.getRandomValues(new Uint8Array(32)))}`;
  return { key, prefix: key.slice(0, VISIBLE_PREFIX_LENGTH) };
}
