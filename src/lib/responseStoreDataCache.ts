import {
  runWithResponseStoreInvocation,
  WorkersResponseStoreCacheHandler,
} from "@vinext/cloudflare/cache/response-store-data.runtime";

export class NonReplayingResponseStoreCache extends WorkersResponseStoreCacheHandler {
  override revalidateTag(
    tags: Parameters<WorkersResponseStoreCacheHandler["revalidateTag"]>[0],
  ) {
    return super.revalidateTag(tags, { expire: 0 });
  }

  override set(...args: Parameters<WorkersResponseStoreCacheHandler["set"]>) {
    return runWithResponseStoreInvocation("", false, () => super.set(...args));
  }
}

export default function createResponseStoreDataCache() {
  return new NonReplayingResponseStoreCache();
}
