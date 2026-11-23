import { CDN_BASE } from "@/lib/site";

import type { ApiBindings } from "../env";

import { ApiError } from "./errors";

const LIST_LIMIT = 1000;

export type PhotoStorage = {
  files: (directory: string) => Promise<Set<string>>;
  put: (
    key: string,
    bytes: Uint8Array<ArrayBuffer>,
    contentType: string,
  ) => Promise<void>;
  urlFor: (key: string) => string;
};

type StorageOperation = "list" | "put";

export function cdnStorage(env: ApiBindings): PhotoStorage {
  const bucket = env.CDN_BUCKET;
  if (!bucket) {
    throw new ApiError(
      503,
      "storage_unavailable",
      "Photo storage is not configured",
    );
  }

  return {
    async files(directory) {
      const prefix = directory ? `${directory.replace(/\/+$/, "")}/` : "";
      const keys = new Set<string>();
      let cursor: string | undefined;
      try {
        do {
          const page = await bucket.list({
            delimiter: "/",
            limit: LIST_LIMIT,
            prefix,
            ...(cursor ? { cursor } : {}),
          });
          for (const object of page.objects) {
            keys.add(object.key.slice(prefix.length));
          }
          cursor = page.truncated ? page.cursor : undefined;
        } while (cursor);
      } catch (error) {
        throw storageFailed({ error, key: directory, operation: "list" });
      }
      return keys;
    },
    async put(key, bytes, contentType) {
      try {
        await bucket.put(key, bytes, { httpMetadata: { contentType } });
      } catch (error) {
        throw storageFailed({ error, key, operation: "put" });
      }
    },
    urlFor: (key) => `${CDN_BASE}/${encodeKey(key)}`,
  };
}

function encodeKey(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function storageFailed({
  error,
  key,
  operation,
}: {
  error: unknown;
  key: string;
  operation: StorageOperation;
}) {
  console.error("Photo storage request failed", {
    error: error instanceof Error ? error.message : error,
    key: key || "/",
    operation,
  });
  return new ApiError(502, "storage_failed", "Photo storage request failed");
}
