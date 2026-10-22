import { http } from "msw";

import type { ApiBindings } from "@/api/env";

import { app } from "@/api/app";
import { createSpeciesTestDatabase } from "@/api/testing/sqliteDatabase";

let env: ApiBindings | undefined;

export const reptilesApi = http.all(
  "https://api.reptiles.ge/*",
  async ({ request }) => {
    env ??= { DB: createSpeciesTestDatabase().db };
    return app.request(request, undefined, env);
  },
);
