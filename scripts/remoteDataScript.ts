import fs from "node:fs";
import path from "node:path";
import { format, resolveConfig } from "prettier";

type PoliteJsonOptions = { gapMs: number; userAgent: string };

export function createPoliteJson({ gapMs, userAgent }: PoliteJsonOptions) {
  const lastRequestAt = new Map<string, number>();
  const responseCache = new Map<string, Promise<unknown>>();

  async function politeFetch<T>(
    url: URL,
    init: RequestInit,
    attempt = 1,
  ): Promise<T> {
    const wait = (lastRequestAt.get(url.host) ?? 0) + gapMs - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt.set(url.host, Date.now());

    try {
      const response = await fetch(url, {
        ...init,
        headers: { "User-Agent": userAgent, ...init.headers },
      });
      if (!response.ok) {
        throw new Error(
          `${url.toString()} failed with HTTP ${response.status}.`,
        );
      }
      return (await response.json()) as T;
    } catch (error) {
      if (attempt >= 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      return politeFetch(url, init, attempt + 1);
    }
  }

  return function cachedJson<T>(url: URL, init: RequestInit = {}): Promise<T> {
    const cacheKey = `${init.method ?? "GET"} ${url.toString()} ${typeof init.body === "string" ? init.body : ""}`;
    const cached = responseCache.get(cacheKey);
    if (cached) return cached as Promise<T>;
    const request = politeFetch<T>(url, init);
    responseCache.set(cacheKey, request);
    return request;
  };
}

export async function writeOrCheckModule(
  outFile: string,
  source: string,
  check: boolean,
) {
  const output = await format(source, {
    ...(await resolveConfig(outFile)),
    filepath: outFile,
  });
  const relative = path.relative(process.cwd(), outFile);
  if (check) {
    const current = fs.existsSync(outFile)
      ? fs.readFileSync(outFile, "utf8")
      : "";
    if (current !== output) {
      console.error(`${relative} is out of date.`);
      process.exitCode = 1;
    }
    return;
  }
  fs.writeFileSync(outFile, output);
  console.log(`Wrote ${relative}`);
}
