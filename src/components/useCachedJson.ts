"use client";

import { useEffect, useState } from "react";

export function useCachedJson<T>(
  url: null | string,
  seed: Record<string, T>,
  delayMs = 0,
) {
  const [cache, setCache] = useState<Record<string, T>>(seed);
  const [failedUrl, setFailedUrl] = useState<null | string>(null);
  const failed = url !== null && failedUrl === url;
  const hit = url === null ? undefined : cache[url];

  useEffect(() => {
    if (url === null || hit !== undefined || failed) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(url, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`Request ${response.status}`);
          return response.json() as Promise<T>;
        })
        .then((body) => setCache((current) => ({ ...current, [url]: body })))
        .catch(() => {
          if (!controller.signal.aborted) setFailedUrl(url);
        });
    }, delayMs);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [delayMs, failed, hit, url]);

  return { data: hit, failed, retry: () => setFailedUrl(null) };
}
