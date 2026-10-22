export type ApiDatabase = {
  batch: (statements: ApiStatement[]) => Promise<Array<{ results: unknown[] }>>;
  prepare: (query: string) => ApiStatement;
};

type ApiStatement = {
  all: <T>() => Promise<{ results: T[] }>;
  bind: (...values: unknown[]) => ApiStatement;
  first: <T>() => Promise<null | T>;
  run: () => Promise<unknown>;
};
