import { base64Url } from "./passwords";

export const SESSION_COOKIE = "reptiles_admin_session";

export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export async function hashSessionToken(token: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function newSessionToken() {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}
