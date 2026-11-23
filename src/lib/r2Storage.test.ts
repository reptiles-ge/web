import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { R2StorageAdapter, r2StorageFromEnv } from "./r2Storage";

const ACCOUNT = "0123456789abcdef0123456789abcdef";
const ORIGIN = `https://${ACCOUNT}.r2.cloudflarestorage.com/reptiles-cdn`;
const PAGE_SIZE = 2;

type Request = { method: string; url: URL };

let objects: Map<string, { body: Uint8Array; contentType: string }>;
let requests: Request[];
let failWith: null | number;

function adapter() {
  return new R2StorageAdapter({
    accessKeyId: "id",
    accountId: ACCOUNT,
    secretAccessKey: "secret",
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function keyOf(url: URL) {
  return decodeURIComponent(url.pathname.replace(/^\/reptiles-cdn\/?/, ""));
}

function listing(url: URL) {
  const prefix = url.searchParams.get("prefix") ?? "";
  const delimiter = url.searchParams.get("delimiter");
  const start = Number(url.searchParams.get("continuation-token") ?? 0);
  const keys: string[] = [];
  const prefixes = new Set<string>();
  for (const key of [...objects.keys()].sort()) {
    if (!key.startsWith(prefix)) continue;
    const rest = key.slice(prefix.length);
    if (delimiter && rest.includes(delimiter)) {
      prefixes.add(`${prefix}${rest.slice(0, rest.indexOf(delimiter) + 1)}`);
    } else {
      keys.push(key);
    }
  }
  const page = keys.slice(start, start + PAGE_SIZE);
  const truncated = start + PAGE_SIZE < keys.length;
  return `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult>${page
    .map((key) => `<Contents><Key>${escapeXml(key)}</Key></Contents>`)
    .join("")}${[...prefixes]
    .map((item) => `<CommonPrefixes><Prefix>${item}</Prefix></CommonPrefixes>`)
    .join("")}<IsTruncated>${truncated}</IsTruncated>${
    truncated
      ? `<NextContinuationToken>${start + PAGE_SIZE}</NextContinuationToken>`
      : ""
  }</ListBucketResult>`;
}

beforeEach(() => {
  objects = new Map([
    ["a.jpg", { body: new Uint8Array([1]), contentType: "image/jpeg" }],
    ["b & c.jpg", { body: new Uint8Array([2]), contentType: "image/jpeg" }],
    ["c.jpg", { body: new Uint8Array([3]), contentType: "image/jpeg" }],
    [
      "optimized/a-320.avif",
      { body: new Uint8Array([4]), contentType: "image/avif" },
    ],
  ]);
  requests = [];
  failWith = null;
  server.use(
    http.all(`${ORIGIN}*`, async ({ request }) => {
      const url = new URL(request.url);
      requests.push({ method: request.method, url });
      expect(request.headers.get("authorization")).toMatch(
        /^AWS4-HMAC-SHA256 Credential=id\//,
      );
      if (failWith) return new HttpResponse(null, { status: failWith });
      const key = keyOf(url);
      if (request.method === "GET" && url.searchParams.has("list-type")) {
        return new HttpResponse(listing(url), {
          headers: { "Content-Type": "application/xml" },
        });
      }
      if (request.method === "PUT") {
        objects.set(key, {
          body: new Uint8Array(await request.arrayBuffer()),
          contentType: request.headers.get("content-type") ?? "",
        });
        return new HttpResponse(null, { status: 200 });
      }
      if (request.method === "DELETE") {
        objects.delete(key);
        return new HttpResponse(null, { status: 204 });
      }
      const object = objects.get(key);
      return object
        ? new HttpResponse(object.body, {
            headers: { "Content-Type": object.contentType },
          })
        : new HttpResponse(null, { status: 404 });
    }),
  );
});

describe("R2StorageAdapter", () => {
  it("lists every page recursively and decodes XML in keys", async () => {
    expect(await adapter().list("")).toStrictEqual([
      "a.jpg",
      "b & c.jpg",
      "c.jpg",
      "optimized/a-320.avif",
    ]);
    expect(await adapter().list("/optimized/")).toStrictEqual([
      "optimized/a-320.avif",
    ]);
  });

  it("answers exists from one cached listing per directory", async () => {
    const storage = adapter();
    expect(await storage.exists("c.jpg")).toBe(true);
    expect(await storage.exists("b & c.jpg")).toBe(true);
    expect(await storage.exists("optimized")).toBe(false);
    expect(await storage.exists("optimized/a-320.avif")).toBe(true);
    expect(await storage.exists("optimized/a-640.avif")).toBe(false);
    expect(requests.map(({ url }) => url.searchParams.get("prefix"))).toEqual([
      "",
      "",
      "optimized/",
    ]);
  });

  it("puts with the content type and keeps the listing cache true", async () => {
    const storage = adapter();
    expect(await storage.exists("optimized/new-320.webp")).toBe(false);
    await storage.put("optimized/new-320.webp", Buffer.from([9]), {
      contentType: "image/webp",
    });
    expect(objects.get("optimized/new-320.webp")).toStrictEqual({
      body: new Uint8Array([9]),
      contentType: "image/webp",
    });
    expect(await storage.exists("optimized/new-320.webp")).toBe(true);
    await storage.delete("optimized/new-320.webp");
    expect(objects.has("optimized/new-320.webp")).toBe(false);
    expect(await storage.exists("optimized/new-320.webp")).toBe(false);
    expect(
      requests.filter(({ url }) => url.searchParams.has("list-type")),
    ).toHaveLength(1);
  });

  it("gets an object and null for a missing one", async () => {
    expect(await adapter().get("a.jpg")).toStrictEqual(Buffer.from([1]));
    expect(await adapter().get("missing.jpg")).toBeNull();
  });

  it("builds CDN URLs with encoded segments", () => {
    expect(adapter().urlFor("optimized/ა b.jpg")).toBe(
      "https://cdn.reptiles.ge/optimized/%E1%83%90%20b.jpg",
    );
  });

  it("refuses unsafe keys", () => {
    for (const key of ["", "/a.jpg", "a/../b.jpg", "a//b.jpg"]) {
      expect(() => adapter().urlFor(key)).toThrow(/Unsafe storage key/);
    }
  });

  it("reports failed requests with the key and status", async () => {
    failWith = 403;
    const storage = adapter();
    await expect(
      storage.put("a.jpg", Buffer.from([1]), { contentType: "image/jpeg" }),
    ).rejects.toThrow('Failed to upload "a.jpg": HTTP 403.');
    await expect(storage.get("a.jpg")).rejects.toThrow(
      'Failed to download "a.jpg": HTTP 403.',
    );
    await expect(storage.delete("a.jpg")).rejects.toThrow(
      'Failed to delete "a.jpg": HTTP 403.',
    );
    await expect(storage.list("optimized")).rejects.toThrow(
      'Failed to list "optimized/": HTTP 403.',
    );
    await expect(storage.exists("a.jpg")).rejects.toThrow(
      'Failed to list "/": HTTP 403.',
    );
  });

  it("treats deleting a missing object as done", async () => {
    await expect(adapter().delete("missing.jpg")).resolves.toBeUndefined();
  });
});

describe("r2StorageFromEnv", () => {
  it("needs the account id and both keys", () => {
    expect(() => r2StorageFromEnv({ R2_ACCOUNT_ID: ACCOUNT })).toThrow(
      /R2_ACCESS_KEY_ID/,
    );
  });

  it("uses the bucket from the environment", async () => {
    const storage = r2StorageFromEnv({
      R2_ACCESS_KEY_ID: "id",
      R2_ACCOUNT_ID: ACCOUNT,
      R2_BUCKET: "other-bucket",
      R2_SECRET_ACCESS_KEY: "secret",
    });
    server.use(
      http.get(
        `https://${ACCOUNT}.r2.cloudflarestorage.com/other-bucket/x.jpg`,
        () => new HttpResponse(new Uint8Array([7])),
      ),
    );
    expect(await storage.get("x.jpg")).toStrictEqual(Buffer.from([7]));
    expect(storage.name).toBe("r2");
  });

  it("refuses an empty account id", () => {
    expect(
      () =>
        new R2StorageAdapter({
          accessKeyId: "id",
          accountId: " ",
          secretAccessKey: "secret",
        }),
    ).toThrow(/account id/);
  });
});
