import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const URL = "/v1/species/testudo-graeca";

class MemoryCache {
  private readonly entries = new Map<string, Response>();
  async delete(request: Request | string) {
    return this.entries.delete(key(request));
  }
  async match(request: Request | string) {
    return this.entries.get(key(request))?.clone();
  }
  async put(request: Request | string, response: Response) {
    this.entries.set(key(request), response.clone());
  }
}

function key(request: Request | string) {
  return typeof request === "string" ? request : request.url;
}

const stores = new Map<string, MemoryCache>();

vi.stubGlobal("caches", {
  open: async (name: string) => {
    if (!stores.has(name)) stores.set(name, new MemoryCache());
    return stores.get(name);
  },
});

let app: (typeof import("../app"))["app"];
let env: ApiBindings;
let sqlite: ReturnType<typeof createSpeciesTestDatabase>["sqlite"];

async function overview(headers: Record<string, string> = {}) {
  const pending: Array<Promise<unknown>> = [];
  const init = { headers: { "X-Locale": "en", ...headers } };
  const response = await app.request(URL, init, env, {
    passThroughOnException: () => {},
    props: {},
    waitUntil: (promise: Promise<unknown>) => {
      pending.push(promise);
    },
  });
  await Promise.all(pending);
  return ((await response.json()) as { data: { overview: string } }).data
    .overview;
}

beforeAll(async () => {
  vi.resetModules();
  ({ app } = await import("../app"));
});

beforeEach(() => {
  stores.clear();
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  env = { DB: database.db, REVALIDATE_TOKEN: "fresh-secret" };
});

describe("edgeCache", () => {
  it("serves repeat requests from the cache, even with a public no-cache header", async () => {
    const first = await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'testudo-graeca' AND locale = 'en'",
      )
      .run();
    expect(await overview()).toBe(first);
    expect(await overview({ "Cache-Control": "no-cache" })).toBe(first);
    expect(await overview({ "X-Cache-Bypass": "wrong" })).toBe(first);
  });

  it("keeps a separate entry per locale header", async () => {
    const english = await overview();
    const georgian = await overview({ "X-Locale": "ka" });
    expect(georgian).not.toBe(english);
    expect(await overview()).toBe(english);
  });

  it("reads D1 directly only with the bypass secret", async () => {
    await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'testudo-graeca' AND locale = 'en'",
      )
      .run();
    expect(await overview({ "X-Cache-Bypass": "fresh-secret" })).toBe(
      "changed",
    );
    env.REVALIDATE_TOKEN = undefined;
    expect(await overview({ "X-Cache-Bypass": "fresh-secret" })).not.toBe(
      "changed",
    );
  });
});
