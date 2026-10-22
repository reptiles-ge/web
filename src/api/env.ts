import type { ApiDatabase } from "./db/database";

export type ApiBindings = {
  API_WRITE_TOKEN?: string;
  DB: ApiDatabase;
};

export type ApiEnv = {
  Bindings: ApiBindings;
};
