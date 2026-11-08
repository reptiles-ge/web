import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const TOKEN = "test-token";

let sqlite: DatabaseSync;
let env: ApiBindings;
let session: Record<string, string>;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

async function post<T>(
  body: Record<string, unknown>,
  headers: Record<string, string> = { ...session, Origin: ADMIN_ORIGIN },
  id = ID,
) {
  return requestJson<ErrorBody & { data: T }>(
    `/v1/admin/species/${id}/status`,
    env,
    {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...headers },
      method: "POST",
    },
  );
}

async function record() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return body.data;
}

beforeEach(async () => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site",
    SITE: { fetch: siteFetch },
  };
  session = await adminSessionHeaders(sqlite);
});

describe("POST /v1/admin/species/:id/status", () => {
  it("unpublishes and republishes a species with a revision each time", async () => {
    const before = await record();
    expect(before.record.status).toBe("published");
    const { body, response } = await post<{ status: string; version: number }>({
      expectedVersion: before.version,
      status: "unpublished",
    });
    expect(response.status).toBe(200);
    expect(body.data).toStrictEqual({
      status: "unpublished",
      version: before.version + 1,
    });
    const after = await record();
    expect(after.record.status).toBe("unpublished");
    expect({ ...after.record, status: "published" }).toStrictEqual(
      before.record,
    );
    expect(
      sqlite
        .prepare(
          "SELECT actor, source, summary FROM species_revisions WHERE species_id = ? AND version = ?",
        )
        .get(ID, before.version + 1),
    ).toEqual({
      actor: "Admin",
      source: "admin",
      summary: "Set status unpublished",
    });
    const back = await post<{ status: string; version: number }>({
      expectedVersion: after.version,
      status: "published",
    });
    expect(back.body.data.version).toBe(after.version + 1);
    expect((await record()).record.status).toBe("published");
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("refuses an unchanged or unknown status", async () => {
    const { version } = await record();
    const same = await post({ expectedVersion: version, status: "published" });
    expect(same.response.status).toBe(400);
    expect(same.body.error.code).toBe("invalid_request");
    const unknown = await post({ expectedVersion: version, status: "hidden" });
    expect(unknown.response.status).toBe(400);
    expect(unknown.body.error.code).toBe("invalid_request");
    expect((await record()).version).toBe(version);
  });

  it("answers 409 on a stale version, 404 for an unknown species and 401 without a session", async () => {
    const { version } = await record();
    expect(
      (await post({ expectedVersion: version + 1, status: "draft" })).response
        .status,
    ).toBe(409);
    expect(
      (
        await post(
          { expectedVersion: 1, status: "draft" },
          undefined,
          "no-such-species",
        )
      ).response.status,
    ).toBe(404);
    expect(
      (
        await post(
          { expectedVersion: version, status: "draft" },
          { Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN },
        )
      ).response.status,
    ).toBe(401);
    expect((await record()).record.status).toBe("published");
  });
});
