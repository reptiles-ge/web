import { sendTelegramMessage } from "@/lib/telegram";

import type {
  ApiBindings,
  BackupBucket,
  BackupObject,
  BackupUpload,
  BackupUploadedPart,
} from "../env";

const CDN_PAGE_SIZE = 500;
const REPLICA_PAGE_SIZE = 1000;
const COPY_CONCURRENCY = 10;
const EXPORT_POLLS = 30;
const EXPORT_POLL_DELAY = "20 seconds";
const REQUEST_TIMEOUT_MS = 30_000;
const D1_PREFIX = "d1/";
const DUMP_PART_SIZE = 10 * 1024 * 1024;

const BACKUP_STEP = {
  retries: { backoff: "exponential", delay: "30 seconds", limit: 3 },
  timeout: "15 minutes",
} as const;

export type BackupConfig = {
  accountId: string;
  backups: BackupBucket;
  databaseId: string;
  replica: BackupBucket;
  source: BackupBucket;
  token: string;
};

export type BackupStep = {
  do: <T>(
    name: string,
    config: typeof BACKUP_STEP,
    run: () => Promise<T>,
  ) => Promise<T>;
  sleep: (name: string, duration: string) => Promise<void>;
};

export type BackupSummary = {
  cdn: { bytes: number; checked: number; copied: number };
  d1: { key: string; size: number };
};

export type CdnPageResult = {
  bytes: number;
  checked: number;
  copied: number;
  cursor?: string;
  lastKey?: string;
};

type ExportResponse = {
  errors?: Array<{ message?: string }>;
  result?: ExportResult;
  success?: boolean;
};

type ExportResult = {
  at_bookmark?: string;
  error?: string;
  result?: { filename?: string; signed_url?: string };
  status?: string;
};

export function backupConfig(env: ApiBindings): BackupConfig {
  const values = {
    BACKUP_ACCOUNT_ID: env.BACKUP_ACCOUNT_ID,
    BACKUP_BUCKET: env.BACKUP_BUCKET,
    BACKUP_DATABASE_ID: env.BACKUP_DATABASE_ID,
    CDN_BUCKET: env.CDN_BUCKET,
    CDN_REPLICA_BUCKET: env.CDN_REPLICA_BUCKET,
    D1_EXPORT_TOKEN: env.D1_EXPORT_TOKEN,
  };
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`Backup is not configured: ${missing.join(", ")}`);
  }
  return {
    accountId: values.BACKUP_ACCOUNT_ID!,
    backups: values.BACKUP_BUCKET!,
    databaseId: values.BACKUP_DATABASE_ID!,
    replica: values.CDN_REPLICA_BUCKET!,
    source: values.CDN_BUCKET as unknown as BackupBucket,
    token: values.D1_EXPORT_TOKEN!,
  };
}

export async function checkD1Export(config: BackupConfig, bookmark: string) {
  const result = await exportRequest(config, { current_bookmark: bookmark });
  if (result.status === "error") {
    throw new Error(`D1 export failed: ${result.error ?? "unknown error"}`);
  }
  if (result.status !== "complete") return null;
  const signedUrl = result.result?.signed_url;
  if (!signedUrl) throw new Error("D1 export finished without a download link");
  return signedUrl;
}

export function d1BackupKey(databaseName: string, at: Date) {
  const stamp = at
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replaceAll(":", "-");
  return `${D1_PREFIX}${databaseName}/${stamp}.sql.gz`;
}

export function formatBackupFailure(error: unknown) {
  const reason = error instanceof Error ? error.message : String(error);
  return `❌ reptiles.ge backup failed\n${reason}`;
}

export function formatBackupSuccess(summary: BackupSummary) {
  return [
    "✅ reptiles.ge backup done",
    `D1: ${summary.d1.key} (${formatBytes(summary.d1.size)})`,
    `CDN: ${summary.cdn.checked.toLocaleString("en-US")} files checked, ${summary.cdn.copied.toLocaleString("en-US")} copied (${formatBytes(summary.cdn.bytes)})`,
  ].join("\n");
}

export function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
}

export async function runBackup(env: ApiBindings, step: BackupStep, at: Date) {
  const telegram = {
    chatId: env.TELEGRAM_CHAT_ID,
    token: env.TELEGRAM_BOT_TOKEN,
  };
  try {
    const config = backupConfig(env);
    const d1 = await backupD1(config, step, at);
    const cdn = await backupCdn(config, step);
    const summary = { cdn, d1 };
    await step.do("report success", BACKUP_STEP, () =>
      sendTelegramMessage(telegram, formatBackupSuccess(summary)),
    );
    return summary;
  } catch (error) {
    await step.do("report failure", BACKUP_STEP, () =>
      sendTelegramMessage(telegram, formatBackupFailure(error)),
    );
    throw error;
  }
}

export async function startD1Export(config: BackupConfig) {
  const result = await exportRequest(config, {});
  if (!result.at_bookmark) {
    throw new Error("D1 export did not return a bookmark");
  }
  return result.at_bookmark;
}

export async function storeD1Dump(
  config: BackupConfig,
  signedUrl: string,
  key: string,
  bookmark: string,
  partSize = DUMP_PART_SIZE,
) {
  const response = await fetch(signedUrl);
  if (!response.ok || !response.body) {
    throw new Error(`D1 dump download failed (${response.status})`);
  }
  const upload = await config.backups.createMultipartUpload(key, {
    customMetadata: { bookmark },
    httpMetadata: { contentType: "application/gzip" },
  });
  try {
    const parts = await uploadParts(
      upload,
      response.body.pipeThrough(new CompressionStream("gzip")),
      partSize,
    );
    const stored = await upload.complete(parts);
    return { key, size: stored.size };
  } catch (error) {
    await upload.abort().catch(() => undefined);
    throw error;
  }
}

