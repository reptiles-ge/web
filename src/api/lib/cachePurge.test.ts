import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { purgeApiCache } from "./cachePurge";
import {
  revalidateAuthorPages,
  revalidateNewsArticle,
  revalidatePageGroup,
  revalidateSpeciesSite,
} from "./revalidateSite";

let env: ApiBindings;
let purge: ReturnType<
  typeof vi.fn<(url: string, init: RequestInit) => Promise<Response>>
>;
let log: ReturnType<typeof vi.spyOn>;

function purgedTags() {
  return purge.mock.calls.map(
    ([, init]) => (JSON.parse(init.body as string) as { tags: string[] }).tags,
  );
}

beforeEach(() => {
  purge = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(
    async () => Response.json({ success: true }),
  );
  vi.stubGlobal("fetch", purge);
  log = vi.spyOn(console, "error").mockImplementation(() => {});
  env = {
    CACHE_PURGE_TOKEN: "purge-token",
    CACHE_PURGE_ZONE_ID: "zone-1",
    DB: {} as ApiBindings["DB"],
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: async () => new Response(null, { status: 204 }) },
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  log.mockRestore();
});

describe("purgeApiCache", () => {
  it("purges unique prefixed tags, at most 100 per request", async () => {
    const tags = Array.from({ length: 150 }, (_, index) => `news:n${index}`);
    expect(await purgeApiCache(env, [...tags, "news:n0"])).toBe("purged");
    expect(purgedTags().map((batch) => batch.length)).toEqual([100, 50]);
    expect(purgedTags()[0]![0]).toBe("api:news:n0");
  });

  it("does nothing for no tags and reports a missing setup", async () => {
    expect(await purgeApiCache(env, [])).toBe("purged");
    env.CACHE_PURGE_TOKEN = undefined;
    expect(await purgeApiCache(env, ["catalog"])).toBe("not_configured");
    expect(purge).not.toHaveBeenCalled();
  });

  it("fails on a refused answer, an unsuccessful body or a network error", async () => {
    purge.mockResolvedValueOnce(new Response(null, { status: 403 }));
    expect(await purgeApiCache(env, ["catalog"])).toBe("failed");
    purge.mockResolvedValueOnce(Response.json({ success: false }));
    expect(await purgeApiCache(env, ["catalog"])).toBe("failed");
    purge.mockRejectedValueOnce(new TypeError("offline"));
    expect(await purgeApiCache(env, ["catalog"])).toBe("failed");
  });
});

describe("cache clears", () => {
  it("purges the API data each kind of clear depends on", async () => {
    await revalidateNewsArticle(env, "kori-news");
    await revalidateAuthorPages(env, "sandro");
    await revalidatePageGroup(env, "regions");
    await revalidatePageGroup(env, "site");
    await revalidatePageGroup(env, "about");
    expect(await revalidateSpeciesSite(env, ["accipiter-gentilis"])).toBe(true);
    expect(purgedTags()).toEqual([
      ["api:news:kori-news"],
      [
        "api:authors",
        "api:author:sandro",
        "api:species",
        "api:news",
        "api:catalog",
      ],
      ["api:catalog"],
      ["api:species", "api:catalog", "api:images", "api:news", "api:authors"],
      ["api:species", "api:catalog", "api:images"],
    ]);
  });

  it("reports a failed purge even when the site was revalidated", async () => {
    purge.mockResolvedValue(new Response(null, { status: 500 }));
    expect(await revalidateSpeciesSite(env, ["accipiter-gentilis"])).toBe(
      false,
    );
    expect(await revalidatePageGroup(env, "news")).toBe(false);
  });
});
