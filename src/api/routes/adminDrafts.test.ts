import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const ID = "testudo-graeca";
const auth = { Authorization: `Bearer ${TOKEN}` };

let env: ApiBindings;
let sqlite: DatabaseSync;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;
let pending: Array<Promise<unknown>>;

const executionCtx = {
  passThroughOnException: () => {},
  props: {},
  waitUntil: (promise: Promise<unknown>) => {
    pending.push(promise);
  },
};

async function current() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, { headers: auth });
  return body.data;
}

async function post<T>(
  path: string,
  body: unknown,
  token: null | string = TOKEN,
) {
  const response = await app.request(
    `/v1/admin/species/${ID}${path}`,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      method: "POST",
    },
    env,
    executionCtx,
  );
  return { body: (await response.json()) as T, response };
}

async function propose(
  change: (record: SpeciesRecord) => void,
  baseVersion?: number,
) {
  const { record, version } = await current();
  change(record);
  return post<{ data: { draftId: number } }>("/drafts", {
    actor: "ai-texts",
    baseVersion: baseVersion ?? version,
    record,
    source: "ai",
    summary: "Rewrite overview",
  });
}

beforeEach(() => {
  pending = [];
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  env = {
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site",
    SITE: { fetch: siteFetch },
  };
});

describe("species drafts", () => {
  it("stores a draft without touching the live record", async () => {
    const { body, response } = await propose((record) => {
      record.base.overview = "AI overview";
    });
    expect(response.status).toBe(201);
    expect(body.data.draftId).toBeGreaterThan(0);
    expect((await current()).record.base.overview).not.toBe("AI overview");
    const list = await requestJson<{
      data: Array<{
        id: number;
        record: SpeciesRecord;
        source: string;
        summary: string;
      }>;
    }>(`/v1/admin/species/${ID}/drafts`, env, { headers: auth });
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]).toMatchObject({
      id: body.data.draftId,
      source: "ai",
      summary: "Rewrite overview",
    });
    expect(list.body.data[0]!.record.base.overview).toBe("AI overview");
  });

  it("refuses a stale or invalid draft", async () => {
    const stale = await propose((record) => {
      record.base.overview = "x";
    }, 7);
    expect(stale.response.status).toBe(409);
    const invalid = await propose((record) => {
      record.base.sources = [];
    });
    expect(invalid.response.status).toBe(400);
  });

  it("publishes an approved draft as a revision and revalidates the site", async () => {
    const { body } = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const approved = await post<{ data: { status: string; version: number } }>(
      `/drafts/${body.data.draftId}/approve`,
      { actor: "nika" },
    );
    expect(approved.response.status).toBe(200);
    expect(approved.body.data).toEqual({ status: "approved", version: 2 });
    expect((await current()).record.base.overview).toBe("AI overview");
    expect(
      sqlite
        .prepare("SELECT actor, source, summary FROM species_revisions")
        .all(),
    ).toEqual([{ actor: "nika", source: "ai", summary: "Rewrite overview" }]);
    expect(
      sqlite.prepare("SELECT status, decided_by FROM species_drafts").all(),
    ).toEqual([{ decided_by: "nika", status: "approved" }]);
    await Promise.all(pending);
    expect(siteFetch).toHaveBeenCalledTimes(1);
    const again = await post<ErrorBody>(
      `/drafts/${body.data.draftId}/approve`,
      {
        actor: "nika",
      },
    );
    expect(again.response.status).toBe(400);
    expect(again.body.error.message).toBe("Draft is already approved");
  });

  it("keeps a draft pending when the species moved on, so it can be rejected", async () => {
    const { body } = await propose((record) => {
      record.base.overview = "AI overview";
    });
    const { record, version } = await current();
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
        headers: { ...auth, "Content-Type": "application/json" },
        method: "PUT",
      },
      env,
      executionCtx,
    );
    const stale = await post<ErrorBody>(
      `/drafts/${body.data.draftId}/approve`,
      {
        actor: "nika",
      },
    );
    expect(stale.response.status).toBe(409);
    expect((await current()).record.base.diet).toBe("edited by hand");
    const rejected = await post<{ data: { status: string } }>(
      `/drafts/${body.data.draftId}/reject`,
      { actor: "nika" },
    );
    expect(rejected.body.data.status).toBe("rejected");
    const list = await requestJson<{ data: unknown[] }>(
      `/v1/admin/species/${ID}/drafts`,
      env,
      { headers: auth },
    );
    expect(list.body.data).toEqual([]);
  });

  it("answers 404 for an unknown draft or another species, and 401 without a token", async () => {
    const { body } = await propose((record) => {
      record.base.overview = "AI overview";
    });
    expect(
      (await post(`/drafts/9999/approve`, { actor: "nika" })).response.status,
    ).toBe(404);
    const other = await app.request(
      `/v1/admin/species/emys-orbicularis/drafts/${body.data.draftId}/reject`,
      {
        body: JSON.stringify({ actor: "nika" }),
        headers: { ...auth, "Content-Type": "application/json" },
        method: "POST",
      },
      env,
    );
    expect(other.status).toBe(404);
    expect(
      (await post(`/drafts/${body.data.draftId}/approve`, { actor: "x" }, null))
        .response.status,
    ).toBe(401);
  });
});
