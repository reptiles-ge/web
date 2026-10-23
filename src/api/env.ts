import type { ApiDatabase } from "./db/database";

export type ApiBindings = {
  ALLOWED_ORIGINS?: string;
  API_WRITE_TOKEN?: string;
  DB: ApiDatabase;
  RATING_GLOBAL_LIMITER?: RateLimiter;
  RATING_VISITOR_LIMITER?: RateLimiter;
  REVALIDATE_TOKEN?: string;
  SITE?: { fetch: (request: Request) => Promise<Response> };
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
};

export type ApiEnv = {
  Bindings: ApiBindings;
};

export type RateLimiter = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};
