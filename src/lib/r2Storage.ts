import type {
  PutOptions,
  StorageAdapter,
} from "@reptiles-ge/img-compression/storage";

import { AwsClient } from "aws4fetch";

import { CDN_BASE } from "./site";

const CDN_BUCKET_NAME = "reptiles-cdn";

export type R2StorageEnv = {
  R2_ACCESS_KEY_ID?: string;
  R2_ACCOUNT_ID?: string;
  R2_BUCKET?: string;
  R2_SECRET_ACCESS_KEY?: string;
};

export type R2StorageOptions = {
  accessKeyId: string;
  accountId: string;
  bucket?: string;
  cdnBaseUrl?: string;
  secretAccessKey: string;
};

type Directory = { directories: Set<string>; files: Set<string> };

const XML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
};

export class R2StorageAdapter implements StorageAdapter {
  readonly name = "r2";
  readonly #cdnBaseUrl: string;
  readonly #client: AwsClient;
  readonly #directories = new Map<string, Directory>();
  readonly #origin: string;

  constructor(options: R2StorageOptions) {
    if (!options.accountId.trim()) throw new Error("R2 account id is empty.");
    this.#client = new AwsClient({
      accessKeyId: options.accessKeyId,
      region: "auto",
      secretAccessKey: options.secretAccessKey,
      service: "s3",
    });
    this.#origin = `https://${options.accountId.trim()}.r2.cloudflarestorage.com/${encodeURIComponent(options.bucket ?? CDN_BUCKET_NAME)}`;
    this.#cdnBaseUrl = (options.cdnBaseUrl ?? CDN_BASE).replace(/\/+$/, "");
  }

  async delete(key: string) {
    const response = await this.#client.fetch(this.#url(key), {
      method: "DELETE",
    });
    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete "${key}": HTTP ${response.status}.`);
    }
    const { directory, name } = splitKey(key);
    this.#directories.get(directory)?.files.delete(name);
  }

  async exists(key: string) {
    const { directory, name } = splitKey(safeKey(key));
    return (await this.#listDirectory(directory)).files.has(name);
  }

  async get(key: string) {
    const response = await this.#client.fetch(this.#url(key));
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to download "${key}": HTTP ${response.status}.`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async list(prefix: string) {
    const normalized = prefix.replace(/^\/+|\/+$/g, "");
    const keys: string[] = [];
    let token: string | undefined;
    do {
      const page = await this.#listPage(
        normalized ? `${normalized}/` : "",
        undefined,
        token,
      );
      keys.push(...page.keys);
      token = page.next;
    } while (token);
    return keys.sort();
  }

  async put(key: string, data: Buffer, options: PutOptions) {
    const response = await this.#client.fetch(this.#url(key), {
      body: new Uint8Array(data),
      headers: { "Content-Type": options.contentType },
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error(`Failed to upload "${key}": HTTP ${response.status}.`);
    }
    const { directory, name } = splitKey(key);
    this.#directories.get(directory)?.files.add(name);
  }

  urlFor(key: string) {
    return `${this.#cdnBaseUrl}/${encodeKey(safeKey(key))}`;
  }

  async #listDirectory(directory: string) {
    const cached = this.#directories.get(directory);
    if (cached) return cached;
    const prefix = directory ? `${directory}/` : "";
    const entry: Directory = { directories: new Set(), files: new Set() };
    let token: string | undefined;
    do {
      const page = await this.#listPage(prefix, "/", token);
      for (const key of page.keys) entry.files.add(key.slice(prefix.length));
      for (const child of page.prefixes) {
        entry.directories.add(child.slice(prefix.length).replace(/\/$/, ""));
      }
      token = page.next;
    } while (token);
    this.#directories.set(directory, entry);
    return entry;
  }

  async #listPage(prefix: string, delimiter?: string, token?: string) {
    const url = new URL(this.#origin);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("prefix", prefix);
    if (delimiter) url.searchParams.set("delimiter", delimiter);
    if (token) url.searchParams.set("continuation-token", token);
    const response = await this.#client.fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `Failed to list "${prefix || "/"}": HTTP ${response.status}.`,
      );
    }
    const xml = await response.text();
    const truncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
    return {
      keys: tagValues(xml, "Contents", "Key"),
      next: truncated ? tagValues(xml, "", "NextContinuationToken")[0] : "",
      prefixes: tagValues(xml, "CommonPrefixes", "Prefix"),
    };
  }

  #url(key: string) {
    return `${this.#origin}/${encodeKey(safeKey(key))}`;
  }
}

export function r2StorageFromEnv(env: R2StorageEnv) {
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be in .env.local",
    );
  }
  return new R2StorageAdapter({
    accessKeyId,
    accountId,
    secretAccessKey,
    ...(env.R2_BUCKET ? { bucket: env.R2_BUCKET } : {}),
  });
}

function decodeXml(value: string) {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (entity, code: string) => {
      if (code.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      }
      if (code.startsWith("#")) {
        return String.fromCodePoint(Number(code.slice(1)));
      }
      return XML_ENTITIES[code] ?? entity;
    },
  );
}

function encodeKey(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function safeKey(key: string) {
  if (
    !key ||
    key.startsWith("/") ||
    key.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    throw new Error(`Unsafe storage key "${key}".`);
  }
  return key;
}

function splitKey(key: string) {
  const slash = key.lastIndexOf("/");
  return slash === -1
    ? { directory: "", name: key }
    : { directory: key.slice(0, slash), name: key.slice(slash + 1) };
}

function tagValues(xml: string, parent: string, tag: string) {
  const scopes = parent
    ? [
        ...xml.matchAll(new RegExp(`<${parent}>([\\s\\S]*?)</${parent}>`, "g")),
      ].map((match) => match[1] ?? "")
    : [xml];
  return scopes.flatMap((scope) =>
    [...scope.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g"))].map(
      (match) => decodeXml(match[1] ?? ""),
    ),
  );
}
