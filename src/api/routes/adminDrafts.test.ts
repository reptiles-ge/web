import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const TOKEN = "test-token";
const ID = "testudo-graeca";
const token = { Authorization: `Bearer ${TOKEN}` };

let env: ApiBindings;
let sqlite: DatabaseSync;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

beforeEach(() => {
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site",
    SITE: { fetch: siteFetch },
  };
});

async function decide(
  draftId: number,
  action: "merge" | "reject",
  headers?: Record<string, string>,
) {
  return requestJson<
    ErrorBody & {
      data: { revalidated: boolean; speciesId: string; version: number };
    }
  >(`/v1/admin/drafts/${draftId}/${action}`, env, {
    headers: headers ?? (await signedIn()),
    method: "POST",
  });
}

async function editByHand() {
  const { record, version } = await live();
  record.base.diet = "edited by hand";
  await app.request(
    `/v1/admin/species/${ID}`,
    {
      body: JSON.stringify({
        actor: "nika",
        expectedVersion: version,
        record,
        source: "admin",
        summary: "Hand edit",
      }),
      headers: { ...token, "Content-Type": "application/json" },
      method: "PUT",
    },
    env,
  );
}

async function live() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, { headers: token });
  return body.data;
}

async function propose(change: (record: SpeciesRecord) => void) {
  const { record, version } = await live();
  change(record);
  const { body } = await requestJson<{ data: { draftId: number } }>(
    `/v1/admin/species/${ID}/drafts`,
    env,
    {
      body: JSON.stringify({
        actor: "claude",
        baseVersion: version,
        record,
        source: "ai",
        summary: "Rewrite overview",
      }),
      headers: { ...token, "Content-Type": "application/json" },
      method: "POST",
    },
  );
  return body.data.draftId;
}

async function signedIn() {
  return { ...(await adminSessionHeaders(sqlite)), Origin: ADMIN_ORIGIN };
}

describe("GET /v1/admin/drafts", () => {
  it("lists pending drafts newest first with the live version", async () => {
    const first = await propose((record) => {
      record.base.overview = "one";
    });
    const second = await propose((record) => {
      record.base.overview = "two";
    });
    const { body, response } = await requestJson<{
      data: Array<Record<string, unknown>>;
      total: number;
    }>("/v1/admin/drafts", env, { headers: await signedIn() });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(body.total).toBe(2);
    expect(body.data.map((draft) => draft.id)).toEqual([second, first]);
    expect(body.data[0]).toMatchObject({
      actor: "claude",
      baseVersion: 1,
      decidedAt: null,
      source: "ai",
      speciesId: ID,
      speciesVersion: 1,
      status: "pending",
      summary: "Rewrite overview",
    });
    expect(body.data[0]).not.toHaveProperty("record");
  });

  it("filters by status and refuses an unknown one", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "one";
    });
    await decide(draftId, "reject");
    const headers = await signedIn();
    const pending = await requestJson<{ data: unknown[] }>(
      "/v1/admin/drafts",
      env,
      { headers },
    );
    expect(pending.body.data).toEqual([]);
    const rejected = await requestJson<{
      data: Array<{ decidedBy: string; status: string }>;
    }>("/v1/admin/drafts?status=rejected", env, { headers });
    expect(rejected.body.data).toMatchObject([
      { decidedBy: "Admin", status: "rejected" },
    ]);
    const bad = await requestJson("/v1/admin/drafts?status=merged", env, {
      headers,
    });
    expect(bad.response.status).toBe(400);
  });

  it("needs an admin session or the token", async () => {
    expect((await app.request("/v1/admin/drafts", {}, env)).status).toBe(401);
    expect(
      (await app.request("/v1/admin/drafts", { headers: token }, env)).status,
    ).toBe(200);
  });
});

describe("GET /v1/admin/drafts/:draftId", () => {
  it("returns the draft with the live record", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const { body, response } = await requestJson<{
      data: {
        current: { record: SpeciesRecord; version: number };
        draft: { id: number; record: SpeciesRecord };
      };
    }>(`/v1/admin/drafts/${draftId}`, env, { headers: await signedIn() });
    expect(response.status).toBe(200);
    expect(body.data.draft.id).toBe(draftId);
    expect(body.data.draft.record.base.overview).toBe("AI overview");
    expect(body.data.current.version).toBe(1);
    expect(body.data.current.record.base.overview).not.toBe("AI overview");
  });

  it("answers 404 for an unknown draft", async () => {
    const { response } = await requestJson("/v1/admin/drafts/9999", env, {
      headers: await signedIn(),
    });
    expect(response.status).toBe(404);
  });
});

