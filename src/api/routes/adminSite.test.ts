import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { SITE_PAGE_GROUPS } from "@/lib/sitePageGroups";

import type { ApiBindings } from "../env";

import { app } from "../app";
import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";

let sqlite: DatabaseSync;
let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

beforeEach(() => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  sqlite.exec("DELETE FROM species_revisions");
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: "test-token",
    DB: database.db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
  };
});

function publishedIds(count: number) {
  return (
    sqlite
      .prepare(
        "SELECT id FROM species WHERE status = 'published' ORDER BY id LIMIT ?",
      )
      .all(count) as Array<{ id: string }>
  ).map(({ id }) => id);
}

async function revalidate(headers: Record<string, string>) {
  return requestJson<ErrorBody & { data: { species: string[] } }>(
    "/v1/admin/site/revalidate",
    env,
    { headers, method: "POST" },
  );
}

function revise(id: string, hoursAgo: number) {
  sqlite
    .prepare(
      "INSERT INTO species_revisions (species_id, version, actor, source, summary, created_at) VALUES (?, (SELECT COALESCE(MAX(version), 0) + 1 FROM species_revisions WHERE species_id = ?), 'nika', 'admin', 'Edit', ?)",
    )
    .run(id, id, new Date(Date.now() - hoursAgo * 3600_000).toISOString());
}

async function sentTags() {
  return Promise.all(
    siteFetch.mock.calls.map(
      async ([request]) => ((await request.json()) as { tags: string[] }).tags,
    ),
  );
}

async function signedIn() {
  return { ...(await adminSessionHeaders(sqlite)), Origin: ADMIN_ORIGIN };
}

