const RATING_PATH = "/api/rating";
const RATING_VISITOR_LIMITER = "RATING_VISITOR_LIMITER";
const RATING_GLOBAL_LIMITER = "RATING_GLOBAL_LIMITER";

type RateLimiter = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};

export async function ratingRateLimitResponse(
  request: Request,
  env: unknown,
): Promise<null | Response> {
  if (request.method !== "POST") return null;
  const url = new URL(request.url);
  if (url.pathname !== RATING_PATH) return null;
  if (request.headers.get("origin") !== url.origin) return null;

  const visitorLimiter = readLimiter(env, RATING_VISITOR_LIMITER);
  const globalLimiter = readLimiter(env, RATING_GLOBAL_LIMITER);
  const visitor = request.headers.get("cf-connecting-ip") ?? "unknown";

  if (!(await allowed(visitorLimiter, visitor))) return tooMany();
  if (!(await allowed(globalLimiter, "all"))) return tooMany();
  return null;
}

async function allowed(limiter: null | RateLimiter, key: string) {
  if (!limiter) return true;
  try {
    return (await limiter.limit({ key })).success;
  } catch (error) {
    console.error("Rating rate limit check failed", error);
    return true;
  }
}

function readLimiter(env: unknown, name: string): null | RateLimiter {
  if (!env || typeof env !== "object") return null;
  const binding = (env as Record<string, unknown>)[name];
  if (
    !binding ||
    typeof binding !== "object" ||
    typeof (binding as RateLimiter).limit !== "function"
  ) {
    return null;
  }
  return binding as RateLimiter;
}

function tooMany() {
  return Response.json(
    { error: "Too many ratings" },
    { headers: { "X-Robots-Tag": "noindex, nofollow" }, status: 429 },
  );
}
