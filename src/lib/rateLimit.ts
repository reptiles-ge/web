const MAX_KEYS = 2000;

export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const hits = new Map<string, number[]>();

  return function allow(key: string, now = Date.now()) {
    const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > MAX_KEYS) {
      for (const [other, times] of hits) {
        if (times.every((at) => now - at >= windowMs)) hits.delete(other);
      }
    }
    return true;
  };
}
