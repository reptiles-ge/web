import type { ContentViewInput } from "@/lib/contentViewInput";

import type { ApiDatabase } from "../db/database";

import {
  forgetViewVisitorsBefore,
  readViewSalt,
  recordView,
} from "../db/views";

const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|preview|fetch|headless|lighthouse|pagespeed|monitor|curl|wget|python|httpclient|okhttp|axios|node-fetch|undici|go-http|java\//i;

export type ViewRequest = {
  acceptLanguage: string | undefined;
  ip: string | undefined;
  now: Date;
  userAgent: string | undefined;
};

export async function countView(
  db: ApiDatabase,
  input: ContentViewInput,
  request: ViewRequest,
) {
  const day = viewDay(request.now);
  await forgetViewVisitorsBefore(db, day);
  const salt = await readViewSalt(db, day, randomHex(32));
  const visitor = await sha256Hex(
    [
      salt,
      request.ip ?? "",
      request.userAgent ?? "",
      request.acceptLanguage ?? "",
    ].join("\n"),
  );
  await recordView(db, { day, id: input.id, kind: input.kind, visitor });
}

export function firstViewDay(now: Date, days: number | undefined) {
  if (days === undefined) return undefined;
  const first = new Date(now);
  first.setUTCDate(first.getUTCDate() - (days - 1));
  return viewDay(first);
}

export function isBotUserAgent(userAgent: string | undefined) {
  return !userAgent || BOT_USER_AGENT.test(userAgent);
}

function randomHex(bytes: number) {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return toHex(new Uint8Array(digest));
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function viewDay(now: Date) {
  return now.toISOString().slice(0, 10);
}
