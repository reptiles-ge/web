import type { WorkersResponseStore } from "@cloudflare/workers-response-store";

import {
  runWithResponseStoreInvocation,
  WorkersResponseStoreCacheHandler,
} from "@vinext/cloudflare/cache/response-store-data.runtime";

type Tags = Parameters<WorkersResponseStoreCacheHandler["revalidateTag"]>[0];

export class NonReplayingResponseStoreCache extends WorkersResponseStoreCacheHandler {
  private pendingPurge: null | Promise<void> = null;

  private readonly pendingTags = new Set<string>();

  async purgeEverything() {
    const store = Reflect.get(this, "store") as WorkersResponseStore;
    const result = await store.purge({ purgeEverything: true });
    return result.edgePurgeAccepted;
  }

  override revalidateTag(tags: Tags) {
    for (const tag of Array.isArray(tags) ? tags : [tags]) {
      this.pendingTags.add(tag);
    }
    this.pendingPurge ??= Promise.resolve().then(() => {
      const batch = [...this.pendingTags];
      this.pendingTags.clear();
      this.pendingPurge = null;
      return super.revalidateTag(batch, { expire: 0 });
    });
    return this.pendingPurge;
  }

  override set(...args: Parameters<WorkersResponseStoreCacheHandler["set"]>) {
    return runWithResponseStoreInvocation("", false, () => super.set(...args));
  }
}

export default function createResponseStoreDataCache() {
  return new NonReplayingResponseStoreCache();
}

export async function purgeSiteCache() {
  return new NonReplayingResponseStoreCache().purgeEverything();
}
