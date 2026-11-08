import { CDN_BASE } from "@/lib/site";

import type { ApiBindings } from "../env";

import { ApiError } from "./errors";

const REGION_HOSTS: Record<string, string> = {
  "": "storage.bunnycdn.com",
  br: "br.storage.bunnycdn.com",
  de: "storage.bunnycdn.com",
  jh: "jh.storage.bunnycdn.com",
  la: "la.storage.bunnycdn.com",
  ny: "ny.storage.bunnycdn.com",
  se: "se.storage.bunnycdn.com",
  sg: "sg.storage.bunnycdn.com",
  syd: "syd.storage.bunnycdn.com",
  uk: "uk.storage.bunnycdn.com",
};

const MAX_ATTEMPTS = 3;

const MAX_LOGGED_BODY = 300;

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

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

export function bunnyStorage(env: ApiBindings): PhotoStorage {
  const zone = env.BUNNY_STORAGE_ZONE?.trim();
  const accessKey = env.BUNNY_STORAGE_ACCESS_KEY;
  const host =
    REGION_HOSTS[(env.BUNNY_STORAGE_REGION ?? "").trim().toLowerCase()];
  if (!zone || !accessKey || !host) {
    throw new ApiError(
      503,
      "storage_unavailable",
      "Photo storage is not configured",
    );
  }
  const cdnBase = (env.BUNNY_CDN_BASE_URL ?? CDN_BASE).replace(/\/+$/, "");
  const storageUrl = (key: string) =>
    `https://${host}/${encodeURIComponent(zone)}/${encodeKey(key)}`;

  async function request(
    operation: StorageOperation,
    key: string,
    url: string,
    init: RequestInit,
  ) {
    let failure: unknown;
    for (let attempt = 1; ; attempt += 1) {
      const response = await fetch(url, {
        ...init,
        headers: { ...init.headers, AccessKey: accessKey! },
      }).catch((error: unknown) => {
        failure = error;
        return null;
      });
      if (
        response &&
        (!RETRYABLE_STATUS.has(response.status) || attempt === MAX_ATTEMPTS)
      ) {
        return response;
      }
      await response?.body?.cancel();
      if (attempt === MAX_ATTEMPTS) {
        throw await storageFailed({ error: failure, key, operation });
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }

  return {
    async files(directory) {
      const url = directory ? `${storageUrl(directory)}/` : storageUrl("");
      const response = await request("list", directory, url, {
        method: "GET",
      });
      if (response.status === 404) return new Set();
      if (!response.ok) {
        throw await storageFailed({
          key: directory,
          operation: "list",
          response,
        });
      }
      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload)) {
        throw await storageFailed({
          error: "listing is not an array",
          key: directory,
          operation: "list",
        });
      }
      return new Set(
        payload.flatMap(
          (item: { IsDirectory?: boolean; ObjectName?: unknown }) =>
            typeof item.ObjectName === "string" && item.IsDirectory !== true
              ? [item.ObjectName]
              : [],
        ),
      );
    },
    async put(key, bytes, contentType) {
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const response = await request("put", key, storageUrl(key), {
        body: bytes,
        headers: {
          Checksum: [...new Uint8Array(digest)]
            .map((value) => value.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase(),
          "Content-Type": contentType,
        },
        method: "PUT",
      });
      if (!response.ok) {
        throw await storageFailed({ key, operation: "put", response });
      }
    },
    urlFor: (key) => `${cdnBase}/${encodeKey(key)}`,
  };
}

function encodeKey(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function storageFailed({
  error,
  key,
  operation,
  response,
}: {
  error?: unknown;
  key: string;
  operation: StorageOperation;
  response?: Response;
}) {
  const body = response
    ? (await response.text().catch(() => "")).slice(0, MAX_LOGGED_BODY)
    : undefined;
  console.error("Photo storage request failed", {
    body,
    error: error instanceof Error ? error.message : error,
    key: key || "/",
    operation,
    status: response?.status ?? null,
  });
  return new ApiError(502, "storage_failed", "Photo storage request failed");
}