export async function syncCdnPage(
  source: BackupBucket,
  replica: BackupBucket,
  cursor: string | undefined,
  after: string | undefined,
): Promise<CdnPageResult> {
  const page = await source.list(
    cursor ? { cursor, limit: CDN_PAGE_SIZE } : { limit: CDN_PAGE_SIZE },
  );
  const lastKey = page.objects.at(-1)?.key;
  const existing = lastKey
    ? await replicaRange(replica, after, lastKey)
    : new Map<string, BackupObject>();
  const changed = page.objects.filter((object) => {
    const copy = existing.get(object.key);
    return !copy || !sameObject(object, copy);
  });
  let copied = 0;
  let bytes = 0;
  let next = 0;
  const copyNext = async () => {
    while (next < changed.length) {
      const object = changed[next]!;
      next += 1;
      const body = await source.get(object.key);
      if (!body) continue;
      await replica.put(object.key, body.body, {
        customMetadata: body.customMetadata,
        httpMetadata: body.httpMetadata,
      });
      copied += 1;
      bytes += body.size;
    }
  };
  await Promise.all(
    Array.from(
      { length: Math.min(COPY_CONCURRENCY, changed.length) },
      copyNext,
    ),
  );
  return {
    bytes,
    checked: page.objects.length,
    copied,
    cursor: page.truncated ? page.cursor : undefined,
    lastKey: lastKey ?? after,
  };
}

async function backupCdn(
  config: BackupConfig,
  step: BackupStep,
): Promise<BackupSummary["cdn"]> {
  const totals = { bytes: 0, checked: 0, copied: 0 };
  let cursor: string | undefined;
  let after: string | undefined;
  let page = 0;
  do {
    page += 1;
    const pageCursor = cursor;
    const pageAfter = after;
    const result = await step.do(`copy CDN page ${page}`, BACKUP_STEP, () =>
      syncCdnPage(config.source, config.replica, pageCursor, pageAfter),
    );
    totals.bytes += result.bytes;
    totals.checked += result.checked;
    totals.copied += result.copied;
    cursor = result.cursor;
    after = result.lastKey;
  } while (cursor);
  return totals;
}

async function backupD1(
  config: BackupConfig,
  step: BackupStep,
  at: Date,
): Promise<BackupSummary["d1"]> {
  const bookmark = await step.do("start D1 export", BACKUP_STEP, () =>
    startD1Export(config),
  );
  let signedUrl: null | string = null;
  for (let poll = 1; poll <= EXPORT_POLLS && !signedUrl; poll += 1) {
    signedUrl = await step.do(`check D1 export ${poll}`, BACKUP_STEP, () =>
      checkD1Export(config, bookmark),
    );
    if (!signedUrl) {
      await step.sleep(`wait for D1 export ${poll}`, EXPORT_POLL_DELAY);
    }
  }
  if (!signedUrl) throw new Error("D1 export did not finish in time");
  const url = signedUrl;
  return step.do("store D1 dump", BACKUP_STEP, () =>
    storeD1Dump(config, url, d1BackupKey("reptiles-db", at), bookmark),
  );
}

function exportFailure(status: number, json: ExportResponse) {
  const reason = json.errors
    ?.map((error) => error.message)
    .filter(Boolean)
    .join("; ");
  return `D1 export request failed (${status})${reason ? `: ${reason}` : ""}`;
}

async function exportRequest(
  config: BackupConfig,
  body: Record<string, string>,
): Promise<ExportResult> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/export`,
    {
      body: JSON.stringify({ output_format: "polling", ...body }),
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  );
  if (!response.ok) {
    const failed = (await response.json().catch(() => ({}))) as ExportResponse;
    throw new Error(exportFailure(response.status, failed));
  }
  const json = (await response.json().catch(() => ({}))) as ExportResponse;
  if (!json.success) {
    throw new Error(exportFailure(response.status, json));
  }
  return json.result ?? {};
}

async function replicaRange(
  replica: BackupBucket,
  after: string | undefined,
  lastKey: string,
) {
  const found = new Map<string, BackupObject>();
  let cursor: string | undefined;
  do {
    const page = await replica.list(
      cursor
        ? { cursor, limit: REPLICA_PAGE_SIZE }
        : { limit: REPLICA_PAGE_SIZE, startAfter: after },
    );
    for (const object of page.objects) {
      if (object.key > lastKey) return found;
      found.set(object.key, object);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return found;
}

function sameObject(source: BackupObject, copy: BackupObject) {
  if (source.size !== copy.size) return false;
  if (source.etag === copy.etag) return true;
  return source.etag.includes("-") || copy.etag.includes("-");
}

async function uploadParts(
  upload: BackupUpload,
  stream: ReadableStream<Uint8Array>,
  partSize: number,
) {
  const parts: BackupUploadedPart[] = [];
  const buffer = new Uint8Array(partSize);
  let filled = 0;
  const send = async () => {
    parts.push(
      await upload.uploadPart(parts.length + 1, buffer.slice(0, filled)),
    );
    filled = 0;
  };
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    let offset = 0;
    while (offset < value.byteLength) {
      const take = Math.min(partSize - filled, value.byteLength - offset);
      buffer.set(value.subarray(offset, offset + take), filled);
      filled += take;
      offset += take;
      if (filled === partSize) await send();
    }
  }
  if (filled > 0 || parts.length === 0) await send();
  return parts;
}
