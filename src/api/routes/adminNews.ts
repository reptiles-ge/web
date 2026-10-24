import { Hono } from "hono";

import type { NewsArticle } from "@/data/newsTypes";

import { GROUP_HUBS } from "@/lib/groupHubs";
import { newsReferenceIssues } from "@/lib/newsRules";

import type { ApiDatabase } from "../db/database";
import type { ApiEnv } from "../env";

import { listAdminNews, readNewsRecords } from "../db/news";
import {
  createNewsArticle,
  readNewsKnownIds,
  readNewsState,
  setNewsStatus,
  writeNewsCopy,
} from "../db/newsWrite";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { REGION_IDS } from "../lib/catalogFilter";
import { ApiError } from "../lib/errors";
import { newsCopyIssues } from "../lib/newsCopy";
import {
  ensureSiteRevalidated,
  revalidateNewsArticle,
  revalidateNewsPages,
  revalidateNewsSection,
} from "../lib/revalidateSite";
import { validate } from "../lib/validate";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { requireToken } from "../middleware/requireToken";
import { newsParam } from "../schemas/news";
import {
  adminNewsListQuery,
  newsArticleSchema,
  newsCopyBody,
  newsCreateBody,
  newsCreateQuery,
  newsStatusBody,
} from "../schemas/newsRecord";

const HUB_IDS = new Set(Object.keys(GROUP_HUBS));
const REGIONS = new Set(REGION_IDS);

export const adminNews = new Hono<ApiEnv>()
  .get("/", requireAdmin, validate("query", adminNewsListQuery), async (c) => {
    const { limit, page, ...filters } = c.req.valid("query");
    const result = await listAdminNews(c.env.DB, filters, { limit, page });
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
  })
  .post(
    "/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    async (c) => {
      await ensureSiteRevalidated(revalidateNewsSection(c.env));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { tags: ["news"] } }, 200);
    },
  )
  .post(
    "/:slug/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", newsParam),
    async (c) => {
      const { slug } = c.req.valid("param");
      if (!(await readNewsState(c.env.DB, slug))) {
        throw new ApiError(404, "not_found", "Article not found");
      }
      await ensureSiteRevalidated(revalidateNewsArticle(c.env, slug));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id: slug } }, 200);
    },
  )
  .get("/:slug", requireAdmin, validate("param", newsParam), async (c) => {
    const { slug } = c.req.valid("param");
    const { found, state } = await readArticle(c.env.DB, slug);
    c.header("Cache-Control", NO_STORE);
    return c.json(
      { data: { article: found.article, version: state.version } },
      200,
    );
  })
  .post(
    "/:slug/copy",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", newsParam),
    validate("json", newsCopyBody),
    async (c) => {
      const { slug } = c.req.valid("param");
      const { copy, expectedVersion, summary } = c.req.valid("json");
      const { found, state } = await readArticle(c.env.DB, slug);
      if (state.version !== expectedVersion) {
        throw versionConflict(state.version);
      }
      const structure = newsCopyIssues(found.article.copy, copy);
      if (structure.length > 0) {
        throw new ApiError(
          400,
          "invalid_request",
          "A text edit cannot change the article's structure",
          structure.map(issuePath("")),
        );
      }
      const checked = newsArticleSchema.safeParse({
        ...found.article,
        copy,
      });
      if (!checked.success) {
        throw new ApiError(
          400,
          "invalid_request",
          "The change breaks a content rule",
          checked.error.issues,
        );
      }
      const article = checked.data as NewsArticle;
      await checkReferences(c.env.DB, article, "");
      let version: number;
      try {
        version = await writeNewsCopy(
          c.env.DB,
          { article, position: found.position },
          expectedVersion,
          { actor: c.var.user!.name, source: "admin", summary },
        );
      } catch (error) {
        const now = await readNewsState(c.env.DB, slug);
        if (now && now.version !== expectedVersion) {
          throw versionConflict(now.version);
        }
        throw error;
      }
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id: slug, version } }, 200);
    },
  )
  .use(requireToken)
  .post(
    "/",
    validate("query", newsCreateQuery),
    validate("json", newsCreateBody),
    async (c) => {
      const { actor, article, source, summary } = c.req.valid("json");
      const dryRun = c.req.valid("query").dryRun === "true";
      await checkReferences(c.env.DB, article, "article");
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

async function checkReferences(
  db: ApiDatabase,
  article: Parameters<typeof newsReferenceIssues>[0],
  prefix: string,
) {
  const known = await readNewsKnownIds(db);
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
      issues.map(issuePath(prefix)),
    );
  }
}

function issuePath(prefix: string) {
  return (issue: { message: string; path: (number | string)[] }) => ({
    message: issue.message,
    path: (prefix ? [prefix, ...issue.path] : issue.path).join("."),
  });
}

async function readArticle(db: ApiDatabase, slug: string) {
  const [[found], state] = await Promise.all([
    readNewsRecords(db, slug),
    readNewsState(db, slug),
  ]);
  if (!found || !state) {
    throw new ApiError(404, "not_found", "Article not found");
  }
  return { found, state };
}

function versionConflict(currentVersion: number) {
  return new ApiError(
    409,
    "version_conflict",
    "Article changed since it was read",
    { currentVersion },
  );
}
