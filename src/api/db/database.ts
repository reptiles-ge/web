export type ApiDatabase = {
  batch: (statements: ApiStatement[]) => Promise<Array<{ results: unknown[] }>>;
  prepare: (query: string) => ApiStatement;
};

// The subset of D1's result `meta` we read (https://developers.cloudflare.com/d1/observability/debug-d1/)
export type ApiQueryMeta = {
  duration?: number;
  served_by_primary?: boolean;
  served_by_region?: string;
  timings?: { sql_duration_ms?: number };
  total_attempts?: number;
};

type ApiStatement = {
  all: <T>() => Promise<{ meta?: ApiQueryMeta; results: T[] }>;
  bind: (...values: unknown[]) => ApiStatement;
  first: <T>() => Promise<null | T>;
  run: () => Promise<unknown>;
};
