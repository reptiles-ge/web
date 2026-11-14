import {
  runWithResponseStoreInvocation,
  WorkersResponseStoreCacheHandler,
} from "@vinext/cloudflare/cache/response-store-data.runtime";
import { describe, expect, it, vi } from "vitest";

import createResponseStoreDataCache, {
  NonReplayingResponseStoreCache,
  purgeSiteCache,
} from "./responseStoreDataCache";

type Put = [Request, Response, Record<string, unknown>];

function memoryStore() {
  const puts: Put[] = [];
  return {
    puts,
    store: {
      fetch: vi.fn(),
      getTagExpiration: vi.fn(),
      purge: vi.fn<
        (options: { purgeEverything?: boolean; tags?: string[] }) => Promise<{
          backingStoreUpdated: boolean;
          edgePurgeAccepted: boolean;
        }>
      >(async () => ({ backingStoreUpdated: true, edgePurgeAccepted: true })),
      put: vi.fn(async (...args: Put) => {
        puts.push(args);
      }),
      refresh: vi.fn(),
    },
  };
}

const value = {
  data: { body: "e30=", headers: {}, status: 200, url: "https://api" },
  kind: "FETCH",
  revalidate: 3600,
  tags: ["species"],
} as const;

describe("NonReplayingResponseStoreCache", () => {
  it("stores a fetch without a page regenerator, even inside a replayable page", async () => {
    const { puts, store } = memoryStore();
    const cache = new NonReplayingResponseStoreCache(store as never);
    await runWithResponseStoreInvocation('{"page":"/"}', true, () =>
      cache.set("key", value as never, { revalidate: 3600, tags: ["species"] }),
    );
    expect(puts).toHaveLength(1);
    const [, response, options] = puts[0]!;
    expect(options.revalidator).toBeUndefined();
    expect(options.expiryBehavior).toBe("miss");
    expect(response.headers.get("Cache-Tag")).toBeTruthy();
    expect(response.headers.get("Cache-Control")).toContain("max-age=3600");
  });

  it("differs from the stock handler, which asks the store to re-render the page", async () => {
    const { puts, store } = memoryStore();
    const cache = new WorkersResponseStoreCacheHandler(store as never);
    await runWithResponseStoreInvocation('{"page":"/"}', true, () =>
      cache.set("key", value as never, { revalidate: 3600, tags: ["species"] }),
    );
    expect(puts[0]![2].revalidator).toEqual({
      args: ["key", '{"page":"/"}'],
      id: expect.any(String) as string,
    });
  });

  it("purges tagged entries instead of refreshing them, even for a positive expire", async () => {
    const { store } = memoryStore();
    const cache = new NonReplayingResponseStoreCache(store as never);
    const handler: WorkersResponseStoreCacheHandler = cache;
    await handler.revalidateTag("species", { expire: 3600 });
    expect(store.refresh).not.toHaveBeenCalled();
    expect(store.purge).toHaveBeenCalledWith({ tags: [expect.any(String)] });
  });

  it("sends the tags of one revalidation in a single purge", async () => {
    const { store } = memoryStore();
    const cache = new NonReplayingResponseStoreCache(store as never);
    await Promise.all(
      ["species", "species:giurza", "species:giurza", "news"].map((tag) =>
        cache.revalidateTag(tag),
      ),
    );
    expect(store.purge).toHaveBeenCalledTimes(1);
    expect(store.purge.mock.calls[0]![0].tags).toHaveLength(3);
  });

  it("purges every entry at once and reports whether the edge accepted it", async () => {
    const { store } = memoryStore();
    const cache = new NonReplayingResponseStoreCache(store as never);
    expect(await cache.purgeEverything()).toBe(true);
    expect(store.purge).toHaveBeenCalledExactlyOnceWith({
      purgeEverything: true,
    });
    store.purge.mockResolvedValueOnce({
      backingStoreUpdated: true,
      edgePurgeAccepted: false,
    });
    expect(await cache.purgeEverything()).toBe(false);
  });

  it("starts a new purge for tags revalidated after the last one was sent", async () => {
    const { store } = memoryStore();
    const cache = new NonReplayingResponseStoreCache(store as never);
    await cache.revalidateTag("species");
    await cache.revalidateTag("news");
    expect(store.purge).toHaveBeenCalledTimes(2);
  });

  it("is what the adapter factory and the site purge build", async () => {
    await expect(purgeSiteCache()).rejects.toThrow(
      "Workers Response Store adapter must run through its generated Cloudflare worker entry",
    );
    expect(() => createResponseStoreDataCache()).toThrow(
      "Workers Response Store adapter must run through its generated Cloudflare worker entry",
    );
  });
});
