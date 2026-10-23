import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NewsArticle } from "@/data/newsTypes";

import { NEWS_ARTICLES } from "@/data/news.generated";

import type { ApiBindings } from "../env";

import { readNewsRecords } from "../db/news";
import { type ErrorBody, requestJson } from "../testing/request";
import {
  createNewsTestDatabase,
  createSpeciesTestDatabase,
} from "../testing/sqliteDatabase";

const TOKEN = "test-token";

const article = NEWS_ARTICLES.find((item) => item.image && item.gallery)!;

let sqlite: DatabaseSync;
let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

function useDatabase(database: ReturnType<typeof createSpeciesTestDatabase>) {
  sqlite = database.sqlite;
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
  };
}

beforeEach(() => useDatabase(createSpeciesTestDatabase()));

function post(path: string, body: unknown, token: null | string = TOKEN) {
  return requestJson<ErrorBody & { data: Record<string, unknown> }>(
    `/v1/admin/news${path}`,
    env,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      method: "POST",
    },
  );
}

const create = (value: unknown = article, query = "") =>
  post(query, {
    actor: "nika",
    article: value,
    source: "import",
    summary: "Import from MDX",
  });

const publish = (slug: string, expectedVersion: number) =>
  post(`/${slug}/status`, {
    actor: "nika",
    expectedVersion,
    source: "admin",
    status: "published",
    summary: "Publish",
  });

function count(table: string) {
  return (
    sqlite.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }
  ).n;
}

describe("POST /v1/admin/news", () => {
  it("needs the write token", async () => {
    expect((await create()).response.status).toBe(201);
    const { body, response } = await post(
      "",
      { actor: "nika", article, source: "import", summary: "x" },
      null,
    );
    expect(response.status).toBe(401);
    expect(body.error.code).toBe("unauthorized");
  });

  it("checks an article without saving it on a dry run", async () => {
    const { body, response } = await create(article, "?dryRun=true");
    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      dryRun: true,
      id: article.id,
      status: "draft",
      version: null,
    });
    expect(count("news_articles")).toBe(0);
  });

  it("creates the article as a draft with its first revision", async () => {
    const { body, response } = await create();
    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({
      dryRun: false,
      id: article.id,
      status: "draft",
      version: 1,
    });
    const [saved] = await readNewsRecords(env.DB, article.id);
    expect(saved?.position).toBe(0);
    expect(saved?.article.status).toBe("draft");
    expect(saved?.article.copy).toEqual(article.copy);
    expect(saved?.article.image?.credit?.photographer).toBe(
      article.image?.credit?.photographer,
    );
    expect(
      sqlite.prepare("SELECT version, actor, source FROM news_revisions").all(),
    ).toEqual([{ actor: "nika", source: "import", version: 1 }]);
    const hidden = await requestJson<ErrorBody>(`/v1/news/${article.id}`, env);
    expect(hidden.response.status).toBe(404);
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("adds a new article after the existing ones", async () => {
    useDatabase(createNewsTestDatabase());
    const fresh: NewsArticle = {
      ...article,
      id: "test-news",
      slug: "test-news",
    };
    expect((await create(fresh)).response.status).toBe(201);
    const [saved] = await readNewsRecords(env.DB, "test-news");
    expect(saved?.position).toBe(NEWS_ARTICLES.length);
  });

  it("refuses an existing slug", async () => {
    await create();
    const { body, response } = await create();
    expect(response.status).toBe(409);
    expect(body.error.code).toBe("conflict");
    expect(count("news_articles")).toBe(1);
  });

  it("refuses an invalid article and lists the problems", async () => {
    const missingKa = await create({
      ...article,
      copy: { en: article.copy.en },
    });
    expect(missingKa.response.status).toBe(400);
    expect(missingKa.body.error.code).toBe("invalid_request");

    const unknown = await create({
      ...article,
      relatedSpeciesIds: [...article.relatedSpeciesIds, "no-such-species"],
    });
    expect(unknown.response.status).toBe(400);
    expect(unknown.body.error.details).toContainEqual({
      message: "Unknown species no-such-species",
      path: "article.relatedSpeciesIds",
    });
    expect(count("news_articles")).toBe(0);
  });
});

describe("POST /v1/admin/news/:slug/status", () => {
  it("publishes a draft, revalidates the site and serves it", async () => {
    await create();
    const { body, response } = await publish(article.id, 1);
    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      id: article.id,
      status: "published",
      version: 2,
    });
    const served = await requestJson<{ data: { title: string } }>(
      `/v1/news/${article.id}`,
      env,
    );
    expect(served.response.status).toBe(200);
    expect(served.body.data.title).toBe(article.copy.ka.title);
    const [request] = siteFetch.mock.calls[0]!;
    expect(await request.json()).toEqual({
      tags: ["news", `news:${article.id}`],
    });
    expect(
      sqlite
        .prepare("SELECT version, source FROM news_revisions ORDER BY version")
        .all(),
    ).toEqual([
      { source: "import", version: 1 },
      { source: "admin", version: 2 },
    ]);
  });

  it("refuses a stale version and an unknown slug", async () => {
    await create();
    const stale = await publish(article.id, 2);
    expect(stale.response.status).toBe(409);
    expect(stale.body.error).toMatchObject({
      code: "version_conflict",
      details: { currentVersion: 1 },
    });
    const missing = await publish("no-such-article", 1);
    expect(missing.response.status).toBe(404);
    expect(siteFetch).not.toHaveBeenCalled();
  });
});