describe("POST /v1/admin/drafts/:draftId/merge", () => {
  it("saves the draft as a new version, then clears the species cache", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const { body, response } = await decide(draftId, "merge");
    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      revalidated: true,
      speciesId: ID,
      status: "approved",
      version: 2,
    });
    expect((await live()).record.base.overview).toBe("AI overview");
    expect(
      sqlite
        .prepare("SELECT actor, source, summary FROM species_revisions")
        .all(),
    ).toEqual([{ actor: "Admin", source: "ai", summary: "Rewrite overview" }]);
    expect(
      sqlite.prepare("SELECT status, decided_by FROM species_drafts").all(),
    ).toEqual([{ decided_by: "Admin", status: "approved" }]);
    expect(siteFetch).toHaveBeenCalledOnce();
    expect(await siteFetch.mock.calls[0]![0].json()).toEqual({
      tags: [`species:${ID}`],
    });
  });

  it("reports a merge whose cache clear failed without undoing it", async () => {
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const { body, response } = await decide(draftId, "merge");
    expect(response.status).toBe(200);
    expect(body.data.revalidated).toBe(false);
    expect((await live()).version).toBe(2);
  });

  it("refuses a second merge of the same draft", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    await decide(draftId, "merge");
    const again = await decide(draftId, "merge");
    expect(again.response.status).toBe(400);
    expect(again.body.error.message).toBe("Draft is already approved");
    expect((await live()).version).toBe(2);
    expect(siteFetch).toHaveBeenCalledOnce();
  });

  it("refuses a stale draft and leaves the live record alone", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    await editByHand();
    const stale = await decide(draftId, "merge");
    expect(stale.response.status).toBe(409);
    expect(stale.body.error.code).toBe("version_conflict");
    const { record, version } = await live();
    expect(version).toBe(2);
    expect(record.base.diet).toBe("edited by hand");
    expect(record.base.overview).not.toBe("AI overview");
    expect(sqlite.prepare("SELECT status FROM species_drafts").all()).toEqual([
      { status: "pending" },
    ]);
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("writes nothing when the draft was decided between the read and the write", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const headers = await signedIn();
    const prepare = env.DB.prepare.bind(env.DB);
    let raced = false;
    vi.spyOn(env.DB, "prepare").mockImplementation((sql: string) => {
      if (!raced && sql.startsWith("INSERT INTO species_revisions")) {
        raced = true;
        sqlite
          .prepare(
            "UPDATE species_drafts SET status = 'rejected', decided_by = 'other', decided_at = '2026-01-01T00:00:00.000Z' WHERE id = ?",
          )
          .run(draftId);
      }
      return prepare(sql);
    });
    const outcome = await decide(draftId, "merge", headers);
    expect(outcome.response.status).toBe(400);
    expect(outcome.body.error.message).toBe("Draft is already rejected");
    vi.mocked(env.DB.prepare).mockRestore();
    const { record, version } = await live();
    expect(version).toBe(1);
    expect(record.base.overview).not.toBe("AI overview");
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("needs a signed-in admin from an allowed origin", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const { Cookie } = await adminSessionHeaders(sqlite);
    expect(
      (await decide(draftId, "merge", { Origin: ADMIN_ORIGIN })).response
        .status,
    ).toBe(401);
    expect(
      (await decide(draftId, "merge", { ...token, Origin: ADMIN_ORIGIN }))
        .response.status,
    ).toBe(401);
    expect(
      (
        await decide(draftId, "merge", {
          Cookie,
          Origin: "https://evil.example",
        })
      ).response.status,
    ).toBe(403);
    expect(
      (
        await decide(draftId, "merge", {
          ...(await adminSessionHeaders(sqlite, "editor")),
          Origin: ADMIN_ORIGIN,
        })
      ).response.status,
    ).toBe(403);
    expect((await live()).version).toBe(1);
  });
});

describe("POST /v1/admin/drafts/:draftId/reject", () => {
  it("marks the draft rejected and leaves the species alone", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const { body, response } = await decide(draftId, "reject");
    expect(response.status).toBe(200);
    expect(body.data).toEqual({ status: "rejected" });
    const { record, version } = await live();
    expect(version).toBe(1);
    expect(record.base.overview).not.toBe("AI overview");
    expect(siteFetch).not.toHaveBeenCalled();
    expect((await decide(draftId, "merge")).response.status).toBe(400);
  });

  it("rejects a stale draft", async () => {
    const draftId = await propose((record) => {
      record.base.overview = "AI overview";
    });
    await editByHand();
    expect((await decide(draftId, "reject")).response.status).toBe(200);
    expect((await live()).record.base.diet).toBe("edited by hand");
  });

  it("answers 404 for an unknown draft", async () => {
    expect((await decide(9999, "reject")).response.status).toBe(404);
  });
});
