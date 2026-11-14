import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";

import type { ApiBindings } from "../env";

import { readCacheGeneration } from "../db/cacheGeneration";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { purgeApiCache } from "./cachePurge";

let env: ApiBindings;
let log: MockInstance<typeof console.error>;

const brokenDatabase = {
  batch: async () => [],
  prepare: () => {
    throw new Error("D1 unavailable");
  },
} as ApiBindings["DB"];

beforeEach(() => {
  log = vi.spyOn(console, "error").mockImplementation(() => {});
  env = {
    DB: createSpeciesTestDatabase().db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: async () => new Response(null, { status: 204 }) },
  };
});

afterEach(() => {
  log.mockRestore();
});

describe("purgeApiCache", () => {
  it("moves every API cache entry to a new generation", async () => {
    expect(await readCacheGeneration(env.DB)).toBe(0);
    expect(await purgeApiCache(env)).toBe("purged");
    expect(await purgeApiCache(env)).toBe("purged");
    expect(await readCacheGeneration(env.DB)).toBe(2);
  });

  it("fails when D1 refuses the write", async () => {
    env.DB = brokenDatabase;
    expect(await purgeApiCache(env)).toBe("failed");
    expect(log).toHaveBeenCalledWith(
      "API cache purge failed",
      expect.any(Error),
    );
  });
});
