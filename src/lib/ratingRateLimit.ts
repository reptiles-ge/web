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
  if (new URL(request.url).pathname !== RATING_PATH) return null;

  const visitorLimiter = readLimiter(env, RATING_VISITOR_LIMITER);
  const globalLimiter = readLimiter(env, RATING_GLOBAL_LIMITER);
  const visitor = request.headers.get("cf-connecting-ip") ?? "unknown";

  if (visitorLimiter && !(await visitorLimiter.limit({ key: visitor })).success)
    return tooMany();
  if (globalLimiter && !(await globalLimiter.limit({ key: "all" })).success)
    return tooMany();
  return null;
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
