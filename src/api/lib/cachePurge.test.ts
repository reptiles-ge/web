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
import {
  revalidateAuthorPages,
  revalidateNewsArticle,
  revalidatePageGroup,
  revalidateSpeciesSite,
} from "./revalidateSite";

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
    expect(await purgeApiCache(env, ["catalog"])).toBe("purged");
    expect(await purgeApiCache(env, ["news:n0", "news:n1"])).toBe("purged");
    expect(await readCacheGeneration(env.DB)).toBe(2);
  });

  it("does nothing for no tags", async () => {
    expect(await purgeApiCache(env, [])).toBe("purged");
    expect(await readCacheGeneration(env.DB)).toBe(0);
  });

  it("fails when D1 refuses the write", async () => {
    env.DB = brokenDatabase;
    expect(await purgeApiCache(env, ["catalog"])).toBe("failed");
    expect(log).toHaveBeenCalledWith(
      "API cache purge failed",
      expect.any(Error),
    );
  });
});

describe("cache clears", () => {
  it("purges the API cache for every clear that depends on API data", async () => {
    await revalidateNewsArticle(env, "kori-news");
    await revalidateAuthorPages(env, "sandro");
    await revalidatePageGroup(env, "regions");
    await revalidatePageGroup(env, "site");
    expect(await readCacheGeneration(env.DB)).toBe(4);
    await revalidatePageGroup(env, "about");
    expect(await readCacheGeneration(env.DB)).toBe(4);
    expect(await revalidateSpeciesSite(env, ["accipiter-gentilis"])).toBe(true);
    expect(await readCacheGeneration(env.DB)).toBe(5);
  });

  it("reports a failed purge even when the site was revalidated", async () => {
    const site = vi.fn(async () => new Response(null, { status: 204 }));
    env = { ...env, DB: brokenDatabase, SITE: { fetch: site } };
    expect(await revalidateSpeciesSite(env, ["accipiter-gentilis"])).toBe(
      false,
    );
    expect(await revalidatePageGroup(env, "news")).toBe(false);
    expect(site).toHaveBeenCalledTimes(2);
  });
});
