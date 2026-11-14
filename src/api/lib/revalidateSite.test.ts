import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { readCacheGeneration } from "../db/cacheGeneration";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import { clearCaches, ensureSiteRevalidated } from "./revalidateSite";

let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  siteFetch = vi.fn(async () => new Response(null, { status: 200 }));
  env = {
    DB: createSpeciesTestDatabase().db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("clearCaches", () => {
  it("empties the API cache, then asks the site to empty its whole cache", async () => {
    expect(await clearCaches(env)).toBe(true);
    expect(await readCacheGeneration(env.DB)).toBe(1);
    expect(siteFetch).toHaveBeenCalledTimes(1);
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.method).toBe("POST");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
  });

  it("fails when the API purge fails, and still clears the site", async () => {
    env = {
      ...env,
      DB: {
        batch: async () => [],
        prepare: () => {
          throw new Error("D1 unavailable");
        },
      },
    };
    expect(await clearCaches(env)).toBe(false);
    expect(siteFetch).toHaveBeenCalledTimes(1);
  });

  it("fails when the site refuses the clear, is down or is not configured", async () => {
    siteFetch.mockResolvedValue(new Response(null, { status: 503 }));
    expect(await clearCaches(env)).toBe(false);
    siteFetch.mockRejectedValue(new Error("down"));
    expect(await clearCaches(env)).toBe(false);
    expect(await clearCaches({ ...env, REVALIDATE_TOKEN: undefined })).toBe(
      false,
    );
  });
});

describe("ensureSiteRevalidated", () => {
  it("turns a failed clear into a 502", async () => {
    await expect(
      ensureSiteRevalidated(Promise.resolve(false)),
    ).rejects.toMatchObject({ code: "site_unavailable", status: 502 });
    await expect(
      ensureSiteRevalidated(Promise.resolve(true)),
    ).resolves.toBeUndefined();
  });
});
