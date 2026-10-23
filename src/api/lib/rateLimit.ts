import type { RateLimiter } from "../env";

export async function withinLimit(
  limiter: RateLimiter | undefined,
  key: string,
  label: string,
) {
  if (!limiter) return true;
  try {
    return (await limiter.limit({ key })).success;
  } catch (error) {
    console.error(`${label} rate limit check failed`, error);
    return true;
  }
}
