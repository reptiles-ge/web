import type { ApiDatabase } from "./db/database";
import type { SessionUser } from "./db/users";

export type ApiBindings = {
  ACCESS_REQUEST_GLOBAL_LIMITER?: RateLimiter;
  ACCESS_REQUEST_VISITOR_LIMITER?: RateLimiter;
  ADMIN_LIMITER?: RateLimiter;
  ALLOWED_ORIGINS?: string;
  API_KEY_LIMITER?: RateLimiter;
  API_KEY_MODE?: string;
  API_WRITE_TOKEN?: string;
  BACKUP_ACCOUNT_ID?: string;
  BACKUP_BUCKET?: BackupBucket;
  BACKUP_DATABASE_ID?: string;
  CACHE_GENERATION_TTL_MS?: string;
  CDN_BUCKET?: CdnBucket;
  CDN_REPLICA_BUCKET?: BackupBucket;
  D1_EXPORT_TOKEN?: string;
  DB: ApiDatabase;
  LOGIN_LIMITER?: RateLimiter;
  MCP_LIMITER?: RateLimiter;
  RATING_GLOBAL_LIMITER?: RateLimiter;
  RATING_VISITOR_LIMITER?: RateLimiter;
  REVALIDATE_TOKEN?: string;
  SITE?: { fetch: (request: Request) => Promise<Response> };
  SITE_API_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  UPLOAD_LIMITER?: RateLimiter;
  VIEW_LIMITER?: RateLimiter;
};

export type ApiEnv = {
  Bindings: ApiBindings;
  Variables: { cacheTags?: string[]; user?: SessionUser };
};

export type BackupBucket = {
  createMultipartUpload: (
    key: string,
    options: {
      customMetadata?: Record<string, string>;
      httpMetadata?: Record<string, unknown>;
    },
  ) => Promise<BackupUpload>;
  get: (key: string) => Promise<BackupObjectBody | null>;
  list: (options: {
    cursor?: string;
    limit?: number;
    startAfter?: string;
  }) => Promise<
    | { cursor: string; objects: BackupObject[]; truncated: true }
    | { objects: BackupObject[]; truncated: false }
  >;
  put: (
    key: string,
    value: ArrayBuffer | ReadableStream,
    options: {
      customMetadata?: Record<string, string>;
      httpMetadata?: Record<string, unknown>;
    },
  ) => Promise<null | { size: number }>;
};

export type BackupObject = { etag: string; key: string; size: number };

export type BackupObjectBody = {
  body: ReadableStream;
  customMetadata?: Record<string, string>;
  httpMetadata?: Record<string, unknown>;
  size: number;
};

export type BackupUpload = {
  abort: () => Promise<void>;
  complete: (parts: BackupUploadedPart[]) => Promise<{ size: number }>;
  uploadPart: (
    partNumber: number,
    value: Uint8Array,
  ) => Promise<BackupUploadedPart>;
};

export type BackupUploadedPart = { etag: string; partNumber: number };

export type CdnBucket = {
  list: (options: {
    cursor?: string;
    delimiter?: string;
    limit?: number;
    prefix?: string;
  }) => Promise<
    | { cursor: string; objects: Array<{ key: string }>; truncated: true }
    | { objects: Array<{ key: string }>; truncated: false }
  >;
  put: (
    key: string,
    value: Uint8Array<ArrayBuffer>,
    options: { httpMetadata: { contentType: string } },
  ) => Promise<unknown>;
};

export type RateLimiter = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};
