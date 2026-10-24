import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { readSpeciesCatalog } from "../db/speciesCatalog";
import { readSpeciesRecord } from "../db/speciesWrite";
import { speciesRecordSchema } from "../schemas/speciesRecord";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionHeaders,
} from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const ID = "macrovipera-lebetina";

let sqlite: DatabaseSync;
let env: ApiBindings;
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

type RecordBody = { data: { record: SpeciesRecord; version: number } };

function edit(record: SpeciesRecord, expectedVersion = 1) {
  return {
    actor: "nika",
    expectedVersion,
    record,
    source: "admin",
    summary: "Edit",
  };
}

async function getRecord(id = ID) {
  return requestJson<RecordBody>(`/v1/admin/species/${id}`, env, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
}

function put(id: string, body: unknown, token: null | string = TOKEN) {
  return app.request(
    `/v1/admin/species/${id}`,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      method: "PUT",
    },
    env,
    executionCtx,
  );
}

beforeEach(() => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  pending = [];
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
  };
});

describe("photo authors", () => {
  it("keeps every photo linked to its author after a record write", async () => {
    const linked = () =>
      sqlite
        .prepare(
          "SELECT id, author_id FROM species_media WHERE species_id = ? AND credit_person IS NOT NULL ORDER BY role, position",
        )
        .all(ID) as Array<{ author_id: null | string }>;
    const before = linked();
    expect(before.length).toBeGreaterThan(0);
    expect(before.every((row) => row.author_id)).toBe(true);
    const { body } = await getRecord();
    expect((await put(ID, edit(body.data.record))).status).toBe(200);
    expect(linked().map((row) => row.author_id)).toEqual(
      before.map((row) => row.author_id),
    );
  });
});

describe("species record validation", () => {
  it("accepts every species in the catalog as it is today", async () => {
    for (const id of (await readSpeciesCatalog(env.DB)).catalogIds) {
      const found = await readSpeciesRecord(env.DB, id);
      const result = speciesRecordSchema.safeParse(found?.record);
      expect(
        result.success,
        `${id}: ${JSON.stringify(result.error?.issues)}`,
      ).toBe(true);
    }
  });
});

describe("GET /v1/admin/species/:id", () => {
  it("returns the full record and its version behind the token", async () => {
    const { body, response } = await getRecord();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data.version).toBe(1);
    expect(body.data.record.base.id).toBe(ID);
    expect(body.data.record.slugs).toContain("giurza");
    expect((await app.request(`/v1/admin/species/${ID}`, {}, env)).status).toBe(
      401,
    );
    expect((await getRecord("no-such-species")).response.status).toBe(404);
  });
});

describe("PUT /v1/admin/species/:id", () => {
  it("writes the record atomically and bumps the version without revalidating the site", async () => {
    const { record } = (await getRecord()).body.data;
    record.base.overview = "ახალი მიმოხილვა";
    record.translations.en.overview = "New overview";
    record.base.gallery.reverse();
    const response = await put(ID, edit(record));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: { id: ID, version: 2 } });

    const after = (await getRecord()).body.data;
    expect(after.version).toBe(2);
    expect(after.record).toStrictEqual(record);

    const publicEn = await requestJson<{ data: { overview: string } }>(
      `/v1/species/${ID}`,
      env,
      { headers: { "X-Locale": "en" } },
    );
    expect(publicEn.body.data.overview).toBe("New overview");

    expect(
      sqlite
        .prepare(
          "SELECT version, actor, source, summary FROM species_revisions",
        )
        .all(),
    ).toEqual([
      { actor: "nika", source: "admin", summary: "Edit", version: 2 },
    ]);

    await Promise.all(pending);
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("refuses a stale version without changing anything", async () => {
    const { record } = (await getRecord()).body.data;
    record.base.overview = "first";
    expect((await put(ID, edit(record))).status).toBe(200);
    record.base.overview = "second";
    const stale = await put(ID, edit(record, 1));
    expect(stale.status).toBe(409);
    expect(((await stale.json()) as ErrorBody).error.code).toBe(
      "version_conflict",
    );
    expect((await getRecord()).body.data.record.base.overview).toBe("first");
  });

  it("answers 409 when another write wins the race", async () => {
    const { record } = (await getRecord()).body.data;
    const real = env.DB;
    env.DB = {
      ...real,
      batch: async (statements) => {
        sqlite
          .prepare("UPDATE species SET version = version + 1 WHERE id = ?")
          .run(ID);
        return real.batch(statements);
      },
    };
    record.base.overview = "late";
    const response = await put(ID, edit(record));
    env.DB = real;
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({
      error: { code: "version_conflict", details: { currentVersion: 2 } },
    });
    expect((await getRecord()).body.data.record.base.overview).not.toBe("late");
  });

  it("rethrows a failed write when the version did not move", async () => {
    const { record } = (await getRecord()).body.data;
    const real = env.DB;
    env.DB = {
      ...real,
      batch: async () => {
        throw new Error("disk full");
      },
    };
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await put(ID, edit(record));
    env.DB = real;
    log.mockRestore();
    expect(response.status).toBe(500);
  });

  it("rolls back the whole write when the database rejects it", async () => {
    const { record } = (await getRecord()).body.data;
    const before = structuredClone(record);
    record.base.overview = "changed";
    record.lookalikes = ["no-such-species"];
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await put(ID, edit(record))).status).toBe(500);
    log.mockRestore();
    const after = (await getRecord()).body.data;
    expect(after.version).toBe(1);
    expect(after.record).toStrictEqual(before);
  });

  it("enforces the content rules before writing", async () => {
    const { record } = (await getRecord()).body.data;
    const cases: Array<[string, (value: SpeciesRecord) => void]> = [
      ["faq count", (value) => value.translations.en.faq?.pop()],
      [
        "colors",
        (value) => {
          value.translations.ru.identification = {
            ...value.translations.ru.identification!,
            colors: ["green"],
          };
        },
      ],
      [
        "overlay src",
        (value) => {
          value.translations.tr.gallery = [
            { src: "https://cdn.reptiles.ge/missing.jpg" },
          ];
        },
      ],
      [
        "danger on a bird",
        (value) => {
          value.group = "bird";
        },
      ],
      [
        "sources",
        (value) => {
          value.base.sources = [];
        },
      ],
      [
        "half coordinates",
        (value) => {
          value.base.imageCredit = { lat: 41 };
        },
      ],
      [
        "unknown key",
        (value) => {
          (value.base as unknown as Record<string, unknown>).extra = 1;
        },
      ],
    ];
    for (const [name, mutate] of cases) {
      const copy = structuredClone(record);
      mutate(copy);
      const response = await put(ID, edit(copy));
      expect(response.status, name).toBe(400);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "invalid_request",
      );
    }
    const mismatch = await put("vipera-dinniki", edit(record));
    expect(mismatch.status).toBe(400);
    expect((await getRecord()).body.data.version).toBe(1);
  });

  it("requires the token", async () => {
    const { record } = (await getRecord()).body.data;
    expect((await put(ID, edit(record), null)).status).toBe(401);
    expect((await put(ID, edit(record), "wrong")).status).toBe(401);
  });
});

