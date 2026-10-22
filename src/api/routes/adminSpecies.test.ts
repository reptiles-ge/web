import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { speciesImportSource } from "@/lib/speciesImportSource";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { readSpeciesRecord } from "../db/speciesWrite";
import { speciesRecordSchema } from "../schemas/speciesRecord";
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

describe("species record validation", () => {
  it("accepts every species in the catalog as it is today", async () => {
    for (const id of speciesImportSource().catalogIds) {
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
  it("writes the record atomically, bumps the version and revalidates the site", async () => {
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
      `/v1/species/${ID}?locale=en`,
      env,
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
    const [request] = siteFetch.mock.calls[0] as [Request];
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
    expect(await request.json()).toEqual({
      tags: ["species", `species:${ID}`],
    });
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

  it("logs when the site cannot be revalidated", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { record } = (await getRecord()).body.data;
    env.SITE = undefined;
    expect((await put(ID, edit(record))).status).toBe(200);
    await Promise.all(pending);
    expect(log).toHaveBeenCalledWith("Site revalidation is not configured");
    env.SITE = {
      fetch: vi.fn(async () => new Response(null, { status: 500 })),
    };
    expect((await put(ID, edit(record, 2))).status).toBe(200);
    env.SITE = {
      fetch: vi.fn(async () => {
        throw new Error("down");
      }),
    };
    expect((await put(ID, edit(record, 3))).status).toBe(200);
    await Promise.all(pending);
    expect(log).toHaveBeenCalledWith("Site revalidation answered 500");
    expect(log).toHaveBeenCalledWith(
      "Site revalidation failed",
      expect.any(Error),
    );
    log.mockRestore();
  });
});
