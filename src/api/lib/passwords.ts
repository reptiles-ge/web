import { timingSafeEqual } from "hono/utils/buffer";

const ALGORITHM = "pbkdf2-sha256";
const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;

let dummyHash: Promise<string> | undefined;

export function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

export function dummyPasswordHash() {
  dummyHash ??= hashPassword(crypto.randomUUID());
  return dummyHash;
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await derive(password, salt, ITERATIONS);
  return [ALGORITHM, ITERATIONS, base64Url(salt), base64Url(key)].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, iterations, salt, key] = stored.split("$");
  if (
    algorithm !== ALGORITHM ||
    Number(iterations) !== ITERATIONS ||
    !salt ||
    !key
  ) {
    return false;
  }
  const derived = await derive(password, fromBase64Url(salt), ITERATIONS);
  return timingSafeEqual(base64Url(derived), key);
}

async function derive(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      { hash: "SHA-256", iterations, name: "PBKDF2", salt },
      material,
      KEY_BITS,
    ),
  );
}

function fromBase64Url(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}