describe("GET /v1/admin/species", () => {
  type ListBody = {
    data: Array<{
      commonName: { en: null | string; ka: string };
      group: string;
      id: string;
      lastEditedAt: null | string;
      pendingDrafts: number;
      photoCount: number;
      status: string;
      version: number;
    }>;
    total: number;
  };

  function signIn(role?: string, expiresInMs?: number) {
    return adminSessionHeaders(sqlite, role, expiresInMs);
  }

  function list(headers: Record<string, string> = {}) {
    return requestJson<ErrorBody & ListBody>("/v1/admin/species", env, {
      headers,
    });
  }

  it("lists every species, published or not, in catalog order", async () => {
    const { body, response } = await list({
      Authorization: `Bearer ${TOKEN}`,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const rows = sqlite
      .prepare("SELECT id, status FROM species ORDER BY catalog_position")
      .all() as Array<{ id: string; status: string }>;
    expect(body.total).toBe(rows.length);
    expect(body.data.map(({ id, status }) => ({ id, status }))).toEqual(rows);
    expect(body.data.some(({ status }) => status !== "published")).toBe(true);
    expect(body.data.find(({ id }) => id === ID)).toMatchObject({
      commonName: { en: expect.any(String), ka: "გიურზა" },
      group: "snake",
      lastEditedAt: null,
      pendingDrafts: 0,
      photoCount: expect.any(Number),
      version: 1,
    });
  });

  it("counts pending drafts and shows the last edit", async () => {
    sqlite
      .prepare(
        "INSERT INTO species_drafts (species_id, base_version, source, actor, summary, record) VALUES (?, 1, 'ai', 'bot', 'Draft', '{}')",
      )
      .run(ID);
    sqlite
      .prepare(
        "INSERT INTO species_revisions (species_id, version, actor, source, summary, created_at) VALUES (?, 2, 'nika', 'admin', 'Edit', '2026-10-23T10:00:00.000Z')",
      )
      .run(ID);
    const { body } = await list({ Authorization: `Bearer ${TOKEN}` });
    expect(body.data.find(({ id }) => id === ID)).toMatchObject({
      lastEditedAt: "2026-10-23T10:00:00.000Z",
      pendingDrafts: 1,
    });
  });

  it("lets a signed-in admin read the list", async () => {
    const { body, response } = await list(await signIn());
    expect(response.status).toBe(200);
    expect(body.total).toBeGreaterThan(100);
  });

  it("refuses everyone else", async () => {
    const cases: Array<[Record<string, string>, number]> = [
      [{}, 401],
      [{ Authorization: "Bearer wrong" }, 401],
      [{ Cookie: `${ADMIN_SESSION_COOKIE}=made-up` }, 401],
      [await signIn("admin", -1000), 401],
      [await signIn("editor"), 403],
    ];
    for (const [headers, status] of cases) {
      const { body, response } = await list(headers);
      expect(response.status).toBe(status);
      expect(body.data).toBeUndefined();
    }
  });

  it("keeps every other admin species route token-only", async () => {
    const session = await signIn();
    const read = await app.request(
      `/v1/admin/species/${ID}`,
      { headers: session },
      env,
    );
    expect(read.status).toBe(401);
    const write = await app.request(
      `/v1/admin/species/${ID}`,
      {
        body: JSON.stringify({}),
        headers: { ...session, "Content-Type": "application/json" },
        method: "PUT",
      },
      env,
    );
    expect(write.status).toBe(401);
  });
});
