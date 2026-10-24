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

  async function request(url: string, init: RequestInit) {
    for (let attempt = 1; ; attempt += 1) {
      const response = await fetch(url, {
        ...init,
        headers: { ...init.headers, AccessKey: accessKey! },
      }).catch(() => null);
      if (
        response &&
        (!RETRYABLE_STATUS.has(response.status) || attempt === MAX_ATTEMPTS)
      ) {
        return response;
      }
      await response?.body?.cancel();
      if (attempt === MAX_ATTEMPTS) throw storageFailed();
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }

  return {
    async files(directory) {
      const url = directory ? `${storageUrl(directory)}/` : storageUrl("");
      const response = await request(url, { method: "GET" });
      if (response.status === 404) return new Set();
      if (!response.ok) throw storageFailed();
      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload)) throw storageFailed();
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
      const response = await request(storageUrl(key), {
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
      if (!response.ok) throw storageFailed();
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

function storageFailed() {
  return new ApiError(502, "storage_failed", "Photo storage request failed");
}
