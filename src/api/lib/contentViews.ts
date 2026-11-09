import type { ContentViewInput } from "@/lib/contentViewInput";
import type { PageViewInput } from "@/lib/pageViewInput";

import { contentViewForPath } from "@/lib/pageViewPath";
import { siteDay } from "@/lib/siteTime";
import { classifyTrafficEntry } from "@/lib/trafficSource";

import type { ApiDatabase } from "../db/database";

import { recordPageView, recordTrafficVisit } from "../db/pageViews";
import {
  forgetViewVisitorsBefore,
  isPublishedTarget,
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

export async function countPageView(
  db: ApiDatabase,
  input: PageViewInput,
  request: ViewRequest,
) {
  const content = contentViewForPath(input.path);
  if (content && !(await isPublishedTarget(db, content.kind, content.id))) {
    return;
  }
  const { day, visitor } = await dailyVisitor(db, request);
  const view = { day, locale: input.locale, path: input.path, visitor };
  await Promise.all([
    recordPageView(db, view),
    content ? recordView(db, { day, ...content, visitor }) : undefined,
    input.entry
      ? recordTrafficVisit(db, {
          ...view,
          ...classifyTrafficEntry(input.entry),
        })
      : undefined,
  ]);
}

export async function countView(
  db: ApiDatabase,
  input: ContentViewInput,
  request: ViewRequest,
) {
  const { day, visitor } = await dailyVisitor(db, request);
  await recordView(db, { day, id: input.id, kind: input.kind, visitor });
}

export function isBotUserAgent(userAgent: string | undefined) {
  return !userAgent || BOT_USER_AGENT.test(userAgent);
}

async function dailyVisitor(db: ApiDatabase, request: ViewRequest) {
  const day = siteDay(request.now);
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
  return { day, visitor };
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
