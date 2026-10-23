import { Hono } from "hono";

import type { NewsArticle } from "@/data/newsTypes";

import { GROUP_HUBS } from "@/lib/groupHubs";
import { newsReferenceIssues } from "@/lib/newsRules";

import type { ApiEnv } from "../env";

import {
  createNewsArticle,
  readNewsKnownIds,
  readNewsState,
  setNewsStatus,
} from "../db/newsWrite";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { REGION_IDS } from "../lib/catalogFilter";
import { ApiError } from "../lib/errors";
import { revalidateNewsPages } from "../lib/revalidateSite";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import { newsParam } from "../schemas/news";
import {
  newsCreateBody,
  newsCreateQuery,
  newsStatusBody,
} from "../schemas/newsRecord";

const HUB_IDS = new Set(Object.keys(GROUP_HUBS));
const REGIONS = new Set(REGION_IDS);

export const adminNews = new Hono<ApiEnv>()
  .use(requireToken)
  .post(
    "/",
    validate("query", newsCreateQuery),
    validate("json", newsCreateBody),
    async (c) => {
      const { actor, article, source, summary } = c.req.valid("json");
      const dryRun = c.req.valid("query").dryRun === "true";
      const known = await readNewsKnownIds(c.env.DB);
      const issues = newsReferenceIssues(article, {
        ...known,
        hubIds: HUB_IDS,
        regionIds: REGIONS,
      });
      if (issues.length > 0) {
        throw new ApiError(
          400,
          "invalid_request",
          "Article links to unknown ids",
          issues.map((issue) => ({
            message: issue.message,
            path: ["article", ...issue.path].join("."),
          })),
        );
      }
      if (await readNewsState(c.env.DB, article.id)) {
        throw new ApiError(409, "conflict", "Article already exists");
      }
      const version = dryRun
        ? null
        : await createNewsArticle(c.env.DB, article as NewsArticle, {
            actor,
            source,
            summary,
          });
      c.header("Cache-Control", NO_STORE);
      return c.json(
        { data: { dryRun, id: article.id, status: "draft" as const, version } },
        dryRun ? 200 : 201,
      );
    },
  )
  .post(
    "/:slug/status",
    validate("param", newsParam),
    validate("json", newsStatusBody),
    async (c) => {
      const { slug } = c.req.valid("param");
      const { actor, expectedVersion, source, status, summary } =
        c.req.valid("json");
      const current = await readNewsState(c.env.DB, slug);
      if (!current) throw new ApiError(404, "not_found", "Article not found");
      if (current.version !== expectedVersion) {
        throw versionConflict(current.version);
      }
      let version: number;
      try {
        version = await setNewsStatus(c.env.DB, slug, status, expectedVersion, {
          actor,
          source,
          summary,
        });
      } catch (error) {
        const now = await readNewsState(c.env.DB, slug);
        if (now && now.version !== expectedVersion) {
          throw versionConflict(now.version);
        }
        throw error;
      }
      inBackground(c, revalidateNewsPages(c.env, slug));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id: slug, status, version } }, 200);
    },
  );

function versionConflict(currentVersion: number) {
  return new ApiError(
    409,
    "version_conflict",
    "Article changed since it was read",
    { currentVersion },
  );
}
