import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { purgeApiCache } from "./cachePurge";

const URL = "/v1/species/cheiracanthium-punctorium";

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
let forgetCacheGeneration: (typeof import("./cache"))["forgetCacheGeneration"];
let purgeFromApp: (typeof import("./cachePurge"))["purgeApiCache"];
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
  ({ forgetCacheGeneration } = await import("./cache"));
  ({ purgeApiCache: purgeFromApp } = await import("./cachePurge"));
});

beforeEach(() => {
  vi.useRealTimers();
  forgetCacheGeneration();
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
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
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

  it("reads D1 and refreshes the entry only with the bypass secret", async () => {
    await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
      )
      .run();
    expect(await overview({ "X-Cache-Bypass": "fresh-secret" })).toBe(
      "changed",
    );
    expect(await overview()).toBe("changed");
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'later' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
      )
      .run();
    env.REVALIDATE_TOKEN = undefined;
    expect(await overview({ "X-Cache-Bypass": "fresh-secret" })).toBe(
      "changed",
    );
  });

  it("misses every stored entry after a purge, in every data center", async () => {
    await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
      )
      .run();
    expect(await purgeApiCache(env)).toBe("purged");
    expect(await overview()).toBe("changed");
  });

  it("remembers the generation in memory for CACHE_GENERATION_TTL_MS", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    env.CACHE_GENERATION_TTL_MS = "5000";
    const first = await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
      )
      .run();
    sqlite
      .prepare(
        "INSERT INTO api_cache_generation (id, generation) VALUES (1, 1) ON CONFLICT (id) DO UPDATE SET generation = generation + 1",
      )
      .run();
    const prepare = vi.spyOn(env.DB, "prepare");
    expect(await overview()).toBe(first);
    expect(prepare).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5001);
    expect(await overview()).toBe("changed");
  });

  it("reads the new generation at once after a purge in the same isolate", async () => {
    env.CACHE_GENERATION_TTL_MS = "5000";
    await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
      )
      .run();
    expect(await purgeFromApp(env)).toBe("purged");
    expect(await overview()).toBe("changed");
  });

  it("reads D1 on every request without a generation TTL", async () => {
    await overview();
    const prepare = vi.spyOn(env.DB, "prepare");
    await overview();
    expect(prepare).toHaveBeenCalledWith(
      "SELECT generation FROM api_cache_generation WHERE id = 1",
    );
  });

  it("keeps caching when the generation cannot be read", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sqlite.exec("DROP TABLE api_cache_generation");
    const first = await overview();
    sqlite
      .prepare(
        "UPDATE species_texts SET overview = 'changed' WHERE species_id = 'cheiracanthium-punctorium' AND locale = 'en'",
      )
      .run();
    expect(await overview()).toBe(first);
    expect(log).toHaveBeenCalledWith(
      "API cache generation could not be read",
      expect.any(Error),
    );
    log.mockRestore();
  });

  it("tags every stored entry so a clear can purge it in every data center", async () => {
    async function storedTags(url: string) {
      const pending: Array<Promise<unknown>> = [];
      const response = await app.request(
        url,
        { headers: { "X-Locale": "en" } },
        env,
        {
          passThroughOnException: () => {},
          props: {},
          waitUntil: (promise: Promise<unknown>) => {
            pending.push(promise);
          },
        },
      );
      await Promise.all(pending);
      expect(response.status).toBe(200);
      const entries = [...stores.values()].flatMap((store) => [
        ...(store as unknown as { entries: Map<string, Response> }).entries,
      ]);
      const entry = entries.find(([key]) => key.includes(url.split("?")[0]!));
      return entry?.[1].headers.get("Cache-Tag");
    }

    expect(await storedTags(URL)).toBe(
      "api:species,api:species:cheiracanthium-punctorium",
    );
    stores.clear();
    expect(await storedTags(`${URL}/field-records`)).toBe(
      "api:species,api:species:cheiracanthium-punctorium",
    );
    stores.clear();
    expect(await storedTags("/v1/species")).toBe("api:species,api:catalog");
    stores.clear();
    expect(await storedTags("/v1/catalog")).toBe("api:catalog");
    stores.clear();
    expect(await storedTags("/v1/contributors")).toBe("api:authors");
  });
});
