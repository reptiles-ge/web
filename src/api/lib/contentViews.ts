import type { ContentViewInput } from "@/lib/contentViewInput";
import type { PageViewInput } from "@/lib/pageViewInput";

import { REGION_IDS } from "@/data/regionIds";
import { newsPageCount } from "@/lib/newsArchivePages";
import { type PageViewTarget, pageViewTarget } from "@/lib/pageViewPath";
import { LIVE_QUIZ_IDS } from "@/lib/quizIds";
import { siteDay } from "@/lib/siteTime";
import { classifyTrafficEntry } from "@/lib/trafficSource";

import type { ApiDatabase } from "../db/database";

import { recordTrafficVisit } from "../db/pageViews";
import {
  countPublishedNews,
  forgetViewVisitorsBefore,
  isContributor,
  isPublishedSpeciesInGroup,
  isPublishedTarget,
  readViewSalt,
  recordView,
} from "../db/views";

const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|preview|fetch|headless|lighthouse|pagespeed|monitor|curl|wget|python|httpclient|okhttp|axios|node-fetch|undici|go-http|java\//i;

export type ViewRequest = {
  acceptLanguage: string | undefined;
  country: null | string;
  ip: string | undefined;
  now: Date;
  userAgent: string | undefined;
};

export async function countPageView(
  db: ApiDatabase,
  input: PageViewInput,
  request: ViewRequest,
) {
  const target = pageViewTarget(input.path);
  if (!target || !(await pageTargetExists(db, target))) return;
  const content =
    target.kind === "species" || target.kind === "news"
      ? { id: target.id, kind: target.kind }
      : undefined;
  const { day, visitor } = await dailyVisitor(db, request);
  await Promise.all([
    content ? recordView(db, { day, ...content, visitor }) : undefined,
    input.entry
      ? recordTrafficVisit(db, {
          country: request.country,
          day,
          locale: input.locale,
          path: input.path,
          visitor,
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
  if (!(await isPublishedTarget(db, input.kind, input.id))) return;
  const { day, visitor } = await dailyVisitor(db, request);
  await recordView(db, { day, id: input.id, kind: input.kind, visitor });
}

export function isBotUserAgent(userAgent: string | undefined) {
  return !userAgent || BOT_USER_AGENT.test(userAgent);
}

async function dailyVisitor(db: ApiDatabase, request: ViewRequest) {
  const day = siteDay(request.now);
  const { created, salt } = await readViewSalt(db, day, randomHex(32));
  if (created) await forgetViewVisitorsBefore(db, day);
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

async function pageTargetExists(db: ApiDatabase, target: PageViewTarget) {
  switch (target.kind) {
    case "author":
      return isContributor(db, target.id);
    case "news":
      return isPublishedTarget(db, "news", target.id);
    case "newsPage":
      return target.page <= newsPageCount(await countPublishedNews(db));
    case "quiz":
      return LIVE_QUIZ_IDS.has(target.id);
    case "region":
      return REGION_IDS.has(target.id);
    case "species":
      return isPublishedSpeciesInGroup(db, target.id, target.group);
    case "static":
      return true;
  }
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