describe("POST /v1/admin/site/revalidate", () => {
  it("revalidates the species pages and every species edited in the last day", async () => {
    revise("vipera-kaznakovi", 2);
    revise("macrovipera-lebetina", 1);
    revise("macrovipera-lebetina", 0);
    revise("testudo-graeca", 30);
    const { body, response } = await revalidate(await signedIn());
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data.species).toEqual([
      "macrovipera-lebetina",
      "vipera-kaznakovi",
    ]);
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
    expect(await sentTags()).toEqual([
      ["species", "species:macrovipera-lebetina", "species:vipera-kaznakovi"],
    ]);
  });

  it("revalidates the species tag alone when nothing was edited", async () => {
    const { body } = await revalidate(await signedIn());
    expect(body.data.species).toEqual([]);
    expect(await sentTags()).toEqual([["species"]]);
  });

  it("splits the tags into requests the site accepts", async () => {
    const ids = publishedIds(45);
    for (const id of ids) revise(id, 1);
    const { response } = await revalidate(await signedIn());
    expect(response.status).toBe(200);
    const sent = await sentTags();
    expect(sent.map((tags) => tags.length)).toEqual([20, 20, 6]);
    expect(sent.flat()).toEqual([
      "species",
      ...ids.map((id) => `species:${id}`),
    ]);
  });

  it("answers 502 and stops when the site cannot be revalidated", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    for (const id of publishedIds(30)) revise(id, 1);
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    const failed = await revalidate(await signedIn());
    expect(failed.response.status).toBe(502);
    expect(failed.body.error.code).toBe("site_unavailable");
    expect(siteFetch).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("Site revalidation answered 500");

    siteFetch.mockRejectedValue(new Error("down"));
    expect((await revalidate(await signedIn())).response.status).toBe(502);
    expect(log).toHaveBeenCalledWith(
      "Site revalidation failed",
      expect.any(Error),
    );

    env.SITE = undefined;
    expect((await revalidate(await signedIn())).response.status).toBe(502);
    expect(log).toHaveBeenCalledWith("Site revalidation is not configured");
    log.mockRestore();
  });

  it("needs an admin session from an allowed origin", async () => {
    const session = await adminSessionHeaders(sqlite);
    const cases: Array<[Record<string, string>, number]> = [
      [{ Origin: ADMIN_ORIGIN }, 401],
      [{ Authorization: "Bearer test-token", Origin: ADMIN_ORIGIN }, 401],
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
      expect((await revalidate(headers)).response.status).toBe(status);
    }
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("is rate limited", async () => {
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    const { body, response } = await revalidate(await signedIn());
    expect(response.status).toBe(429);
    expect(body.error.code).toBe("rate_limited");
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("finds recent revisions through an index", async () => {
    const prepare = vi.spyOn(env.DB, "prepare");
    await revalidate(await signedIn());
    const query = prepare.mock.calls
      .map(([sql]) => sql)
      .find((sql) => sql.includes("species_revisions"))!;
    const plan = sqlite
      .prepare(`EXPLAIN QUERY PLAN ${query}`)
      .all("2026-01-01T00:00:00.000Z") as Array<{ detail: string }>;
    expect(plan.map(({ detail }) => detail).join("\n")).toContain(
      "USING INDEX species_revisions_created",
    );
  });

  it("stays out of the public API document", async () => {
    const response = await app.request("/v1/docs/openapi.json", {}, env);
    const document = (await response.json()) as { paths: object };
    expect(Object.keys(document.paths).join()).not.toContain("/admin/site");
  });
});

describe("GET /v1/admin/site/pages", () => {
  it("lists the page groups for an admin session or the token", async () => {
    for (const headers of [
      await adminSessionHeaders(sqlite),
      { Authorization: "Bearer test-token" },
    ]) {
      const { body, response } = await requestJson<{
        data: typeof SITE_PAGE_GROUPS;
        total: number;
      }>("/v1/admin/site/pages", env, { headers });
      expect(response.status).toBe(200);
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(body.data).toEqual(SITE_PAGE_GROUPS);
      expect(body.total).toBe(SITE_PAGE_GROUPS.length);
    }
  });

  it("refuses everyone else", async () => {
    for (const [headers, status] of [
      [{}, 401],
      [await adminSessionHeaders(sqlite, "editor"), 403],
    ] as Array<[Record<string, string>, number]>) {
      const { response } = await requestJson("/v1/admin/site/pages", env, {
        headers,
      });
      expect(response.status).toBe(status);
    }
  });
});

describe("POST /v1/admin/site/pages/:id/revalidate", () => {
  async function clearGroup(id: string, headers?: Record<string, string>) {
    return requestJson<ErrorBody & { data: { id: string } }>(
      `/v1/admin/site/pages/${id}/revalidate`,
      env,
      { headers: headers ?? (await signedIn()), method: "POST" },
    );
  }

  it("asks the site to revalidate that group", async () => {
    const { body, response } = await clearGroup("about");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({ id: "about" });
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
    expect(await request.json()).toEqual({ groups: ["about"] });
  });

  it("answers 404 for an unknown group and 502 when the site fails", async () => {
    expect((await clearGroup("nope")).response.status).toBe(404);
    expect(siteFetch).not.toHaveBeenCalled();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    const { body, response } = await clearGroup("site");
    expect(response.status).toBe(502);
    expect(body.error.code).toBe("site_unavailable");
    log.mockRestore();
  });

  it("needs an admin session from an allowed origin and is rate limited", async () => {
    const session = await adminSessionHeaders(sqlite);
    for (const [headers, status] of [
      [{ Origin: ADMIN_ORIGIN }, 401],
      [{ Authorization: "Bearer test-token", Origin: ADMIN_ORIGIN }, 401],
      [session, 403],
      [{ ...session, Origin: "https://evil.example" }, 403],
    ] as Array<[Record<string, string>, number]>) {
      expect((await clearGroup("about", headers)).response.status).toBe(status);
    }
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    expect((await clearGroup("about")).response.status).toBe(429);
    expect(siteFetch).not.toHaveBeenCalled();
  });
});
