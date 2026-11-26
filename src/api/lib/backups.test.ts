import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type {
  ApiBindings,
  BackupBucket,
  BackupObject,
  BackupObjectBody,
} from "../env";

import { server } from "../../../tests/msw/server";
import {
  backupConfig,
  type BackupConfig,
  type BackupStep,
  checkD1Export,
  d1BackupKey,
  formatBackupFailure,
  formatBackupSuccess,
  formatBytes,
  runBackup,
  startD1Export,
  storeD1Dump,
  syncCdnPage,
} from "./backups";

const ACCOUNT = "account-1";
const DATABASE = "database-1";
const EXPORT_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/d1/database/${DATABASE}/export`;
const DUMP_URL = "https://d1-export.example.com/dump.sql";
const TELEGRAM_URL = "https://api.telegram.org/botbot-token/sendMessage";
const AT = new Date("2026-11-29T00:00:00.000Z");

type FakeBucket = BackupBucket & {
  aborted: string[];
  failGet: (key: string) => void;
  failPart: (error: Error) => void;
  objects: Map<string, Stored>;
  partSizes: number[];
  puts: string[];
};

type Stored = {
  body: Uint8Array;
  customMetadata?: Record<string, string>;
  etag: string;
  httpMetadata?: Record<string, unknown>;
};

function bindings(overrides: Partial<ApiBindings> = {}): ApiBindings {
  return {
    BACKUP_ACCOUNT_ID: ACCOUNT,
    BACKUP_BUCKET: fakeBucket(),
    BACKUP_DATABASE_ID: DATABASE,
    CDN_BUCKET: fakeBucket() as unknown as ApiBindings["CDN_BUCKET"],
    CDN_REPLICA_BUCKET: fakeBucket(),
    D1_EXPORT_TOKEN: "export-token",
    DB: {} as ApiBindings["DB"],
    TELEGRAM_BOT_TOKEN: "bot-token",
    TELEGRAM_CHAT_ID: "chat-1",
    ...overrides,
  };
}

function config(overrides: Partial<BackupConfig> = {}): BackupConfig {
  return {
    accountId: ACCOUNT,
    backups: fakeBucket(),
    databaseId: DATABASE,
    replica: fakeBucket(),
    source: fakeBucket(),
    token: "export-token",
    ...overrides,
  };
}

function exportApi(polls: Array<Record<string, unknown>>) {
  const bodies: unknown[] = [];
  server.use(
    http.post(EXPORT_URL, async ({ request }) => {
      const body = (await request.json()) as Record<string, string>;
      bodies.push(body);
      if (!body.current_bookmark) {
        return HttpResponse.json({
          result: { at_bookmark: "bookmark-1", status: "active" },
          success: true,
        });
      }
      return HttpResponse.json({
        result: polls.shift() ?? { status: "active" },
        success: true,
      });
    }),
    http.get(DUMP_URL, () => new HttpResponse("CREATE TABLE species;")),
  );
  return bodies;
}

function fakeBucket(
  initial: Record<string, string> = {},
  pageSize = 1000,
): FakeBucket {
  const objects = new Map<string, Stored>();
  for (const [key, text] of Object.entries(initial)) {
    objects.set(key, {
      body: new TextEncoder().encode(text),
      etag: `etag-${text}`,
      httpMetadata: { contentType: "image/jpeg" },
    });
  }
  const puts: string[] = [];
  const aborted: string[] = [];
  const partSizes: number[] = [];
  const failing = new Set<string>();
  let partError: Error | null = null;
  const describe = (key: string, stored: Stored): BackupObject => ({
    etag: stored.etag,
    key,
    size: stored.body.byteLength,
  });

  return {
    aborted,
    createMultipartUpload(key, options) {
      const parts = new Map<number, Uint8Array>();
      return Promise.resolve({
        abort: () => {
          aborted.push(key);
          return Promise.resolve();
        },
        complete: (uploaded) => {
          const chunks = uploaded.map((part) => parts.get(part.partNumber)!);
          const body = new Uint8Array(
            chunks.reduce((total, chunk) => total + chunk.byteLength, 0),
          );
          let offset = 0;
          for (const chunk of chunks) {
            body.set(chunk, offset);
            offset += chunk.byteLength;
          }
          objects.set(key, {
            body,
            customMetadata: options.customMetadata,
            etag: `etag-${key}`,
            httpMetadata: options.httpMetadata,
          });
          puts.push(key);
          return Promise.resolve({ size: body.byteLength });
        },
        uploadPart: (partNumber, value) => {
          if (partError) return Promise.reject(partError);
          parts.set(partNumber, value.slice());
          partSizes.push(value.byteLength);
          return Promise.resolve({ etag: `part-${partNumber}`, partNumber });
        },
      });
    },
    failGet: (key) => {
      failing.add(key);
    },
    failPart: (error) => {
      partError = error;
    },
    get(key) {
      const stored = objects.get(key);
      if (!stored || failing.has(key)) return Promise.resolve(null);
      const body: BackupObjectBody = {
        body: new Response(stored.body.slice()).body!,
        customMetadata: stored.customMetadata,
        httpMetadata: stored.httpMetadata,
        size: stored.body.byteLength,
      };
      return Promise.resolve(body);
    },
    list({ cursor, limit = 1000, startAfter }) {
      const [after, offset] = cursor
        ? [cursor.split("|")[0] || undefined, Number(cursor.split("|")[1])]
        : [startAfter, 0];
      const keys = [...objects.keys()]
        .sort()
        .filter((key) => !after || key > after);
      const size = Math.min(limit, pageSize);
      const page = keys
        .slice(offset, offset + size)
        .map((key) => describe(key, objects.get(key)!));
      const next = offset + size;
      return Promise.resolve(
        next < keys.length
          ? {
              cursor: `${after ?? ""}|${next}`,
              objects: page,
              truncated: true as const,
            }
          : { objects: page, truncated: false as const },
      );
    },
    objects,
    partSizes,
    async put(key, value, options) {
      const bytes =
        value instanceof ArrayBuffer
          ? new Uint8Array(value)
          : new Uint8Array(await new Response(value).arrayBuffer());
      objects.set(key, {
        body: bytes,
        customMetadata: options.customMetadata,
        etag: `etag-${new TextDecoder().decode(bytes)}`,
        httpMetadata: options.httpMetadata,
      });
      puts.push(key);
      return { size: bytes.byteLength };
    },
    puts,
  };
}

async function gunzip(bytes: Uint8Array) {
  const stream = new Response(new Uint8Array(bytes)).body!.pipeThrough(
    new DecompressionStream("gzip"),
  );
  return new Response(stream).text();
}

function recordingStep() {
  const names: string[] = [];
  const step: BackupStep = {
    do: (name, _config, run) => {
      names.push(name);
      return run();
    },
  };
  return { names, step };
}

function telegramMessages() {
  const messages: string[] = [];
  server.use(
    http.post(TELEGRAM_URL, async ({ request }) => {
      const body = (await request.json()) as { text: string };
      messages.push(body.text);
      return HttpResponse.json({ ok: true });
    }),
  );
  return messages;
}

describe("backupConfig", () => {
  it("names every missing binding", () => {
    expect(() =>
      backupConfig(
        bindings({ BACKUP_BUCKET: undefined, D1_EXPORT_TOKEN: undefined }),
      ),
    ).toThrow("Backup is not configured: BACKUP_BUCKET, D1_EXPORT_TOKEN");
  });

  it("reads the account, database, token and buckets", () => {
    const env = bindings();
    const result = backupConfig(env);
    expect(result.accountId).toBe(ACCOUNT);
    expect(result.databaseId).toBe(DATABASE);
    expect(result.token).toBe("export-token");
    expect(result.replica).toBe(env.CDN_REPLICA_BUCKET);
  });
});

describe("d1BackupKey", () => {
  it("files the dump under d1/ with a sortable UTC stamp", () => {
    expect(
      d1BackupKey("reptiles-db", new Date("2026-11-29T00:00:05.123Z")),
    ).toBe("d1/reptiles-db/2026-11-29T00-00-05Z.sql.gz");
  });
});

describe("D1 export", () => {
  it("starts an export with the token and returns its bookmark", async () => {
    let auth: null | string = null;
    server.use(
      http.post(EXPORT_URL, ({ request }) => {
        auth = request.headers.get("Authorization");
        return HttpResponse.json({
          result: { at_bookmark: "bookmark-1" },
          success: true,
        });
      }),
    );
    await expect(startD1Export(config())).resolves.toBe("bookmark-1");
    expect(auth).toBe("Bearer export-token");
  });

  it("fails when the export returns no bookmark", async () => {
    server.use(
      http.post(EXPORT_URL, () =>
        HttpResponse.json({ result: {}, success: true }),
      ),
    );
    await expect(startD1Export(config())).rejects.toThrow(
      "D1 export did not return a bookmark",
    );
  });

  it("reports the API errors of a refused request", async () => {
    server.use(
      http.post(EXPORT_URL, () =>
        HttpResponse.json(
          { errors: [{ message: "Authentication error" }], success: false },
          { status: 403 },
        ),
      ),
    );
    await expect(startD1Export(config())).rejects.toThrow(
      "D1 export request failed (403): Authentication error",
    );
  });

  it("fails on a response that is not JSON", async () => {
    server.use(
      http.post(
        EXPORT_URL,
        () => new HttpResponse("bad gateway", { status: 502 }),
      ),
    );
    await expect(startD1Export(config())).rejects.toThrow(
      "D1 export request failed (502)",
    );
  });

  it("returns null while the export runs and the URL when it is ready", async () => {
    exportApi([
      { status: "active" },
      { result: { signed_url: DUMP_URL }, status: "complete" },
    ]);
    await expect(checkD1Export(config(), "bookmark-1")).resolves.toBeNull();
    await expect(checkD1Export(config(), "bookmark-1")).resolves.toBe(DUMP_URL);
  });

  it("fails when the export reports an error", async () => {
    exportApi([{ error: "database busy", status: "error" }]);
    await expect(checkD1Export(config(), "bookmark-1")).rejects.toThrow(
      "D1 export failed: database busy",
    );
  });

  it("names an unknown export error", async () => {
    exportApi([{ status: "error" }]);
    await expect(checkD1Export(config(), "bookmark-1")).rejects.toThrow(
      "D1 export failed: unknown error",
    );
  });

  it("fails when a finished export has no download link", async () => {
    exportApi([{ signed_url: DUMP_URL, status: "complete" }]);
    await expect(checkD1Export(config(), "bookmark-1")).rejects.toThrow(
      "D1 export finished without a download link",
    );
  });

  it("gzips the dump into the backup bucket with its bookmark", async () => {
    exportApi([]);
    const backups = fakeBucket();
    const result = await storeD1Dump(
      config({ backups }),
      DUMP_URL,
      "d1/reptiles-db/x.sql.gz",
      "bookmark-1",
    );
    const stored = backups.objects.get("d1/reptiles-db/x.sql.gz")!;
    expect(result).toEqual({
      key: "d1/reptiles-db/x.sql.gz",
      size: stored.body.byteLength,
    });
    expect(await gunzip(stored.body)).toBe("CREATE TABLE species;");
    expect(stored.customMetadata).toEqual({ bookmark: "bookmark-1" });
    expect(stored.httpMetadata).toEqual({ contentType: "application/gzip" });
  });

  it("uploads a large dump in equal parts with a shorter last part", async () => {
    const dump = Array.from(
      { length: 4000 },
      (_, index) =>
        `INSERT INTO t VALUES (${index}, '${(index * 7919).toString(36)}');`,
    ).join("\n");
    server.use(http.get(DUMP_URL, () => new HttpResponse(dump)));
    const backups = fakeBucket();
    await storeD1Dump(config({ backups }), DUMP_URL, "d1/x.sql.gz", "b", 1024);
    const sizes = backups.partSizes;
    expect(sizes.length).toBeGreaterThan(2);
    expect(sizes.slice(0, -1).every((size) => size === 1024)).toBe(true);
    expect(sizes.at(-1)).toBeLessThanOrEqual(1024);
    expect(await gunzip(backups.objects.get("d1/x.sql.gz")!.body)).toBe(dump);
  });

  it("aborts the upload when a part fails", async () => {
    exportApi([]);
    const backups = fakeBucket();
    backups.failPart(new Error("R2 down"));
    await expect(
      storeD1Dump(config({ backups }), DUMP_URL, "d1/x.sql.gz", "b"),
    ).rejects.toThrow("R2 down");
    expect(backups.aborted).toEqual(["d1/x.sql.gz"]);
    expect(backups.objects.has("d1/x.sql.gz")).toBe(false);
  });

  it("fails when the dump cannot be downloaded", async () => {
    server.use(
      http.get(DUMP_URL, () => new HttpResponse(null, { status: 404 })),
    );
    await expect(
      storeD1Dump(config(), DUMP_URL, "d1/x.sql", "bookmark-1"),
    ).rejects.toThrow("D1 dump download failed (404)");
  });
});

describe("syncCdnPage", () => {
  it("copies missing and changed files and skips identical ones", async () => {
    const source = fakeBucket({ "a.jpg": "aa", "b.jpg": "bb", "c.jpg": "cc" });
    const replica = fakeBucket({ "a.jpg": "aa", "b.jpg": "old" });
    const result = await syncCdnPage(source, replica, undefined, undefined);
    expect(result).toEqual({
      bytes: 4,
      checked: 3,
      copied: 2,
      cursor: undefined,
      lastKey: "c.jpg",
    });
    expect(replica.puts).toEqual(["b.jpg", "c.jpg"]);
    expect(replica.objects.get("c.jpg")?.httpMetadata).toEqual({
      contentType: "image/jpeg",
    });
  });

  it("copies at most ten files at a time", async () => {
    const files = Object.fromEntries(
      Array.from({ length: 25 }, (_, index) => [`f-${index}.jpg`, `${index}`]),
    );
    const source = fakeBucket(files);
    const get = source.get.bind(source);
    let active = 0;
    let peak = 0;
    source.get = async (key) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return get(key);
    };
    const replica = fakeBucket();
    const result = await syncCdnPage(source, replica, undefined, undefined);
    expect(result.copied).toBe(25);
    expect(peak).toBe(10);
    expect(replica.objects.size).toBe(25);
  });

  it("never deletes files that are gone from the source", async () => {
    const source = fakeBucket({ "a.jpg": "aa" });
    const replica = fakeBucket({ "a.jpg": "aa", "deleted.jpg": "dd" });
    await syncCdnPage(source, replica, undefined, undefined);
    expect([...replica.objects.keys()].sort()).toEqual([
      "a.jpg",
      "deleted.jpg",
    ]);
  });

  it("treats a multipart copy of the same size as identical", async () => {
    const source = fakeBucket({ "a.jpg": "aa" });
    const replica = fakeBucket({ "a.jpg": "aa" });
    replica.objects.get("a.jpg")!.etag = "abc-2";
    const result = await syncCdnPage(source, replica, undefined, undefined);
    expect(result.copied).toBe(0);
  });

  it("skips a file deleted between the listing and the copy", async () => {
    const source = fakeBucket({ "a.jpg": "aa" });
    source.failGet("a.jpg");
    const replica = fakeBucket();
    const result = await syncCdnPage(source, replica, undefined, undefined);
    expect(result).toMatchObject({ checked: 1, copied: 0 });
  });

  it("pages through the source and compares each page with its replica range", async () => {
    const files = Object.fromEntries(
      Array.from({ length: 1205 }, (_, index) => [
        `photo-${String(index).padStart(4, "0")}.jpg`,
        `x${index}`,
      ]),
    );
    const source = fakeBucket(files);
    const replica = fakeBucket(files, 400);
    replica.objects.delete("photo-0700.jpg");

    const first = await syncCdnPage(source, replica, undefined, undefined);
    expect(first).toMatchObject({
      checked: 500,
      copied: 0,
      cursor: "|500",
      lastKey: "photo-0499.jpg",
    });
    const second = await syncCdnPage(
      source,
      replica,
      first.cursor,
      first.lastKey,
    );
    expect(second).toMatchObject({ checked: 500, copied: 1, cursor: "|1000" });
    expect(replica.puts).toEqual(["photo-0700.jpg"]);
    const third = await syncCdnPage(
      source,
      replica,
      second.cursor,
      second.lastKey,
    );
    expect(third).toMatchObject({ checked: 205, copied: 0, cursor: undefined });
  });

  it("handles an empty source", async () => {
    const result = await syncCdnPage(
      fakeBucket(),
      fakeBucket(),
      undefined,
      "z.jpg",
    );
    expect(result).toEqual({
      bytes: 0,
      checked: 0,
      copied: 0,
      cursor: undefined,
      lastKey: "z.jpg",
    });
  });
});

describe("messages", () => {
  it("formats sizes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(292_000_000)).toBe("278.5 MB");
    expect(formatBytes(7 * 1024 ** 4)).toBe("7168.0 GB");
  });

  it("summarises a finished backup", () => {
    expect(
      formatBackupSuccess({
        cdn: { bytes: 2048, checked: 56_121, copied: 3 },
        d1: { key: "d1/reptiles-db/x.sql", size: 1024 },
      }),
    ).toBe(
      "✅ reptiles.ge backup done\nD1: d1/reptiles-db/x.sql (1.0 KB)\nCDN: 56,121 files checked, 3 copied (2.0 KB)",
    );
  });

  it("names the reason of a failure", () => {
    expect(formatBackupFailure(new Error("boom"))).toBe(
      "❌ reptiles.ge backup failed\nboom",
    );
    expect(formatBackupFailure("plain")).toBe(
      "❌ reptiles.ge backup failed\nplain",
    );
  });
});

describe("runBackup", () => {
  it("exports D1, copies the CDN and reports to Telegram", async () => {
    const messages = telegramMessages();
    const bodies = exportApi([
      { status: "active" },
      { result: { signed_url: DUMP_URL }, status: "complete" },
    ]);
    const backups = fakeBucket();
    const source = fakeBucket({ "a.jpg": "aa", "b.jpg": "bb" });
    const replica = fakeBucket({ "a.jpg": "aa" });
    const { names, step } = recordingStep();

    const summary = await runBackup(
      bindings({
        BACKUP_BUCKET: backups,
        CDN_BUCKET: source as unknown as ApiBindings["CDN_BUCKET"],
        CDN_REPLICA_BUCKET: replica,
      }),
      step,
      AT,
      0,
    );

    expect(summary).toEqual({
      cdn: { bytes: 2, checked: 2, copied: 1 },
      d1: {
        key: "d1/reptiles-db/2026-11-29T00-00-00Z.sql.gz",
        size: backups.objects.get("d1/reptiles-db/2026-11-29T00-00-00Z.sql.gz")!
          .body.byteLength,
      },
    });
    expect(names).toEqual([
      "export D1",
      "store D1 dump",
      "copy CDN page 1",
      "report success",
    ]);
    expect(bodies).toEqual([
      { output_format: "polling" },
      { current_bookmark: "bookmark-1", output_format: "polling" },
      { current_bookmark: "bookmark-1", output_format: "polling" },
    ]);
    expect(replica.puts).toEqual(["b.jpg"]);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("✅ reptiles.ge backup done");
  });

  it("walks every CDN page", async () => {
    telegramMessages();
    exportApi([{ result: { signed_url: DUMP_URL }, status: "complete" }]);
    const files = Object.fromEntries(
      Array.from({ length: 1001 }, (_, index) => [
        `p-${index}.jpg`,
        `${index}`,
      ]),
    );
    const { names, step } = recordingStep();
    const summary = await runBackup(
      bindings({
        CDN_BUCKET: fakeBucket(files) as unknown as ApiBindings["CDN_BUCKET"],
      }),
      step,
      AT,
    );
    expect(names.filter((name) => name.startsWith("copy CDN page"))).toEqual([
      "copy CDN page 1",
      "copy CDN page 2",
      "copy CDN page 3",
    ]);
    expect(summary.cdn).toMatchObject({ checked: 1001, copied: 1001 });
  });

  it("gives up when the export never finishes and reports the failure", async () => {
    const messages = telegramMessages();
    const bodies = exportApi([]) as Array<Record<string, string>>;
    const { names, step } = recordingStep();
    await expect(runBackup(bindings(), step, AT, 0)).rejects.toThrow(
      "D1 export did not finish in time",
    );
    expect(bodies.filter((body) => "current_bookmark" in body)).toHaveLength(
      300,
    );
    expect(names.at(-1)).toBe("report failure");
    expect(messages).toEqual([
      "❌ reptiles.ge backup failed\nD1 export did not finish in time",
    ]);
  });

  it("reports a missing configuration before doing any work", async () => {
    const messages = telegramMessages();
    const { names, step } = recordingStep();
    await expect(
      runBackup(bindings({ D1_EXPORT_TOKEN: undefined }), step, AT),
    ).rejects.toThrow("Backup is not configured: D1_EXPORT_TOKEN");
    expect(names).toEqual(["report failure"]);
    expect(messages[0]).toContain("D1_EXPORT_TOKEN");
  });
});
