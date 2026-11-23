import type { CdnBucket } from "../env";

export type MemoryBucket = CdnBucket & {
  failList: (error: Error | null) => void;
  failPut: (error: Error | null) => void;
  listCalls: () => number;
  puts: () => Array<{ contentType: string; key: string }>;
};

export function memoryBucket(
  initial: string[] = [],
  pageSize = 1000,
): MemoryBucket {
  const keys = new Set(initial);
  const written: Array<{ contentType: string; key: string }> = [];
  let listError: Error | null = null;
  let putError: Error | null = null;
  let lists = 0;

  return {
    failList: (error) => {
      listError = error;
    },
    failPut: (error) => {
      putError = error;
    },
    list({ cursor, delimiter, limit = 1000, prefix = "" }) {
      lists += 1;
      if (listError) return Promise.reject(listError);
      const matching = [...keys]
        .filter((key) => key.startsWith(prefix))
        .filter(
          (key) => !delimiter || !key.slice(prefix.length).includes(delimiter),
        )
        .sort();
      const start = cursor ? Number(cursor) : 0;
      const size = Math.min(limit, pageSize);
      const objects = matching
        .slice(start, start + size)
        .map((key) => ({ key }));
      const next = start + size;
      return Promise.resolve(
        next < matching.length
          ? { cursor: String(next), objects, truncated: true as const }
          : { objects, truncated: false as const },
      );
    },
    listCalls: () => lists,
    put(key, _value, { httpMetadata }) {
      if (putError) return Promise.reject(putError);
      keys.add(key);
      written.push({ contentType: httpMetadata.contentType, key });
      return Promise.resolve({});
    },
    puts: () => [...written],
  };
}
