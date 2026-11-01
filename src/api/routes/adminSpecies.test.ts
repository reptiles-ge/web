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
    const stamped = after.record.base.updatedAt;
    expect(stamped).not.toBe(record.base.updatedAt);
    expect(after.record.translations.en.updatedAt).toBe(stamped);
    expect(after.record.translations.ru.updatedAt).toBe(
      record.translations.ru.updatedAt,
    );
    expect(after.record.translations.tr.updatedAt).toBe(
      record.translations.tr.updatedAt,
    );
    record.base.updatedAt = stamped;
    record.translations.en.updatedAt = stamped;
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

  it("refuses a write that adds page talk and names the field", async () => {
    const { record } = (await getRecord()).body.data;
    record.translations.en.diet = "Diet is not given on this page.";
    const response = await put(ID, edit(record));
    expect(response.status).toBe(400);
    expect(((await response.json()) as ErrorBody).error).toMatchObject({
      code: "invalid_request",
      details: [
        {
          message: "Page talk: “not given on this page”",
          path: ["translations", "en", "diet"],
        },
      ],
    });
    expect((await getRecord()).body.data.version).toBe(1);
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
    const writes = new WeakSet<object>();
    const tag = (query: string, statement: object): object => {
      if (/^\s*(?:DELETE|INSERT|UPDATE)/i.test(query)) writes.add(statement);
      return statement;
    };
    env.DB = {
      ...real,
      batch: async (statements) => {
        if (statements.some((statement) => writes.has(statement))) {
          sqlite
            .prepare("UPDATE species SET version = version + 1 WHERE id = ?")
            .run(ID);
        }
        return real.batch(statements);
      },
      prepare: (query) => {
        const statement = real.prepare(query);
        return {
          ...statement,
          bind: (...values: unknown[]) =>
            tag(query, statement.bind(...values)) as ReturnType<
              typeof statement.bind
            >,
        };
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
    limit: number;
    page: number;
    pageCount: number;
    total: number;
  };

  const auth = { Authorization: `Bearer ${TOKEN}` };

  function signIn(role?: string, expiresInMs?: number) {
    return adminSessionHeaders(sqlite, role, expiresInMs);
  }

  function list(headers: Record<string, string> = {}, query = "") {
    return requestJson<ErrorBody & ListBody>(`/v1/admin/species${query}`, env, {
      headers,
    });
  }

  it("lists every species, published or not, in catalog order by page", async () => {
    const rows = sqlite
      .prepare("SELECT id, status FROM species ORDER BY catalog_position")
      .all() as Array<{ id: string; status: string }>;
    const first = await list(auth, "?limit=100");
    expect(first.response.status).toBe(200);
    expect(first.response.headers.get("Cache-Control")).toBe("no-store");
    expect(first.body).toMatchObject({
      limit: 100,
      page: 1,
      pageCount: Math.ceil(rows.length / 100),
      total: rows.length,
    });
    const second = await list(auth, "?limit=100&page=2");
    const listed = [...first.body.data, ...second.body.data];
    expect(listed.map(({ id, status }) => ({ id, status }))).toEqual(rows);
    expect(listed.some(({ status }) => status !== "published")).toBe(true);
    const { body } = first;
    expect(body.data.find(({ id }) => id === ID)).toMatchObject({
      commonName: { en: expect.any(String), ka: "გიურზა" },
      group: "snake",
      lastEditedAt: null,
      pendingDrafts: 0,
      photoCount: expect.any(Number),
      version: 1,
    });
  });

  it("pages with the default size", async () => {
    const { body } = await list(auth);
    expect(body.limit).toBe(50);
    expect(body.data).toHaveLength(50);
  });

  it("filters by group and status and searches names", async () => {
    const snakes = await list(auth, "?group=snake&limit=100");
    expect(snakes.body.data.length).toBeGreaterThan(0);
    expect(snakes.body.data.every(({ group }) => group === "snake")).toBe(true);
    expect(snakes.body.total).toBe(snakes.body.data.length);
    const hidden = await list(auth, "?status=unpublished&limit=100");
    expect(hidden.body.data.map(({ id }) => id)).toContain(
      "dolichophis-caspius",
    );
    expect(
      hidden.body.data.every(({ status }) => status === "unpublished"),
    ).toBe(true);
    for (const q of ["გიურზა", "lebetin", ID]) {
      const found = await list(auth, `?q=${encodeURIComponent(q)}`);
      expect(found.body.data.map(({ id }) => id)).toContain(ID);
    }
    const none = await list(auth, "?q=%25");
    expect(none.body).toMatchObject({ data: [], total: 0 });
  });

  it.each(["?page=0", "?limit=101", "?group=fish", "?status=gone"])(
    "rejects %s",
    async (query) => {
      const { body, response } = await list(auth, query);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    },
  );

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
    const { body } = await list(auth, `?q=${ID}`);
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

  it("lets a session read one record, but keeps writes and drafts token-only", async () => {
    const session = await signIn();
    const read = await app.request(
      `/v1/admin/species/${ID}`,
      { headers: session },
      env,
    );
    expect(read.status).toBe(200);
    const drafts = await app.request(
      `/v1/admin/species/${ID}/drafts`,
      { headers: session },
      env,
    );
    expect(drafts.status).toBe(401);
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

describe("GET /v1/admin/species/:id/field-records", () => {
  type FieldRecordsBody = {
    data: Array<{ lat: number; lng: number; locality: string }>;
    id: string;
    total: number;
  };

  function fieldRecords(id: string, headers: Record<string, string>) {
    return requestJson<ErrorBody & FieldRecordsBody>(
      `/v1/admin/species/${id}/field-records`,
      env,
      { headers },
    );
  }

  it("returns every field record of a species in position order", async () => {
    const id = (
      sqlite
        .prepare(
          "SELECT species_id AS id FROM species_field_records GROUP BY species_id ORDER BY COUNT(*) DESC LIMIT 1",
        )
        .get() as { id: string }
    ).id;
    const expected = sqlite
      .prepare(
        "SELECT locality FROM species_field_records WHERE species_id = ? ORDER BY position",
      )
      .all(id) as Array<{ locality: string }>;
    const { body, response } = await fieldRecords(
      id,
      await adminSessionHeaders(sqlite),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.id).toBe(id);
    expect(body.total).toBe(expected.length);
    expect(body.data.map(({ locality }) => locality)).toEqual(
      expected.map(({ locality }) => locality),
    );
  });

  it("answers 404 for an unknown species and refuses non-admins", async () => {
    const token = { Authorization: `Bearer ${TOKEN}` };
    expect((await fieldRecords("no-such-species", token)).response.status).toBe(
      404,
    );
    expect((await fieldRecords(ID, {})).response.status).toBe(401);
    expect(
      (await fieldRecords(ID, await adminSessionHeaders(sqlite, "editor")))
        .response.status,
    ).toBe(403);
  });
});

describe("POST /v1/admin/species/:id/revalidate", () => {
  const ADMIN_ORIGIN = "https://admin.reptiles.ge";

  async function revalidate(id: string, headers?: Record<string, string>) {
    return requestJson<ErrorBody & { data: { id: string } }>(
      `/v1/admin/species/${id}/revalidate`,
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
    env.ALLOWED_ORIGINS = `https://reptiles.ge,${ADMIN_ORIGIN}`;
  });

  it("revalidates that species' pages and the pages built from the catalog", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { body, response } = await revalidate(ID);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({ id: ID });
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
    expect(await request.json()).toEqual({
      tags: ["species", `species:${ID}`],
    });
    expect(log).toHaveBeenCalledWith("API cache purge is not configured");
    log.mockRestore();
  });

  it("purges the species and catalog API cache in every data center before revalidating the site", async () => {
    const order: string[] = [];
    const purge = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(
      async () => {
        order.push("purge");
        return Response.json({ success: true });
      },
    );
    vi.stubGlobal("fetch", purge);
    siteFetch.mockImplementation(async () => {
      order.push("site");
      return new Response(null, { status: 204 });
    });
    env.CACHE_PURGE_TOKEN = "purge-token";
    env.CACHE_PURGE_ZONE_ID = "zone-1";
    try {
      expect((await revalidate(ID)).response.status).toBe(200);
      expect(order).toEqual(["purge", "site"]);
      const [url, init] = purge.mock.calls[0]!;
      expect(url).toBe(
        "https://api.cloudflare.com/client/v4/zones/zone-1/purge_cache",
      );
      expect((init.headers as Record<string, string>).Authorization).toBe(
        "Bearer purge-token",
      );
      expect(JSON.parse(init.body as string)).toEqual({
        tags: [`api:species:${ID}`, "api:catalog", "api:images"],
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("still revalidates the site but answers 502 when the purge fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ success: false }, { status: 429 })),
    );
    env.CACHE_PURGE_TOKEN = "purge-token";
    env.CACHE_PURGE_ZONE_ID = "zone-1";
    try {
      const { body, response } = await revalidate(ID);
      expect(response.status).toBe(502);
      expect(body.error).toMatchObject({
        code: "site_unavailable",
        message: "The cache could not be cleared",
      });
      expect(siteFetch).toHaveBeenCalledOnce();
      expect(log).toHaveBeenCalledWith("API cache purge answered 429");
    } finally {
      vi.unstubAllGlobals();
      log.mockRestore();
    }
  });

  it("answers 404 for an unknown species and 502 when the site fails", async () => {
    expect((await revalidate("no-such-species")).response.status).toBe(404);
    expect(siteFetch).not.toHaveBeenCalled();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    const { body, response } = await revalidate(ID);
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
      expect((await revalidate(ID, headers)).response.status).toBe(status);
    }
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    expect((await revalidate(ID)).response.status).toBe(429);
    expect(siteFetch).not.toHaveBeenCalled();
  });
});

describe("POST /v1/admin/species/:id/texts", () => {
  const ADMIN_ORIGIN = "https://admin.reptiles.ge";

  type Texts = Record<string, unknown>;

  function textsOf(target: SpeciesRecord["base"]): Texts {
    const identification = target.identification
      ? {
          ...(target.identification.coloration === undefined
            ? {}
            : { coloration: target.identification.coloration }),
          summary: target.identification.summary,
          traits: target.identification.traits,
        }
      : undefined;
    return {
      behavior: target.behavior,
      commonName: target.commonName,
      conservation: target.conservation,
      description: target.description,
      diet: target.diet,
      facts: target.facts,
      ...(target.faq ? { faq: target.faq } : {}),
      habitat: target.habitat,
      ...(identification ? { identification } : {}),
      ...(target.interaction === undefined
        ? {}
        : { interaction: target.interaction }),
      location: target.location,
      overview: target.overview,
      stats: target.stats,
    };
  }

  async function saveTexts(
    body: Record<string, unknown>,
    headers?: Record<string, string>,
    id = ID,
  ) {
    return requestJson<
      ErrorBody & { data: { id: string; locale: string; version: number } }
    >(`/v1/admin/species/${id}/texts`, env, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(headers ?? {
          ...(await adminSessionHeaders(sqlite)),
          Origin: ADMIN_ORIGIN,
        }),
      },
      method: "POST",
    });
  }

  beforeEach(() => {
    env.ALLOWED_ORIGINS = `https://reptiles.ge,${ADMIN_ORIGIN}`;
  });

  it("saves one locale's texts and keeps everything else", async () => {
    const before = (await getRecord()).body.data.record;
    const texts = textsOf(before.translations.en as SpeciesRecord["base"]);
    texts.overview = "A new English overview.";
    texts.facts = (texts.facts as string[]).map((fact) => `${fact}!`);
    const { body, response } = await saveTexts({
      expectedVersion: 1,
      locale: "en",
      summary: "Edit English texts",
      texts,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({ id: ID, locale: "en", version: 2 });
    const after = (await getRecord()).body.data;
    expect(after.version).toBe(2);
    expect(after.record.translations.en.overview).toBe(
      "A new English overview.",
    );
    expect(after.record.translations.en.facts).toEqual(texts.facts);
    expect(after.record.base).toEqual(before.base);
    expect(after.record.translations.ru).toEqual(before.translations.ru);
    expect(after.record.translations.en.gallery).toEqual(
      before.translations.en.gallery,
    );
    expect(
      sqlite
        .prepare(
          "SELECT actor, source, summary FROM species_revisions WHERE species_id = ? AND version = 2",
        )
        .get(ID),
    ).toEqual({
      actor: "Admin",
      source: "admin",
      summary: "Edit English texts",
    });
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("keeps Georgian colours and photos on a Georgian edit", async () => {
    const before = (await getRecord()).body.data.record;
    const texts = textsOf(before.base);
    texts.commonName = "ახალი სახელი";
    expect(
      (
        await saveTexts({
          expectedVersion: 1,
          locale: "ka",
          summary: "Rename",
          texts,
        })
      ).response.status,
    ).toBe(200);
    const after = (await getRecord()).body.data.record;
    expect(after.base.updatedAt).not.toBe(before.base.updatedAt);
    expect(after.base).toEqual({
      ...before.base,
      commonName: "ახალი სახელი",
      updatedAt: after.base.updatedAt,
    });
    expect(after.translations).toEqual(before.translations);
  });

  it("dates only the locale whose text changed", async () => {
    const before = (await getRecord()).body.data.record;
    const texts = textsOf(before.translations.en as SpeciesRecord["base"]);
    texts.commonName = "New name";
    expect(
      (
        await saveTexts({
          expectedVersion: 1,
          locale: "en",
          summary: "Rename",
          texts,
        })
      ).response.status,
    ).toBe(200);
    const after = (await getRecord()).body.data.record;
    expect(after.base.updatedAt).toBe(before.base.updatedAt);
    expect(after.translations.en.updatedAt).not.toBe(
      before.translations.en.updatedAt,
    );
    expect(after.translations.ru.updatedAt).toBe(
      before.translations.ru.updatedAt,
    );
  });

  it("keeps every date when the text is saved unchanged", async () => {
    const before = (await getRecord()).body.data.record;
    expect(
      (
        await saveTexts({
          expectedVersion: 1,
          locale: "ka",
          summary: "No change",
          texts: textsOf(before.base),
        })
      ).response.status,
    ).toBe(200);
    const after = (await getRecord()).body.data.record;
    expect(after.base.updatedAt).toBe(before.base.updatedAt);
    expect(after.translations).toEqual(before.translations);
  });

  it("refuses list changes, stale versions and unknown species", async () => {
    const before = (await getRecord()).body.data.record;
    const texts = textsOf(before.base);
    const stats = texts.stats as unknown[];
    expect(stats.length).toBeGreaterThan(0);
    const refused = await saveTexts({
      expectedVersion: 1,
      locale: "ka",
      summary: "x",
      texts: { ...texts, stats: stats.slice(1) },
    });
    expect(refused.response.status).toBe(400);
    expect(refused.body.error.code).toBe("invalid_request");
    const emptyName = await saveTexts({
      expectedVersion: 1,
      locale: "ka",
      summary: "x",
      texts: { ...texts, commonName: "" },
    });
    expect(emptyName.response.status).toBe(400);
    const stale = await saveTexts({
      expectedVersion: 7,
      locale: "ka",
      summary: "x",
      texts,
    });
    expect(stale.response.status).toBe(409);
    expect(stale.body.error.code).toBe("version_conflict");
    const missing = await saveTexts(
      { expectedVersion: 1, locale: "ka", summary: "x", texts },
      undefined,
      "no-such-species",
    );
    expect(missing.response.status).toBe(404);
    expect((await getRecord()).body.data.version).toBe(1);
  });

  it("needs an admin session from an allowed origin and is rate limited", async () => {
    const texts = textsOf((await getRecord()).body.data.record.base);
    const body = { expectedVersion: 1, locale: "ka", summary: "x", texts };
    const session = await adminSessionHeaders(sqlite);
    for (const [headers, status] of [
      [{ Origin: ADMIN_ORIGIN }, 401],
      [{ Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN }, 401],
      [session, 403],
      [{ ...session, Origin: "https://evil.example" }, 403],
    ] as Array<[Record<string, string>, number]>) {
      expect((await saveTexts(body, headers)).response.status).toBe(status);
    }
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    expect((await saveTexts(body)).response.status).toBe(429);
  });
});
