import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NewsArticle } from "@/data/newsTypes";

import { NEWS_ARTICLES } from "@/data/news.generated";

import type { ApiBindings } from "../env";

import { app } from "../app";
import { readNewsRecords } from "../db/news";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionHeaders,
} from "../testing/adminSession";
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

type AdminNewsList = {
  data: Array<{
    id: string;
    image: null | string;
    lastEditedAt: null | string;
    locales: string[];
    photoCount: number;
    publishedAt: string;
    series: null | string;
    status: string;
    title: { en: null | string; ka: null | string };
    updatedAt: null | string;
    version: number;
  }>;
  total: number;
};

function list(
  headers: Record<string, string> = { Authorization: `Bearer ${TOKEN}` },
) {
  return requestJson<AdminNewsList & ErrorBody>("/v1/admin/news", env, {
    headers,
  });
}

describe("GET /v1/admin/news", () => {
  it("lists every article newest first with its admin fields", async () => {
    useDatabase(createNewsTestDatabase());
    const { body, response } = await list();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const order = sqlite
      .prepare(
        "SELECT id FROM news_articles ORDER BY published_at DESC, position",
      )
      .all() as Array<{ id: string }>;
    expect(body.data.map(({ id }) => id)).toEqual(order.map(({ id }) => id));
    expect(body.total).toBe(order.length);
    const item = body.data.find(({ id }) => id === article.id)!;
    expect(item).toEqual({
      id: article.id,
      image: article.image?.src ?? null,
      lastEditedAt: null,
      locales: ["ka", "en", "ru", "tr"].filter(
        (locale) => locale in article.copy,
      ),
      photoCount: article.gallery?.length ?? 0,
      publishedAt: article.publishedAt,
      series: article.series ?? null,
      status: article.status,
      title: { en: article.copy.en.title, ka: article.copy.ka.title },
      updatedAt: article.updatedAt ?? null,
      version: 1,
    });
  });

  it("shows a draft with its last revision", async () => {
    expect((await create()).response.status).toBe(201);
    const { body } = await list();
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({
      id: article.id,
      status: "draft",
      version: 1,
    });
    expect(body.data[0]!.lastEditedAt).toEqual(expect.any(String));
  });

  it("lets a signed-in admin read the list, but not write", async () => {
    const session = await adminSessionHeaders(sqlite);
    expect((await list(session)).response.status).toBe(200);
    const write = await requestJson<ErrorBody>("/v1/admin/news", env, {
      body: JSON.stringify({}),
      headers: { ...session, "Content-Type": "application/json" },
      method: "POST",
    });
    expect(write.response.status).toBe(401);
  });

  it("refuses everyone else", async () => {
    const cases: Array<[Record<string, string>, number]> = [
      [{}, 401],
      [{ Authorization: "Bearer wrong" }, 401],
      [{ Cookie: `${ADMIN_SESSION_COOKIE}=made-up` }, 401],
      [await adminSessionHeaders(sqlite, "editor"), 403],
    ];
    for (const [headers, status] of cases) {
      const { body, response } = await list(headers);
      expect(response.status).toBe(status);
      expect(body.data).toBeUndefined();
    }
  });

  it("stays out of the public API document", async () => {
    const response = await app.request("/v1/docs/openapi.json", {}, env);
    const document = (await response.json()) as { paths: object };
    expect(Object.keys(document.paths).join()).not.toContain("/admin/news");
  });
});

describe("POST /v1/admin/news/:slug/revalidate", () => {
  const ADMIN_ORIGIN = "https://admin.reptiles.ge";

  async function revalidate(
    slug: string,
    headers: Record<string, string> | undefined = undefined,
  ) {
    return requestJson<ErrorBody & { data: { id: string } }>(
      `/v1/admin/news/${slug}/revalidate`,
      env,
      {
        headers: headers ?? {
          ...(await adminSessionHeaders(sqlite)),
          Origin: ADMIN_ORIGIN,
        },
        method: "POST",
      },
    );
  }

  beforeEach(() => {
    useDatabase(createNewsTestDatabase());
    env.ALLOWED_ORIGINS = `https://reptiles.ge,${ADMIN_ORIGIN}`;
  });

  it("revalidates only that article's pages on the site", async () => {
    const { body, response } = await revalidate(article.id);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({ id: article.id });
    expect(siteFetch).toHaveBeenCalledTimes(1);
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
    expect(await request.json()).toEqual({ tags: [`news:${article.id}`] });
  });

  it("answers 404 for an unknown article and 502 when the site fails", async () => {
    const missing = await revalidate("no-such-article");
    expect(missing.response.status).toBe(404);
    expect(siteFetch).not.toHaveBeenCalled();

    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    const failed = await revalidate(article.id);
    expect(failed.response.status).toBe(502);
    expect(failed.body.error.code).toBe("site_unavailable");
    log.mockRestore();
  });

  it("needs an admin session from an allowed origin and is rate limited", async () => {
    const session = await adminSessionHeaders(sqlite);
    const cases: Array<[Record<string, string>, number]> = [
      [{ Origin: ADMIN_ORIGIN }, 401],
      [{ Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN }, 401],
      [session, 403],
      [{ ...session, Origin: "https://evil.example" }, 403],
      [
        {
          ...(await adminSessionHeaders(sqlite, "editor")),
          Origin: ADMIN_ORIGIN,
        },
        403,
      ],
    ];
    for (const [headers, status] of cases) {
      expect((await revalidate(article.id, headers)).response.status).toBe(
        status,
      );
    }
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    expect((await revalidate(article.id)).response.status).toBe(429);
    expect(siteFetch).not.toHaveBeenCalled();
  });
});

describe("POST /v1/admin/news/revalidate", () => {
  const ADMIN_ORIGIN = "https://admin.reptiles.ge";

  async function clearSection(headers?: Record<string, string>) {
    return requestJson<ErrorBody & { data: { tags: string[] } }>(
      "/v1/admin/news/revalidate",
      env,
      {
        headers: headers ?? {
          ...(await adminSessionHeaders(sqlite)),
          Origin: ADMIN_ORIGIN,
        },
        method: "POST",
      },
    );
  }

  beforeEach(() => {
    useDatabase(createNewsTestDatabase());
    env.ALLOWED_ORIGINS = `https://reptiles.ge,${ADMIN_ORIGIN}`;
  });

  it("revalidates every news page with the news tag", async () => {
    const { body, response } = await clearSection();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({ tags: ["news"] });
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(await request.json()).toEqual({ tags: ["news"] });
  });

  it("answers 502 when the site fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    const { body, response } = await clearSection();
    expect(response.status).toBe(502);
    expect(body.error.code).toBe("site_unavailable");
    log.mockRestore();
  });

  it("needs an admin session from an allowed origin and is rate limited", async () => {
    const session = await adminSessionHeaders(sqlite);
    for (const [headers, status] of [
      [{ Origin: ADMIN_ORIGIN }, 401],
      [{ Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN }, 401],
      [session, 403],
      [{ ...session, Origin: "https://evil.example" }, 403],
    ] as Array<[Record<string, string>, number]>) {
      expect((await clearSection(headers)).response.status).toBe(status);
    }
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    expect((await clearSection()).response.status).toBe(429);
    expect(siteFetch).not.toHaveBeenCalled();
  });
});
