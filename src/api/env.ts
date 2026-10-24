import type { ApiDatabase } from "./db/database";
import type { SessionUser } from "./db/users";

export type ApiBindings = {
  ADMIN_LIMITER?: RateLimiter;
  ALLOWED_ORIGINS?: string;
  API_KEY_LIMITER?: RateLimiter;
  API_KEY_MODE?: string;
  API_WRITE_TOKEN?: string;
  BUNNY_CDN_BASE_URL?: string;
  BUNNY_STORAGE_ACCESS_KEY?: string;
  BUNNY_STORAGE_REGION?: string;
  BUNNY_STORAGE_ZONE?: string;
  DB: ApiDatabase;
  LOGIN_LIMITER?: RateLimiter;
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
  Variables: { user?: SessionUser };
};

export type RateLimiter = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};
